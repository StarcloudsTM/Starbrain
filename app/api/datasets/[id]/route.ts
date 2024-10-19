import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { auth } from '@clerk/nextjs/server'

// ... other methods (GET, PATCH) ...

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fileId = decodeURIComponent(params.id)
    const file = storage.bucket().file(fileId)
    const [exists] = await file.exists()
    if (!exists) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 })
    }

    const [metadata] = await file.getMetadata()
    
    if (metadata.metadata?.uploadedBy !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await file.delete()

    return NextResponse.json({ message: 'Dataset deleted successfully' })
  } catch (error) {
    console.error('Error deleting dataset:', error)
    return NextResponse.json({ message: 'Failed to delete dataset' }, { status: 500 })
  }
}

// ... other methods (GET for download) ...