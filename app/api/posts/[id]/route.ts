import { NextRequest, NextResponse } from 'next/server'

// Mock data - in a real app, this would come from a database
let posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js App Router',
    content: 'The App Router is a new paradigm for building applications with Next.js...',
    author: 'John Doe',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Building Serverless APIs with Next.js',
    content: 'Next.js makes it easy to build serverless APIs using the App Router...',
    author: 'Jane Smith',
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    content: 'TypeScript provides excellent type safety for your Next.js applications...',
    author: 'Bob Johnson',
    createdAt: '2024-01-17T09:15:00Z'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id)
  const post = posts.find(p => p.id === postId)

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(post)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const postIndex = posts.findIndex(p => p.id === postId)

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, content, author } = body

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      )
    }

    posts[postIndex] = { 
      ...posts[postIndex], 
      title, 
      content, 
      author,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(posts[postIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id)
  const postIndex = posts.findIndex(p => p.id === postId)

  if (postIndex === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  const deletedPost = posts.splice(postIndex, 1)[0]

  return NextResponse.json({
    message: 'Post deleted successfully',
    deletedPost
  })
}
