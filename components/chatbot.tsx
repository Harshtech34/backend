"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

const predefinedResponses = {
  greeting: {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    response:
      "Hello! Welcome to PropertyHub. I'm here to help you find your dream property. How can I assist you today?",
    suggestions: ["Search Properties", "Property Types", "Contact Agent", "Pricing Info"],
  },
  search: {
    keywords: ["search", "find", "property", "house", "apartment", "buy", "rent"],
    response:
      "I can help you search for properties! You can browse by location, price range, or property type. What kind of property are you looking for?",
    suggestions: ["Residential Properties", "Commercial Properties", "Luxury Properties", "Rental Properties"],
  },
  pricing: {
    keywords: ["price", "cost", "budget", "expensive", "cheap", "affordable"],
    response:
      "Property prices vary based on location, size, and amenities. I can help you find properties within your budget. What's your preferred price range?",
    suggestions: ["Under ₹50L", "₹50L - ₹1Cr", "₹1Cr - ₹5Cr", "Above ₹5Cr"],
  },
  location: {
    keywords: ["location", "area", "city", "mumbai", "delhi", "bangalore", "chennai", "pune"],
    response: "We have properties across 100+ cities in India. Which city or area are you interested in?",
    suggestions: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad"],
  },
  contact: {
    keywords: ["contact", "agent", "call", "phone", "email", "support"],
    response:
      "You can reach our support team at +91 1800-123-4567 or email us at support@propertyhub.com. Would you like me to connect you with a property agent?",
    suggestions: ["Call Support", "Email Support", "Connect with Agent", "Schedule Callback"],
  },
  features: {
    keywords: ["features", "amenities", "facilities", "services"],
    response:
      "PropertyHub offers verified listings, government-certified data, AI-powered recommendations, and 24/7 support. What specific feature would you like to know about?",
    suggestions: ["Verification Process", "AI Recommendations", "Government Certification", "Support Services"],
  },
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm PropertyBot, your real estate assistant. How can I help you find your perfect property today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Search Properties", "Property Types", "Contact Agent", "Pricing Info"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (response.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return response
      }
    }

    return {
      response:
        "I understand you're looking for information. Let me connect you with our support team for personalized assistance. You can also browse our property listings or contact our agents directly.",
      suggestions: ["Browse Properties", "Contact Agent", "Call Support", "View Locations"],
    }
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const response = findResponse(messageText)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: "bot",
          timestamp: new Date(),
          suggestions: response.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`w-80 md:w-96 shadow-2xl border-border/50 ${isMinimized ? "h-16" : "h-96"} transition-all duration-300`}
            >
              {/* Chat Header */}
              <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">PropertyBot</CardTitle>
                      <p className="text-xs opacity-90">Online • Typically replies instantly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 flex flex-col h-80">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {message.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                          </div>
                          <div>
                            <div
                              className={`rounded-2xl px-3 py-2 ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6 px-2 rounded-full"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <Bot className="w-3 h-3" />
                          </div>
                          <div className="bg-muted rounded-2xl px-3 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="rounded-full"
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="icon"
                        className="rounded-full"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
