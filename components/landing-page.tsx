"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FF004D] to-[#4D7CFF]">
            you know me
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-12">
            A bite-sized Q&A social app with a TikTok-style swipe feed
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-[#FF004D] hover:bg-[#FF004D]/80 text-white px-8 py-6 text-lg">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild size="lg" className="bg-[#4D7CFF] hover:bg-[#4D7CFF]/80 text-white px-8 py-6 text-lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Ask Questions"
            description="Post quirky, funny, or weird questions to friends or the public."
            color="#FF004D"
          />
          <FeatureCard
            title="Answer Your Way"
            description="Reply with video, image, or text—express yourself however you want."
            color="#4D7CFF"
          />
          <FeatureCard
            title="Discover & Connect"
            description="Swipe through answers, follow friends, and engage with a vibrant community."
            color="#00E4F5"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
    >
      <h3 className="text-xl font-bold mb-3" style={{ color }}>
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}
