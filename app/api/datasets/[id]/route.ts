import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("starbrains")
    const dataset = await db.collection("datasets").findOne({ _id: new ObjectId(params.id) })
    if (!dataset) {
      return NextResponse.json({ message: 'Dataset not found' }, { status: 404 })
    }
    return NextResponse.json(dataset)
  } catch (error) {
    console.error('Error fetching dataset:', error)
    return NextResponse.json({ message: 'Failed to fetch dataset' }, { status: 500 })
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

    const result = await db.collection("datasets").updateOne(
      { _id: new ObjectId(params.id), userId },
      { $set: { name, description, url, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Dataset not found or you do not have permission to update it' }, { status: 404 })
    }

    const updatedDataset = await db.collection("datasets").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedDataset)
  } catch (error) {
    console.error('Error updating dataset:', error)
    return NextResponse.json({ message: 'Failed to update dataset' }, { status: 500 })
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

    const result = await db.collection("datasets").deleteOne({ _id: new ObjectId(params.id), userId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Dataset not found or you do not have permission to delete it' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Dataset deleted successfully' })
  } catch (error) {
    console.error('Error deleting dataset:', error)
    return NextResponse.json({ message: 'Failed to delete dataset' }, { status: 500 })
  }
}