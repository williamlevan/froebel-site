import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId; // Change from string to ObjectId
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    createdAt: Date;
    lastLoginAt?: Date;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        console.log('🔍 Looking for user with email:', email);
        const client = await clientPromise;
        console.log('✅ MongoDB client connected');
        const db = client.db('users');
        console.log('✅ Database selected:', 'users');
        const users = db.collection<User>('users');
        console.log('✅ Collection selected:', 'users');

        const user = await users.findOne({ email: email.toLowerCase() });
        console.log('🔍 User found:', user ? 'YES' : 'NO');

        if (user) {
            console.log('👤 User details:', {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            });
        }

        return user;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    }
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User | null> {
    try {
        const client = await clientPromise;
        const db = client.db('users');
        const users = db.collection<User>('users');

        const newUser: User = {
            ...userData,
            createdAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        if (result.insertedId) {
            return { ...newUser, _id: result.insertedId }; // Return ObjectId directly
        }

        return null;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

export async function updateUserLastLogin(email: string): Promise<boolean> {
    try {
        const client = await clientPromise;
        const db = client.db('users');
        const users = db.collection<User>('users');

        const result = await users.updateOne(
            { email },
            { $set: { lastLoginAt: new Date() } }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error updating user last login:', error);
        return false;
    }
}

export async function updateUser(userId: string, updateData: { firstName: string; lastName: string }): Promise<boolean> {
  try {
    console.log('🔄 Updating user:', userId, 'with data:', updateData);
    
    const client = await clientPromise;
    const db = client.db('users');
    const users = db.collection<User>('users');
    
    const result = await users.updateOne(
      { _id: new ObjectId(userId) }, // Convert string to ObjectId
      { $set: updateData }
    );
    
    console.log('✅ User updated:', result.modifiedCount > 0);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return false;
  }
}
