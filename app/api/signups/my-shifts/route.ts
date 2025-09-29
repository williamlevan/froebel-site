import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const userId = searchParams.get('userId');
        const skip = (page - 1) * limit;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const signupsDb = client.db('signups');
        const signups = signupsDb.collection('signups');
        const shiftsDb = client.db('shifts');
        const shifts = shiftsDb.collection('shifts');

        // Get user's signups
        const userSignups = await signups
            .find({ userId })
            .toArray();

        if (userSignups.length === 0) {
            return NextResponse.json({
                shifts: {},
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalCount: 0,
                    hasNext: false,
                    hasPrev: false
                }
            });
        }

        const schoolSignups = userSignups.filter(signup => signup.type === 'school');
        const warehouseSignups = userSignups.filter(signup => signup.type === 'warehouse');

        // Get shift IDs from signups
        const shiftIds = warehouseSignups
            .map(signup => signup.shiftId)
            .filter(Boolean)
            .map(id => new ObjectId(id));

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter to only include shifts from today onwards
        const filter = {
            _id: { $in: shiftIds },
            date: { $gte: today }
        };

        const totalCount = await shifts.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);

        // Get shifts with pagination and date filter
        const warehouseShiftsData = await shifts
            .find(filter)
            .sort({ date: 1, startTime: 1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        interface UnifiedShift {
            _id: string;
            title: string | null;
            date: string;
            startTime: string;
            endTime: string;
            location: string;
            description: string | null;
            maxVolunteers: number | null;
            spotsFilled: number | null;
            type: string;
        }

        // Get spots filled count for each shift
        const formattedWarehouseShifts = await Promise.all(
            warehouseShiftsData.map(async (shift) => {
                const spotsFilled = await signups.countDocuments({ shiftId: shift._id?.toString() });
                return {
                    _id: shift._id?.toString(),
                    title: shift.title,
                    date: shift.date,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    location: shift.location,
                    description: shift.description,
                    maxVolunteers: shift.maxVolunteers,
                    spotsFilled,
                    type: 'warehouse'
                } as UnifiedShift;
            })
        );

        const formattedSchoolShifts = await Promise.all(
            schoolSignups.map(async (signup) => {
                return {
                    _id: signup._id?.toString(),
                    title: 'My Custom Shift',
                    date: signup.date,
                    startTime: signup.startTime,
                    endTime: signup.endTime,
                    location: signup.location,
                    description: signup.comments,
                    maxVolunteers: null,
                    spotsFilled: null,
                    type: 'school'
                } as UnifiedShift;
            })
        )

        // Group shifts by date
        const groupedShifts: { [date: string]: any[] } = {};
        formattedWarehouseShifts.forEach(shift => {
            const date = shift.date;
            if (!groupedShifts[date]) {
                groupedShifts[date] = [];
            }
            groupedShifts[date].push(shift);
        });

        formattedSchoolShifts.forEach(shift => {
            const date = shift.date;
            if (!groupedShifts[date]) {
                groupedShifts[date] = [];
            }
            groupedShifts[date].push(shift);
        });

        return NextResponse.json({
            shifts: groupedShifts,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching user shifts:', error);
        return NextResponse.json({ error: 'Failed to fetch user shifts' }, { status: 500 });
    }
}
