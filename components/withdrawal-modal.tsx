"use client"

import { useState } from "react"
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
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

interface WithdrawalModalProps {
    children: React.ReactNode
}

const NETWORKS = [
    { id: "btc", name: "Bitcoin (BTC)", fee: "0.0005 BTC" },
    { id: "eth", name: "Ethereum (ERC20)", fee: "0.005 ETH" },
    { id: "sol", name: "Solana (SOL)", fee: "0.01 SOL" },
    { id: "usdt-erc20", name: "USDT (ERC20)", fee: "10 USDT" },
    { id: "usdt-trc20", name: "USDT (TRC20)", fee: "1 USDT" },
    { id: "bnb", name: "BNB Smart Chain (BEP20)", fee: "0.001 BNB" },
]

export function WithdrawalModal({ children }: WithdrawalModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<"form" | "success">("form")
    const [isLoading, setIsLoading] = useState(false)
    const [address, setAddress] = useState("")
    const [network, setNetwork] = useState("")

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Reset form on close
            setTimeout(() => {
                setStep("form")
                setAddress("")
                setNetwork("")
                setIsLoading(false)
            }, 300)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address || !network) return

        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsLoading(false)
        setStep("success")
    }

    const selectedNetwork = NETWORKS.find((n) => n.id === network)

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md bg-popover border-border">
                <DialogHeader>
                    <DialogTitle className="font-sans flex items-center">
                        {step === "form" ? (
                            <>
                                <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                                Initiate Withdrawal
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Withdrawal Initiated
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="font-mono">
                        {step === "form"
                            ? "Enter your details to withdraw funds from your connection bonus."
                            : "Your withdrawal request has been submitted successfully."}
                    </DialogDescription>
                </DialogHeader>

                {step === "form" ? (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium font-mono block">
                                Wallet Address <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="address"
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter destination address"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="network" className="text-sm font-medium font-mono block">
                                Network <span className="text-destructive">*</span>
                            </label>
                            <Select value={network} onValueChange={setNetwork} required>
                                <SelectTrigger id="network" className="w-full bg-background border-input font-mono">
                                    <SelectValue placeholder="Select network" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {NETWORKS.map((net) => (
                                        <SelectItem key={net.id} value={net.id} className="font-mono">
                                            <div className="flex justify-between w-full gap-4">
                                                <span>{net.name}</span>
                                                <span className="text-muted-foreground text-xs">Fee: {net.fee}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedNetwork && (
                                <p className="text-xs text-muted-foreground font-mono">
                                    Estimated Network Fee: <span className="text-primary">{selectedNetwork.fee}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium font-mono block">
                                Amount <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="amount"
                                type="text"
                                disabled
                                value="$200.00"
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !address || !network}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-4"
                        >
                            {isLoading ? "Processing..." : "Submit Withdrawal"}
                        </Button>
                    </form>
                ) : (
                    <div className="py-6 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                                    <Clock className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold font-sans">Processing Transaction</h3>
                            <p className="text-muted-foreground font-mono">
                                Waiting for <span className="text-primary font-bold">3 network confirmations</span>.
                            </p>
                            <p className="text-sm text-muted-foreground font-mono bg-muted/30 p-3 rounded-md border border-border mt-2">
                                This process typically takes about <span className="font-bold text-foreground">30 minutes</span> depending on network congestion. You can safely close this window.
                            </p>
                        </div>

                        <Button
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium"
                        >
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
