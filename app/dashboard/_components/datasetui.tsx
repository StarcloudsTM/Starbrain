'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Download, Plus, Upload, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface Dataset {
  id: string
  name: string
  description: string
  uploadedBy: string
  createdAt: string
  fileSize: number
}

export default function DatasetPage() {
  const { user, isLoaded } = useUser()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [datasetName, setDatasetName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    if (isLoaded && user) {
      fetchDatasets()
    }
  }, [isLoaded, user])

  const fetchDatasets = async () => {
    try {
      const response = await fetch('/api/datasets')
      if (!response.ok) {
        throw new Error('Failed to fetch datasets')
      }
      const data = await response.json()
      setDatasets(data)
    } catch (err) {
      setError('An error occurred while fetching datasets.')
      toast({
        title: "Error",
        description: "Failed to fetch datasets. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 50 * 1024 * 1024) {
        setUploadError('File size must not exceed 50MB.')
        return
      }
      setFile(selectedFile)
      setUploadError('')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError('')

    if (!file) {
      setUploadError('Please select a file to upload.')
      setIsUploading(false)
      return
    }

    const formData = new FormData()
    formData.append('name', datasetName)
    formData.append('description', description)
    formData.append('file', file)

    try {
      const response = await fetch('/api/datasets', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload dataset')
      }

      const newDataset = await response.json()
      setDatasets(prevDatasets => [newDataset, ...prevDatasets])
      toast({
        title: "Success",
        description: "Dataset uploaded successfully!",
      })
      setIsUploadDialogOpen(false)
      resetUploadForm()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setUploadError(`An error occurred while uploading the dataset: ${errorMessage}`)
      toast({
        title: "Error",
        description: `Failed to upload dataset: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return

    try {
      const response = await fetch(`/api/datasets/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete dataset')
      }

      setDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== id))
      toast({
        title: "Success",
        description: "Dataset deleted successfully!",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: `Failed to delete dataset: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const resetUploadForm = () => {
    setDatasetName('')
    setDescription('')
    setFile(null)
    setUploadError('')
  }

  if (!isLoaded || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading datasets...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Datasets</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Dataset</DialogTitle>
              <DialogDescription>
                Upload a new dataset (max 50MB) to share with the community
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Dataset'}
                </Button>
              </DialogFooter>
            </form>
            {uploadError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {datasets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-xl font-semibold mb-4">You have uploaded zero datasets</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Upload Your First Dataset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <Card key={dataset.id}>
              <CardHeader>
                <CardTitle>{dataset.name}</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on: {new Date(dataset.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  File size: {(dataset.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <a href={`/api/datasets/${encodeURIComponent(dataset.id)}/download`} download>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
                {dataset.uploadedBy === user.id && (
                  <Button onClick={() => handleDelete(dataset.id)} size="icon" variant="outline">
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}