"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const predefinedResponses = {
  hello: "Hello! Welcome to PropertyHub. How can I help you find your dream property today?",
  hi: "Hi there! I'm here to assist you with any property-related questions.",
  help: "I can help you with:\n• Property searches\n• Pricing information\n• Location details\n• Contact information\n• General inquiries",
  search:
    "You can search for properties by location, price range, or property type. Use our search bar at the top of the page!",
  contact: "You can reach us at:\n📧 info@propertyhub.com\n📞 +1 (555) 123-4567\n🏢 123 Real Estate Ave, City, State",
  price: "Property prices vary by location and type. Use our filters to find properties within your budget range.",
  location: "We have properties available in multiple cities. Use our map feature to explore different areas.",
  default:
    "I'm here to help! You can ask me about property searches, pricing, locations, or contact information. What would you like to know?",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your PropertyHub assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase())
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const getBotResponse = (input: string): string => {
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response
      }
    }
    return predefinedResponses.default
  }

  const handleQuickResponse = (response: string) => {
    setInputValue(response)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-96"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-blue-500" />
                  PropertyHub Assistant
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-2 ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.sender === "bot" && <Bot className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.text}</p>
                        </div>
                        {message.sender === "user" && <User className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-start gap-2">
                        <Bot className="h-6 w-6 text-blue-500 mt-1" />
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick Response Buttons */}
                <div className="px-4 py-2 border-t">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {["Help", "Search Properties", "Contact Us", "Pricing"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => handleQuickResponse(suggestion.toLowerCase())}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="px-4 pb-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Default export for compatibility
export default Chatbot
