"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

export async function submitAnswer(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "You must be logged in to answer questions" }
  }

  const questionId = formData.get("questionId") as string
  const content = formData.get("content") as string
  const mediaUrl = formData.get("mediaUrl") as string
  const mediaType = formData.get("mediaType") as "image" | "video" | "text"

  try {
    // Insert the answer into the database
    const { data, error } = await supabase
      .from("answers")
      .insert({
        question_id: questionId,
        user_id: session.user.id,
        content: content || null,
        media_url: mediaUrl || null,
        media_type: mediaType || "text",
      })
      .select()

    if (error) throw error

    // Revalidate the feed page to show the new answer
    revalidatePath("/feed")
    revalidatePath(`/question/${questionId}`)

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
