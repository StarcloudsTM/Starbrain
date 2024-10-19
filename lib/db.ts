import { v4 as uuidv4 } from 'uuid'

// This is a simple in-memory store. Replace this with your actual database logic.
let projects: any[] = []

export const db = {
  project: {
    findMany: async ({ where, orderBy }: any) => {
      // In a real database, you'd filter by userId and sort by createdAt
      return projects.filter(p => p.userId === where.userId).sort((a, b) => 
        orderBy.createdAt === 'desc' ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
      )
    },
    create: async ({ data }: any) => {
      const newProject = { id: uuidv4(), ...data, createdAt: new Date(), updatedAt: new Date() }
      projects.push(newProject)
      return newProject
    },
    update: async ({ where, data }: any) => {
      const index = projects.findIndex(p => p.id === where.id && p.userId === where.userId)
      if (index === -1) throw new Error('Project not found')
      projects[index] = { ...projects[index], ...data, updatedAt: new Date() }
      return projects[index]
    },
    delete: async ({ where }: any) => {
      const index = projects.findIndex(p => p.id === where.id && p.userId === where.userId)
      if (index === -1) throw new Error('Project not found')
      projects.splice(index, 1)
    }
  }
}