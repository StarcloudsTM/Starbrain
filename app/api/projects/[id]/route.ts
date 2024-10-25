import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("starbrains")
    const project = await db.collection("projects").findOne({ _id: new ObjectId(params.id) })
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ message: 'Failed to fetch project' }, { status: 500 })
  }
}

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

    const client = await clientPromise
    const db = client.db("starbrains")

    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(params.id), userId },
      { $set: { name, description, url, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Project not found or you do not have permission to update it' }, { status: 404 })
    }

    const updatedProject = await db.collection("projects").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedProject)
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
    const client = await clientPromise
    const db = client.db("starbrains")

    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(params.id), userId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Project not found or you do not have permission to delete it' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 })
  }
}