import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/types/supabase"

export async function uploadMedia(file: File, userId: string) {
  const supabase = createClientComponentClient<Database>()

  // Generate a unique file name to avoid collisions
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage.from("answers").upload(filePath, file)

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from("answers").getPublicUrl(filePath)

  // Determine media type
  let mediaType = "text"
  if (file.type.startsWith("image/")) {
    mediaType = "image"
  } else if (file.type.startsWith("video/")) {
    mediaType = "video"
  } else if (file.type.startsWith("audio/")) {
    mediaType = "audio"
  }

  return {
    path: filePath,
    url: publicUrl,
    mediaType,
  }
}
