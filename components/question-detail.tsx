import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function QuestionDetail({ question }: { question: any }) {
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/profile/${question.user.id}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={question.user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{getInitials(question.user.username)}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/profile/${question.user.id}`} className="font-medium text-white hover:underline">
            {question.user.username}
          </Link>
          <p className="text-sm text-gray-400">{new Date(question.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">{question.content}</h1>

      <div className="flex items-center gap-2 mt-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${question.is_public ? "bg-[#4D7CFF]/20 text-[#4D7CFF]" : "bg-gray-700 text-gray-300"}`}
        >
          {question.is_public ? "Public" : "Friends Only"}
        </span>
      </div>
    </div>
  )
}
