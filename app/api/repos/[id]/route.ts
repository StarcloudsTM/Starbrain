import { NextRequest, NextResponse } from 'next/server'

// This is a mock database. In a real application, you'd use a proper database.
let repos: any[] = []

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const repo = repos.find(r => r.id === id)

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
  }

  return NextResponse.json(repo)
}

// Keep the existing POST method here
export async function POST(req: NextRequest) {
  // ... (keep the existing POST logic here)
}