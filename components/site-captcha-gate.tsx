"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, RefreshCw } from "lucide-react"

interface SiteCaptchaGateProps {
  children: React.ReactNode
}

export function SiteCaptchaGate({ children }: SiteCaptchaGateProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [answer, setAnswer] = useState("")
  const [question, setQuestion] = useState({ text: "", correctAnswer: 0 })
  const [attempts, setAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const generateQuestion = () => {
    const operations = [
      () => {
        const a = Math.floor(Math.random() * 20) + 1
        const b = Math.floor(Math.random() * 20) + 1
        return { text: `${a} + ${b}`, correctAnswer: a + b }
      },
      () => {
        const a = Math.floor(Math.random() * 15) + 10
        const b = Math.floor(Math.random() * 10) + 1
        return { text: `${a} - ${b}`, correctAnswer: a - b }
      },
      () => {
        const a = Math.floor(Math.random() * 12) + 1
        const b = Math.floor(Math.random() * 12) + 1
        return { text: `${a} × ${b}`, correctAnswer: a * b }
      },
    ]

    const randomOperation = operations[Math.floor(Math.random() * operations.length)]
    return randomOperation()
  }

  useEffect(() => {
    // Check if user was previously verified (session storage)
    const verified = sessionStorage.getItem("captcha-verified")
    if (verified === "true") {
      setIsVerified(true)
    } else {
      setQuestion(generateQuestion())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing time to prevent rapid attempts
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userAnswer = Number.parseInt(answer.trim())

    if (userAnswer === question.correctAnswer) {
      setIsVerified(true)
      sessionStorage.setItem("captcha-verified", "true")
      console.log("[redwhalesdev] Captcha verification successful")
    } else {
      setAttempts((prev) => prev + 1)
      setAnswer("")
      setQuestion(generateQuestion())
      console.log("[redwhalesdev] Captcha verification failed, generating new question")
    }

    setIsLoading(false)
  }

  const handleRefresh = () => {
    setQuestion(generateQuestion())
    setAnswer("")
  }

  if (isVerified) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-sans text-xl">Security Verification</CardTitle>
          <CardDescription className="font-mono">Please solve this simple math problem to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <div className="bg-muted p-6 rounded-lg border border-border">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-foreground">{question.text} = ?</span>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRefresh} className="ml-2">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full px-3 py-2 bg-input border border-border rounded-md font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                autoFocus
              />
            </div>

            {attempts > 0 && (
              <div className="text-center text-sm text-destructive font-mono">
                Incorrect answer. Please try again. ({attempts} attempt{attempts > 1 ? "s" : ""})
              </div>
            )}

            <Button
              type="submit"
              disabled={!answer.trim() || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
            This verification helps protect against automated access
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
