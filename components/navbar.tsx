"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, PlusCircle, User, LogOut, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Navbar({ user }: { user: any }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)

    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/feed"
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF004D] to-[#4D7CFF]"
        >
          you know me
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/feed"
            className={`p-2 ${pathname === "/feed" ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Home size={24} />
            <span className="sr-only">Home</span>
          </Link>

          <Link
            href="/browse"
            className={`p-2 ${pathname === "/browse" ? "text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Search size={24} />
            <span className="sr-only">Browse</span>
          </Link>

          <Link href="/ask" className={`p-2 ${pathname === "/ask" ? "text-white" : "text-gray-400 hover:text-white"}`}>
            <PlusCircle size={24} />
            <span className="sr-only">Ask</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0 h-9 w-9">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isLoading}
                className="flex items-center cursor-pointer text-red-400 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
