'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Search } from "lucide-react"

interface AppCard {
  id: string
  name: string
  description: string
  githubUrl: string
}

const initialApps: AppCard[] = [
  {
    id: '1',
    name: 'TensorFlow Image Classifier',
    description: 'A deep learning model for image classification using TensorFlow and Keras.',
    githubUrl: 'https://github.com/example/tensorflow-image-classifier',
  },
  {
    id: '2',
    name: 'PyTorch NLP Sentiment Analysis',
    description: 'Natural Language Processing model for sentiment analysis using PyTorch.',
    githubUrl: 'https://github.com/example/pytorch-nlp-sentiment',
  },
  {
    id: '3',
    name: 'Scikit-learn Regression Models',
    description: 'A collection of regression models implemented using Scikit-learn.',
    githubUrl: 'https://github.com/example/scikit-learn-regression',
  },
  {
    id: '4',
    name: 'Pandas Data Analysis Toolkit',
    description: 'A set of data analysis tools and utilities built with Pandas.',
    githubUrl: 'https://github.com/example/pandas-data-analysis',
  },
  {
    id: '5',
    name: 'Matplotlib Visualization Suite',
    description: 'A comprehensive suite of data visualization tools using Matplotlib.',
    githubUrl: 'https://github.com/example/matplotlib-viz-suite',
  },
]

export default function BrainsPYPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [apps, setApps] = useState<AppCard[]>(initialApps)

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">BrainsPY: AI/ML/Python Apps</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <Card key={app.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional content can be added here if needed */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href={app.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-xl font-semibold">No apps found matching your search.</p>
        </div>
      )}
    </div>
  )
}