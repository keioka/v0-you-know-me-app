import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import QuestionsList from "@/components/questions-list"

export default async function BrowsePage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get public questions
  const { data: questions } = await supabase
    .from("questions")
    .select(`
      *,
      user:profiles(*),
      answers:answers(count)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Browse Questions</h1>
          <QuestionsList questions={questions || []} />
        </div>
      </div>
    </>
  )
}
