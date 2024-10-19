import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, Package } from 'lucide-react'

export default function DashboardHome() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Starbrains</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">BrainsPY</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Python Code Snippet</div>
            <p className="text-xs text-muted-foreground">100+ Python Backend + Data Science Codes </p>
            <a href="https://github.com/StarcloudsTM/brains"><Button>Get Started</Button></a>
          </CardContent>
          
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">MLCluster</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+ Machine Learing Models</div>
            <p className="text-xs text-muted-foreground">50+ Machine Learing Model With 12 APIs</p>
            <a href="/dashboard/mlcluster/"><Button>Get Started</Button></a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">MLHUB</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Machine Learing Hub</div>
            <p className="text-xs text-muted-foreground">Upload, Publish, Collaborate Start Your Machine Learing Project Here</p>
          <a href="/dashboard/mlhub/"><Button>Get Started</Button></a>
          </CardContent>
        </Card>
      </div>
      
    </>
  )
}