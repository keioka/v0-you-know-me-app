import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import AskForm from "@/components/ask-form"

export default async function AskPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-24 min-h-screen bg-black px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Ask a Question</h1>
          <AskForm userId={session.user.id} />
        </div>
      </div>
    </>
  )
}
