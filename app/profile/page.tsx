import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import ProfileContent from "@/components/profile-content"

export default async function ProfilePage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get user's answers
  const { data: answers } = await supabase
    .from("answers")
    .select(`
      *,
      question:questions(*),
      likes:likes(count)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  // Get follower count
  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", session.user.id)

  // Get following count
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", session.user.id)

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-16 min-h-screen bg-black">
        <ProfileContent
          profile={profile}
          answers={answers || []}
          followerCount={followerCount || 0}
          followingCount={followingCount || 0}
          isOwnProfile={true}
        />
      </div>
    </>
  )
}
