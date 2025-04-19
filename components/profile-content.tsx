"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Heart, Volume2 } from "lucide-react"

export default function ProfileContent({
  profile,
  answers,
  followerCount,
  followingCount,
  isOwnProfile,
}: {
  profile: any
  answers: any[]
  followerCount: number
  followingCount: number
  isOwnProfile: boolean
}) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      setIsEditing(false)
      router.refresh()
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

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm("Are you sure you want to delete this answer?")) return

    try {
      const { error } = await supabase.from("answers").delete().eq("id", answerId)

      if (error) throw error

      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully",
      })

      router.refresh()
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
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl">{getInitials(profile?.username)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">{profile?.display_name || profile?.username}</h1>
          <p className="text-gray-400 mb-2">@{profile?.username}</p>

          {profile?.bio && <p className="text-gray-300 mb-4 max-w-md">{profile.bio}</p>}

          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
            <div>
              <span className="font-bold text-white">{answers.length}</span>
              <span className="text-gray-400 ml-1">Answers</span>
            </div>
            <div>
              <span className="font-bold text-white">{followerCount}</span>
              <span className="text-gray-400 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{followingCount}</span>
              <span className="text-gray-400 ml-1">Following</span>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-gray-300">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#00E4F5] hover:bg-[#00E4F5]/80 text-black" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="answers" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700 mb-8">
          <TabsTrigger value="answers" className="data-[state=active]:bg-gray-700">
            Answers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="answers" className="mt-0">
          {answers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No answers yet</p>
              {isOwnProfile && (
                <Button asChild className="bg-[#4D7CFF] hover:bg-[#4D7CFF]/80 mt-4">
                  <a href="/browse">Browse questions to answer</a>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {answers.map((answer) => (
                <div key={answer.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <p className="text-gray-300 text-sm mb-2">
                      Answered: {new Date(answer.created_at).toLocaleDateString()}
                    </p>
                    <h3 className="font-medium text-white mb-3">{answer.question.content}</h3>

                    <div className="aspect-video bg-gray-900 rounded-md flex items-center justify-center mb-3">
                      {answer.media_type === "image" && answer.media_url && (
                        <Image
                          src={answer.media_url || "/placeholder.svg"}
                          alt="Answer content"
                          width={300}
                          height={200}
                          className="object-cover w-full h-full rounded-md"
                        />
                      )}

                      {answer.media_type === "video" && answer.media_url && (
                        <video src={answer.media_url} className="w-full h-full object-cover rounded-md" />
                      )}

                      {answer.media_type === "audio" && answer.media_url && (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                          <Volume2 className="h-12 w-12 text-[#4D7CFF] mb-2" />
                          <audio src={answer.media_url} controls className="w-full" />
                        </div>
                      )}

                      {(answer.media_type === "text" || !answer.media_type) && (
                        <div className="p-4 text-center text-white">{answer.content || "No content"}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-sm">{answer.likes?.[0]?.count || 0} likes</span>
                      </div>

                      {isOwnProfile && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAnswer(answer.id)}
                            className="text-[#FF004D] hover:text-[#FF004D]/80 hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
