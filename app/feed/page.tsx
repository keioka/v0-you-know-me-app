import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import FeedContent from "@/components/feed-content"
import Navbar from "@/components/navbar"

export default async function FeedPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get feed items (answers with questions and user info)
  const { data: feedItems } = await supabase
    .from("answers")
    .select(`
      *,
      question:questions(*),
      user:profiles!answers_user_id_fkey(*)
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-16 min-h-screen bg-black">
        <FeedContent initialFeedItems={feedItems || []} userId={session.user.id} />
      </div>
    </>
  )
}
