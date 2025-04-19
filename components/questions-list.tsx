"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, MessageSquare } from "lucide-react"

export default function QuestionsList({ questions }: { questions: any[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuestions = questions.filter((question) =>
    question.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No questions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((question) => (
            <Link href={`/question/${question.id}`} key={question.id}>
              <Card className="bg-gray-800 border-gray-700 hover:border-[#4D7CFF] transition-colors h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={question.user.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{getInitials(question.user.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{question.user.username}</p>
                      <p className="text-xs text-gray-400">{new Date(question.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-white mb-2">{question.content}</h3>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center text-gray-400 text-sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{question.answers[0]?.count || 0} answers</span>
                  </div>
                  <span className="text-[#4D7CFF]">Answer →</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
