import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import CommentsSection from "@/components/comments-section"

export default async function CommentsPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get answer with question and user info
  const { data: answer } = await supabase
    .from("answers")
    .select(`
      *,
      question:questions(*),
      user:profiles!answers_user_id_fkey(*)
    `)
    .eq("id", params.id)
    .single()

  if (!answer) {
    redirect("/feed")
  }

  // Get comments
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      user:profiles(*)
    `)
    .eq("answer_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-16 min-h-screen bg-black">
        <CommentsSection answer={answer} initialComments={comments || []} userId={session.user.id} />
      </div>
    </>
  )
}
