"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit,  Github, Laptop, Menu, Terminal, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Laptop,
      title: "Datasets",
      description: "Access thousands of Datasets for your ML project, Download Train and publish your ML projects on our platform using Datasets ."
    },
    {
      icon: Terminal,
      title: "BrainsPY",
      description: "Streamline your Python backend and ML projects with our intuitive command-line interface. Boost productivity and maintain consistency across your team."
    },
    {
      icon: Github,
      title: "Projects",
      description: "Publish your AI/ML projects on our platform, Create Publish and Colab with others."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center fixed w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
        <Link className="flex items-center justify-center" href="/">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Starbrains</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#contact">
            Contact
          </Link>
        </nav>
        <a href="/sign-up"><Button className="ml-4 hidden md:flex" variant="default">
          Get Started
        </Button></a>
        <Button
          className="ml-auto md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-950 shadow-lg z-40"
          >
            <nav className="flex flex-col items-center py-4">
              <Link className="py-2 text-sm font-medium hover:text-primary transition-colors" href="#features">
                Features
              </Link>
              <Link className="py-2 text-sm font-medium hover:text-primary transition-colors" href="#about">
                About
              </Link>
              <Link className="py-2 text-sm font-medium hover:text-primary transition-colors" href="#contact">
                Contact
              </Link>
              
              <a href="https://google.com/"><Button className="mt-4" variant="default">
                Get Started
              </Button></a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Empower Your ML Workflow with <span className="text-primary">Starbrains</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Revolutionize your machine learning projects with our Datasets platform, BrainsPY CLI, and collaborative.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-x-4"
              >
                <a href="/dashboard"><Button size="lg" className="bg-primary text-white hover:bg-primary/90">Get Started</Button></a>
                </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Our Solutions</h2>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        activeFeature === index ? 'border-primary shadow-lg' : ''
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle>{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="lg:pl-10 flex items-center justify-center">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md"
                >
                  <Card className="bg-primary text-white">
                    <CardHeader>
                      <CardTitle className="text-2xl">{features[activeFeature].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{features[activeFeature].description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Starbrains</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Starbrains is at the forefront of machine learning innovation. We provide cutting-edge tools and platforms to empower data scientists and ML engineers to build, deploy, and manage their projects with unprecedented ease and efficiency.
                </p>
                <a href="/dashboard"><Button className="w-fit group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button></a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { title: "50+", description: "ML Models" },
                  { title: "10k+", description: "Users" },
                  { title: "99.9%", description: "Uptime" },
                  { title: "24/7", description: "Support" }
                ].map((stat, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <CardTitle className="text-4xl font-bold">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{stat.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-white">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Supercharge Your ML Projects?</h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get in touch with our team to learn how Starbrains can accelerate your machine learning workflows.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <a href="/contact"><Button className="w-full" size="lg" variant="secondary">
                  Contact Us
                </Button></a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Starbrains. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}