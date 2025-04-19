"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { uploadMedia } from "@/lib/supabase-storage"
import { submitAnswer } from "@/app/actions/answer-actions"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ImageIcon, Video, Type, X, Mic } from "lucide-react"

export default function AnswerForm({ questionId, userId }: { questionId: string; userId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("text")
  const [content, setContent] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (activeTab === "image" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "video" && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "audio" && !file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive",
      })
      return
    }

    setMediaFile(file)
    const objectUrl = URL.createObjectURL(file)
    setMediaPreview(objectUrl)
  }

  const clearMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setAudioChunks([])
    if (audioRecorder && isRecording) {
      audioRecorder.stop()
      setIsRecording(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
          setAudioChunks([...chunks])
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        const audioFile = new File([blob], "recording.webm", { type: "audio/webm" })
        setMediaFile(audioFile)
        const url = URL.createObjectURL(blob)
        setMediaPreview(url)

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      setAudioRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab !== "text" && !mediaFile) {
      toast({
        title: "Missing media",
        description: `Please select a ${activeTab} to upload`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("questionId", questionId)
      formData.append("content", content)

      // If there's a media file, upload it first
      if (mediaFile) {
        setIsUploading(true)
        const uploadResult = await uploadMedia(mediaFile, userId)
        setIsUploading(false)

        formData.append("mediaUrl", uploadResult.url)
        formData.append("mediaType", uploadResult.mediaType === "audio" ? "audio" : uploadResult.mediaType)
      } else {
        formData.append("mediaType", "text")
      }

      const result = await submitAnswer(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully",
      })

      router.push("/feed")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Post Your Answer</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-gray-900 mb-6">
              <TabsTrigger value="text" className="data-[state=active]:bg-gray-700">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-gray-700">
                <ImageIcon className="h-4 w-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-gray-700">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="audio" className="data-[state=active]:bg-gray-700">
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] bg-gray-900 border-gray-700 text-white resize-none"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a caption (optional)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] bg-gray-900 border-gray-700 text-white resize-none"
                />

                {!mediaPreview ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-400 mb-1">Click to upload an image</p>
                      <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                      onClick={clearMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src={mediaPreview || "/placeholder.svg"}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="w-full h-auto object-contain max-h-[300px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a caption (optional)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] bg-gray-900 border-gray-700 text-white resize-none"
                />

                {!mediaPreview ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Video className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-400 mb-1">Click to upload a video</p>
                      <p className="text-gray-500 text-sm">MP4, WebM up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                      onClick={clearMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="rounded-lg overflow-hidden">
                      <video src={mediaPreview} controls className="w-full max-h-[300px]" />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a caption (optional)..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[80px] bg-gray-900 border-gray-700 text-white resize-none"
                />

                {!mediaPreview ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center mb-4">
                      <Mic className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-400 mb-1">Record or upload audio</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#4D7CFF] hover:bg-[#4D7CFF]/80"}
                      >
                        {isRecording ? "Stop Recording" : "Record Audio"}
                      </Button>

                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="audio-upload"
                        />
                        <Button asChild variant="outline" className="bg-transparent border-gray-600 text-white">
                          <label htmlFor="audio-upload" className="cursor-pointer">
                            Upload Audio
                          </label>
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">MP3, WAV, WebM up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                      onClick={clearMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="rounded-lg bg-gray-900 p-4">
                      <audio src={mediaPreview} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full bg-[#FF004D] hover:bg-[#FF004D]/80 text-white font-medium py-6"
            disabled={isSubmitting || isUploading || (activeTab !== "text" && !mediaFile) || isRecording}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Answer"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
