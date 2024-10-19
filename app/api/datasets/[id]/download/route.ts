import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fileId = decodeURIComponent(params.id)
    if (!fileId.startsWith(`datasets/${userId}/`)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const file = storage.bucket().file(fileId)
    const [exists] = await file.exists()
    if (!exists) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 })
    }

    const [metadata] = await file.getMetadata()
    const [fileContent] = await file.download()

    const fileName = metadata.metadata?.name || fileId.split('/').pop() || 'dataset'

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': metadata.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      }
    })
  } catch (error) {
    console.error('Error downloading dataset:', error)
    return NextResponse.json({ message: 'Failed to download dataset' }, { status: 500 })
  }
}