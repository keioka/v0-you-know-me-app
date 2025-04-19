"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function AskForm({ userId }: { userId: string }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const MAX_LENGTH = 280

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Question cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("questions")
        .insert({
          user_id: userId,
          content: content.trim(),
          is_public: isPublic,
        })
        .select()

      if (error) throw error

      toast({
        title: "Question posted",
        description: "Your question has been posted successfully",
      })

      router.push("/feed")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Textarea
          placeholder="Ask something quirky, funny, or weird..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] bg-gray-800 border-gray-700 text-white resize-none"
          maxLength={MAX_LENGTH}
        />
        <div className="flex justify-end">
          <span className={`text-sm ${content.length > MAX_LENGTH * 0.8 ? "text-[#FF004D]" : "text-gray-400"}`}>
            {content.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      <RadioGroup defaultValue={isPublic ? "public" : "friends"} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="public"
            id="public"
            onClick={() => setIsPublic(true)}
            className="border-gray-600 text-[#4D7CFF]"
          />
          <Label htmlFor="public" className="text-white">
            Public - Anyone can see and answer
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="friends"
            id="friends"
            onClick={() => setIsPublic(false)}
            className="border-gray-600 text-[#4D7CFF]"
          />
          <Label htmlFor="friends" className="text-white">
            Friends Only - Only people you follow can see and answer
          </Label>
        </div>
      </RadioGroup>

      <Button
        type="submit"
        className="w-full bg-[#00E4F5] hover:bg-[#00E4F5]/80 text-black font-medium py-6"
        disabled={isLoading || content.length === 0 || content.length > MAX_LENGTH}
      >
        {isLoading ? "Posting..." : "Post Question"}
      </Button>
    </form>
  )
}
