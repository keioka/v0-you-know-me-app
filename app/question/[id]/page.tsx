import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import QuestionDetail from "@/components/question-detail"
import AnswerForm from "@/components/answer-form"

export default async function QuestionPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get question details
  const { data: question } = await supabase
    .from("questions")
    .select(`
      *,
      user:profiles(*)
    `)
    .eq("id", params.id)
    .single()

  if (!question) {
    redirect("/feed")
  }

  // Check if user has already answered this question
  const { data: existingAnswer } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle()

  return (
    <>
      <Navbar user={profile} />
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <QuestionDetail question={question} />

          {!existingAnswer ? (
            <AnswerForm questionId={params.id} userId={session.user.id} />
          ) : (
            <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center">
              <p className="text-white">You've already answered this question.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
