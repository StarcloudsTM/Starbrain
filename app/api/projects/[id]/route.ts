import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const project = await db.project.update({
      where: { id: params.id, userId },
      data: { name, description, url },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ message: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.project.delete({
      where: { id: params.id, userId },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 })
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