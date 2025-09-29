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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const author = searchParams.get('author')
  const limit = searchParams.get('limit')

  let filteredPosts = posts

  if (author) {
    filteredPosts = posts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    )
  }

  if (limit) {
    const limitNum = parseInt(limit)
    if (!isNaN(limitNum)) {
      filteredPosts = filteredPosts.slice(0, limitNum)
    }
  }

  return NextResponse.json({
    posts: filteredPosts,
    count: filteredPosts.length,
    total: posts.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, author } = body

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      )
    }

    const newPost = {
      id: posts.length + 1,
      title,
      content,
      author,
      createdAt: new Date().toISOString()
    }

    posts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }
}
