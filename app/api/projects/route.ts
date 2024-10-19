import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await db.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ message: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, url } = await req.json()

    if (!name || !description || !url) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (!validateUrl(url)) {
      return NextResponse.json({ message: 'Invalid URL' }, { status: 400 })
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        url,
        userId,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ message: 'Failed to create project' }, { status: 500 })
  }
}

function validateUrl(url: string) {
  const supportedDomains = ['github.com', 'bucketlist.com', 'deepnote.com']
  try {
    const parsedUrl = new URL(url)
    return supportedDomains.some(domain => parsedUrl.hostname.includes(domain)) ||
           parsedUrl.hostname.includes('ai') ||
           parsedUrl.hostname.includes('ml') ||
           parsedUrl.hostname.includes('ds')
  } catch {
    return false
  }
}