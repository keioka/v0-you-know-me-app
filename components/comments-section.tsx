"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Trash2 } from "lucide-react"

export default function CommentsSection({
  answer,
  initialComments,
  userId,
}: {
  answer: any
  initialComments: any[]
  userId: string
}) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          answer_id: answer.id,
          user_id: userId,
          content: newComment.trim(),
        })
        .select(`
          *,
          user:profiles(*)
        `)
        .single()

      if (error) throw error

      setComments([data, ...comments])
      setNewComment("")
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", userId)

      if (error) throw error

      setComments(comments.filter((comment) => comment.id !== commentId))

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2 text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Comments</h1>
      </div>

      {/* Original Answer */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/profile/${answer.user.id}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={answer.user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{getInitials(answer.user.username)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${answer.user.id}`} className="font-medium text-white hover:underline">
              {answer.user.username}
            </Link>
            <p className="text-xs text-gray-400">{new Date(answer.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <p className="text-gray-300 mb-3">{answer.question.content}</p>

        <div className="bg-gray-900 rounded p-2 mb-2">
          {answer.media_type === "image" && answer.media_url && (
            <Image
              src={answer.media_url || "/placeholder.svg"}
              alt="Answer content"
              width={300}
              height={200}
              className="object-contain max-h-[200px] mx-auto rounded"
            />
          )}

          {answer.media_type === "video" && answer.media_url && (
            <video src={answer.media_url} controls className="max-h-[200px] mx-auto rounded" />
          )}

          {(answer.media_type === "text" || !answer.media_type) && <p className="text-white p-2">{answer.content}</p>}
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={answer.user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{getInitials(answer.user.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white resize-none min-h-[40px]"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !newComment.trim()}
              className="bg-[#4D7CFF] hover:bg-[#4D7CFF]/80"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start">
                <Link href={`/profile/${comment.user.id}`} className="mr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(comment.user.username)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/profile/${comment.user.id}`} className="font-medium text-white hover:underline">
                        {comment.user.username}
                      </Link>
                      <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</p>
                    </div>
                    {comment.user_id === userId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-[#FF004D] hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-300 mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
