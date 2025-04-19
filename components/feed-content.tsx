"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import FeedCard from "@/components/feed-card"
import { Loader2 } from "lucide-react"

export default function FeedContent({ initialFeedItems, userId }: { initialFeedItems: any[]; userId: string }) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [feedItems, setFeedItems] = useState(initialFeedItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Load more feed items when reaching the end
  const loadMoreItems = async () => {
    if (isLoading || feedItems.length === 0) return

    setIsLoading(true)

    try {
      const lastItem = feedItems[feedItems.length - 1]

      const { data, error } = await supabase
        .from("answers")
        .select(`
          *,
          question:questions(*),
          user:profiles!answers_user_id_fkey(*)
        `)
        .lt("created_at", lastItem.created_at)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      if (data && data.length > 0) {
        setFeedItems([...feedItems, ...data])
      }
    } catch (error: any) {
      toast({
        title: "Error loading feed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (e.key === "ArrowDown" && currentIndex < feedItems.length - 1) {
        setCurrentIndex(currentIndex + 1)

        // Load more if approaching the end
        if (currentIndex >= feedItems.length - 3) {
          loadMoreItems()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, feedItems.length])

  // Scroll to current card
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const card = container.children[currentIndex] as HTMLElement

      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [currentIndex])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isSignificantSwipe = Math.abs(distance) > 50

    if (isSignificantSwipe) {
      if (distance > 0 && currentIndex < feedItems.length - 1) {
        // Swiped up, go to next card
        setCurrentIndex(currentIndex + 1)

        // Load more if approaching the end
        if (currentIndex >= feedItems.length - 3) {
          loadMoreItems()
        }
      } else if (distance < 0 && currentIndex > 0) {
        // Swiped down, go to previous card
        setCurrentIndex(currentIndex - 1)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  if (feedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-xl text-gray-400 mb-4">No content to show yet</p>
        <p className="text-gray-500">Follow users or check back later for new content</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {feedItems.map((item, index) => (
        <FeedCard key={item.id} item={item} isActive={index === currentIndex} userId={userId} />
      ))}

      {isLoading && (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  )
}
