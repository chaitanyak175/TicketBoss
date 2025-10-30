// This is the main landing page component for TicketBoss
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Zap, Database, Lock, Code2, Server, Moon, Sun, ExternalLink, CheckCircle2, Terminal, AlertCircle, Loader2 } from "lucide-react"

export default function TicketBossLanding() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)
  
  // API Testing States
  const [activeTab, setActiveTab] = useState<"reserve" | "view" | "cancel">("reserve")
  const [partnerId, setPartnerId] = useState("")
  const [seats, setSeats] = useState(1)
  const [reservationId, setReservationId] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  // API Testing Functions
  const handleReserveSeats = async () => {
    if (!partnerId.trim()) {
      setStatus("error")
      setStatusMessage("Please enter a Partner ID")
      return
    }

    setStatus("loading")
    setStatusMessage("")
    setResponse(null)

    try {
      const res = await fetch("/api/demo/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerId: partnerId.trim(),
          seats: seats,
        }),
      })

      const data = await res.json()
      setResponse(data)

      if (res.ok) {
        setStatus("success")
        setStatusMessage("Seats Reserved Successfully")
      } else {
        setStatus("error")
        setStatusMessage(data.error || "Not Enough Seats")
      }
    } catch (error) {
      setStatus("error")
      setStatusMessage("Failed to connect to API")
      setResponse({ error: "Network error or API is unavailable" })
    }
  }

  const handleViewReservations = async () => {
    setStatus("loading")
    setStatusMessage("")
    setResponse(null)

    try {
      const res = await fetch("/api/demo/reservations")
      const data = await res.json()
      setResponse(data)

      if (res.ok) {
        setStatus("success")
        setStatusMessage("Reservations Retrieved Successfully")
      } else {
        setStatus("error")
        setStatusMessage("Failed to retrieve reservations")
      }
    } catch (error) {
      setStatus("error")
      setStatusMessage("Failed to connect to API")
      setResponse({ error: "Network error or API is unavailable" })
    }
  }

  const handleCancelReservation = async () => {
    if (!reservationId.trim()) {
      setStatus("error")
      setStatusMessage("Please enter a Reservation ID")
      return
    }

    setStatus("loading")
    setStatusMessage("")
    setResponse(null)

    try {
      const res = await fetch(`/api/demo/reservations/${reservationId.trim()}`, {
        method: "DELETE",
      })

      const data = await res.json()
      setResponse(data)

      if (res.ok) {
        setStatus("success")
        setStatusMessage("Reservation Cancelled Successfully")
      } else {
        setStatus("error")
        setStatusMessage(data.error || "Failed to cancel reservation")
      }
    } catch (error) {
      setStatus("error")
      setStatusMessage("Failed to connect to API")
      setResponse({ error: "Network error or API is unavailable" })
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/ed178baa-610f-4dee-b56e-e01d4ced62e0/generated_images/modern-minimalist-logo-for-ticketboss-ti-878f1112-20251030050533.jpg" 
              alt="TicketBoss Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover"
            />
            <span className="text-lg sm:text-xl font-bold">TicketBoss</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9"
            >
              {theme === "light" ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a href="https://github.com/chaitanyak175/TicketBoss" target="_blank" rel="noopener noreferrer">
                <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="hero-gradient absolute inset-0 pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center space-y-4 sm:space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span>Powerplay Backend Internship Project</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="gradient-text">TicketBoss</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium px-4">
              Real-time Seat Reservations with Zero Overselling
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              A production-grade event ticketing API built with Node.js and Express.js, featuring optimistic concurrency control and real-time seat management.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 px-4">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 w-full sm:w-auto" asChild>
                <a href="https://github.com/chaitanyak175/TicketBoss" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  View GitHub Repo
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" asChild>
                <a href="#demo">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  Try Demo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Project Overview</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              TicketBoss is a robust backend system developed as part of the <strong>Powerplay Backend Internship</strong>. 
              The project demonstrates advanced concepts in <strong>concurrency control</strong>, <strong>RESTful API design</strong>, 
              and <strong>system reliability</strong>. Built to handle high-traffic scenarios, it ensures zero overselling 
              through optimistic locking mechanisms and provides real-time feedback for seat reservations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Key Features</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Built with production-grade standards</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5 sm:p-6 card-hover border-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Optimistic Concurrency</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Version-based locking prevents race conditions and ensures data integrity in high-traffic scenarios.
              </p>
            </Card>
            <Card className="p-5 sm:p-6 card-hover border-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Real-time API Responses</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Lightning-fast response times with efficient query optimization and caching strategies.
              </p>
            </Card>
            <Card className="p-5 sm:p-6 card-hover border-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">RESTful Endpoints</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Clean, intuitive API design following REST principles for easy integration and scalability.
              </p>
            </Card>
            <Card className="p-5 sm:p-6 card-hover border-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3 sm:mb-4">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Clean Node.js Architecture</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Modular, maintainable codebase with separation of concerns and best practices.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation Preview */}
      <section id="demo" className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">API Documentation</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Sample request and response</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 border-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                <h3 className="text-sm sm:text-lg font-semibold">POST /api/reservations</h3>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Request</span>
              </div>
              <pre className="bg-black/5 dark:bg-white/5 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                <code>{`{
  "eventId": "evt_123456",
  "userId": "usr_789012",
  "seats": [
    {
      "seatNumber": "A12",
      "section": "VIP"
    },
    {
      "seatNumber": "A13",
      "section": "VIP"
    }
  ],
  "version": 1
}`}</code>
              </pre>
            </Card>
            <Card className="p-4 sm:p-6 border-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                <h3 className="text-sm sm:text-lg font-semibold">Response 200 OK</h3>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">Response</span>
              </div>
              <pre className="bg-black/5 dark:bg-white/5 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                <code>{`{
  "success": true,
  "reservationId": "res_345678",
  "message": "Seats reserved successfully",
  "data": {
    "seats": ["A12", "A13"],
    "totalAmount": 299.98,
    "expiresAt": "2024-12-31T23:59:59Z",
    "version": 2
  }
}`}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Tech Stack</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Powered by modern technologies</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-border card-hover">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg viewBox="0 0 256 256" className="w-full h-full">
                  <path fill="#539E43" d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm0 240C65.7 240 16 190.3 16 128S65.7 16 128 16s112 49.7 112 112-49.7 112-112 112z"/>
                  <path fill="#539E43" d="M128 48c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z"/>
                </svg>
              </div>
              <span className="font-semibold text-sm sm:text-base">Node.js</span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-border card-hover">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-4xl sm:text-5xl font-bold text-muted-foreground">
                E
              </div>
              <span className="font-semibold text-sm sm:text-base">Express.js</span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-border card-hover">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <Database className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
              </div>
              <span className="font-semibold text-sm sm:text-base">PostgreSQL</span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-border card-hover">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg viewBox="0 0 256 256" className="w-full h-full">
                  <path fill="#2496ED" d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0z"/>
                  <path fill="#FFF" d="M128 48l64 32v64l-64 32-64-32V80l64-32z"/>
                </svg>
              </div>
              <span className="font-semibold text-sm sm:text-base">Docker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Summary Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Project Summary</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Technical architecture and implementation</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 border-2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                Architecture
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>MVC pattern with Express.js routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Service layer for business logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Repository pattern for data access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Middleware for authentication & validation</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 sm:p-8 border-2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                Data Model
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Events with capacity management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Seats with version tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Reservations with time-based expiry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Transaction support for consistency</span>
                </li>
              </ul>
            </Card>
          </div>
          <Card className="p-6 sm:p-8 border-2 mt-6 sm:mt-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              Submission Guidelines
            </h3>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
              <p>
                This project was developed as part of the Powerplay Backend Internship selection process. 
                The implementation showcases real-world problem-solving abilities and adherence to production-grade standards.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Comprehensive API documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Unit & integration tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Docker containerization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Performance benchmarking</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive API Testing Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span>🎟️</span>
              <span>Try the TicketBoss API</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              This demo connects directly to my live backend — feel free to test it in real time!
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8 border-2 space-y-4 sm:space-y-6">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 border-b border-border pb-3 sm:pb-4">
              <Button
                variant={activeTab === "reserve" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("reserve")
                  setStatus("idle")
                  setStatusMessage("")
                  setResponse(null)
                }}
                className={`${activeTab === "reserve" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""} w-full sm:w-auto text-sm sm:text-base`}
              >
                <Terminal className="w-4 h-4 mr-2" />
                Reserve Seats
              </Button>
              <Button
                variant={activeTab === "view" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("view")
                  setStatus("idle")
                  setStatusMessage("")
                  setResponse(null)
                }}
                className={`${activeTab === "view" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""} w-full sm:w-auto text-sm sm:text-base`}
              >
                <Database className="w-4 h-4 mr-2" />
                View Summary
              </Button>
              <Button
                variant={activeTab === "cancel" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("cancel")
                  setStatus("idle")
                  setStatusMessage("")
                  setResponse(null)
                }}
                className={`${activeTab === "cancel" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""} w-full sm:w-auto text-sm sm:text-base`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Cancel Reservation
              </Button>
            </div>

            {/* Reserve Seats Form */}
            {activeTab === "reserve" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partner ID</label>
                  <input
                    type="text"
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value)}
                    placeholder="Enter your partner ID (e.g., partner_123)"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-background focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={seats}
                    onChange={(e) => setSeats(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    placeholder="1-10 seats"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-background focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
                <Button
                  onClick={handleReserveSeats}
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-5 sm:py-6 text-base sm:text-lg"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Reserving Seats...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Reserve Seats
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* View Reservations */}
            {activeTab === "view" && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Retrieve the current event summary and all active reservations.
                </p>
                <Button
                  onClick={handleViewReservations}
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-5 sm:py-6 text-base sm:text-lg"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Get Reservations
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Cancel Reservation */}
            {activeTab === "cancel" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reservation ID</label>
                  <input
                    type="text"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                    placeholder="Enter reservation ID to cancel"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-border bg-background focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                  />
                </div>
                <Button
                  onClick={handleCancelReservation}
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 py-5 sm:py-6 text-base sm:text-lg"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Cancel Reservation
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`flex items-center gap-2 p-3 sm:p-4 rounded-lg border-2 text-sm sm:text-base ${
                  status === "success"
                    ? "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                )}
                <span className="font-medium">{statusMessage}</span>
              </div>
            )}

            {/* Response Display */}
            {response && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                  <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Live API Response</span>
                </div>
                <div className="bg-black dark:bg-gray-950 rounded-lg p-3 sm:p-4 md:p-6 overflow-x-auto border-2 border-gray-800">
                  <pre className="text-xs sm:text-sm text-green-400 font-mono">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* API Info */}
          <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <Card className="p-3 sm:p-4 border-2">
              <div className="font-semibold mb-1 text-xs sm:text-sm">POST /reservations</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Reserve seats for an event</div>
            </Card>
            <Card className="p-3 sm:p-4 border-2">
              <div className="font-semibold mb-1 text-xs sm:text-sm">GET /reservations</div>
              <div className="text-muted-foreground text-xs sm:text-sm">View event summary</div>
            </Card>
            <Card className="p-3 sm:p-4 border-2 sm:col-span-2 md:col-span-1">
              <div className="font-semibold mb-1 text-xs sm:text-sm">DELETE /reservations/:id</div>
              <div className="text-muted-foreground text-xs sm:text-sm">Cancel a reservation</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 text-center md:text-left">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/ed178baa-610f-4dee-b56e-e01d4ced62e0/generated_images/modern-minimalist-logo-for-ticketboss-ti-878f1112-20251030050533.jpg" 
                alt="TicketBoss Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div>
                <div className="font-bold text-base sm:text-lg">TicketBoss</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Powerplay Backend Internship Project</div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-right">
                Built by <strong className="text-foreground">Chaitanya Karmalkar</strong>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href="https://github.com/chaitanyak175/TicketBoss" target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2024 TicketBoss. Created for Powerplay Internship Application.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}