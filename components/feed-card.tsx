"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, UserPlus, UserCheck, Volume2 } from "lucide-react"

export default function FeedCard({ item, isActive, userId }: { item: any; isActive: boolean; userId: string }) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // Check if user has liked this answer
  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("answer_id", item.id)
        .eq("user_id", userId)
        .single()

      if (!error && data) {
        setIsLiked(true)
      }
    }

    // Get like count
    const getLikeCount = async () => {
      const { count, error } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("answer_id", item.id)

      if (!error && count !== null) {
        setLikeCount(count)
      }
    }

    // Get comment count
    const getCommentCount = async () => {
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("answer_id", item.id)

      if (!error && count !== null) {
        setCommentCount(count)
      }
    }

    // Check if user is following the answer creator
    const checkFollowStatus = async () => {
      if (item.user.id === userId) return

      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", userId)
        .eq("following_id", item.user.id)
        .single()

      if (!error && data) {
        setIsFollowing(true)
      }
    }

    checkLikeStatus()
    getLikeCount()
    getCommentCount()
    checkFollowStatus()
  }, [item.id, item.user.id, userId, supabase])

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike
        await supabase.from("likes").delete().eq("answer_id", item.id).eq("user_id", userId)

        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        // Like
        await supabase.from("likes").insert({
          answer_id: item.id,
          user_id: userId,
        })

        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", item.user.id)

        setIsFollowing(false)
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${item.user.username}`,
        })
      } else {
        // Follow
        await supabase.from("follows").insert({
          follower_id: userId,
          following_id: item.user.id,
        })

        setIsFollowing(true)
        toast({
          title: "Following",
          description: `You are now following ${item.user.username}`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${item.user.username}'s answer on you know me`,
          text: item.question.content,
          url: `${window.location.origin}/answer/${item.id}`,
        })
        .catch(() => {
          // Fallback if share fails
          navigator.clipboard.writeText(`${window.location.origin}/answer/${item.id}`)
          toast({
            title: "Link copied",
            description: "Answer link copied to clipboard",
          })
        })
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(`${window.location.origin}/answer/${item.id}`)
      toast({
        title: "Link copied",
        description: "Answer link copied to clipboard",
      })
    }
  }

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <div className={`min-h-screen w-full flex flex-col snap-start ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="flex-1 flex flex-col">
        {/* Question */}
        <div className="bg-gray-900 p-4 border-b border-gray-800">
          <h2 className="text-xl font-medium text-white">{item.question.content}</h2>
        </div>

        {/* Answer Content */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
          {item.media_type === "image" && item.media_url && (
            <div className="relative max-h-[70vh] max-w-full">
              <Image
                src={item.media_url || "/placeholder.svg"}
                alt="Answer content"
                width={500}
                height={500}
                className="object-contain max-h-[70vh] rounded-lg"
              />
            </div>
          )}

          {item.media_type === "video" && item.media_url && (
            <video
              src={item.media_url}
              controls
              autoPlay={isActive}
              loop
              muted={!isActive}
              className="max-h-[70vh] max-w-full rounded-lg"
            />
          )}

          {item.media_type === "audio" && item.media_url && (
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="rounded-full bg-gray-800 p-8 mb-4">
                <Volume2 size={64} className="text-[#4D7CFF]" />
              </div>
              <audio src={item.media_url} controls autoPlay={isActive} className="w-full" />
              {item.content && <p className="mt-4 text-center text-white">{item.content}</p>}
            </div>
          )}

          {(item.media_type === "text" || !item.media_type) && (
            <div className="max-w-xl text-xl text-center text-white">{item.content}</div>
          )}
        </div>

        {/* User info and actions */}
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <Link href={`/profile/${item.user.id}`} className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{getInitials(item.user.username)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{item.user.username}</p>
                <p className="text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={isLiked ? "text-[#FF004D]" : "text-white"}
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-[#FF004D]" : ""}`} />
                {likeCount > 0 && <span className="ml-1 text-sm">{likeCount}</span>}
              </Button>

              <Link href={`/answer/${item.id}/comments`}>
                <Button variant="ghost" size="icon" className="text-white">
                  <MessageCircle className="h-6 w-6" />
                  {commentCount > 0 && <span className="ml-1 text-sm">{commentCount}</span>}
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={handleShare} className="text-white">
                <Share2 className="h-6 w-6" />
              </Button>

              {item.user.id !== userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFollow}
                  className={isFollowing ? "text-[#B100FF]" : "text-white"}
                >
                  {isFollowing ? <UserCheck className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
