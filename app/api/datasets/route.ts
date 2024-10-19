import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [files] = await storage.bucket().getFiles({ prefix: `datasets/${userId}/` })
    const datasets = await Promise.all(files.map(async (file) => {
      const [metadata] = await file.getMetadata()
      return {
        id: file.name,
        name: metadata.metadata?.name || file.name.split('/').pop() || 'Unnamed Dataset',
        description: metadata.metadata?.description || '',
        uploadedBy: metadata.metadata?.uploadedBy || userId,
        createdAt: metadata.timeCreated,
        fileSize: Number(metadata.size) || 0,  // Ensure this is always a number
      }
    }))
    return NextResponse.json(datasets)
  } catch (error) {
    console.error('Error fetching datasets:', error)
    return NextResponse.json({ message: 'Failed to fetch datasets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File

    if (!name || !file) {
      return NextResponse.json({ message: 'Name and file are required' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must not exceed 50MB' }, { status: 400 })
    }

    const fileBuffer = await file.arrayBuffer()
    const fileName = `datasets/${userId}/${Date.now()}_${file.name}`
    const fileUpload = storage.bucket().file(fileName)

    await fileUpload.save(Buffer.from(fileBuffer), {
      metadata: {
        contentType: file.type,
        metadata: {
          name,
          description,
          uploadedBy: userId,
        }
      }
    })

    const [metadata] = await fileUpload.getMetadata()

    return NextResponse.json({
      id: fileName,
      name,
      description,
      uploadedBy: userId,
      createdAt: metadata.timeCreated,
      fileSize: Number(metadata.size) || 0,  // Ensure this is always a number
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading dataset:', error)
    return NextResponse.json({ message: 'Failed to upload dataset' }, { status: 500 })
  }
}