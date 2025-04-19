import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import LandingPage from "@/components/landing-page"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Home() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to feed
  if (session) {
    redirect("/feed")
  }

  return <LandingPage />
}

function AppSummary() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto pt-12 pb-6 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF004D] to-[#4D7CFF]">
            you know me
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-gray-300">
            A bite-sized Q&A social app with a TikTok-style swipe feed
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        {/* App Overview */}
        <section className="mb-16 max-w-3xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00E4F5]">App Concept</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Every day, users post quirky, funny, or downright weird questions to friends or the public. Other users
                pick any prompt and reply with a video, image, or text—then swipe through an infinite, full-screen
                stream of answers.
              </p>
              <p>
                Follow friends to see their latest replies first, react with likes and comments, and discover fresh
                prompts on your For You feed.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Daily Questions"
              description="Post quirky questions to friends or the public"
              icon="❓"
              color="#FF004D"
            />
            <FeatureCard
              title="Multi-format Answers"
              description="Reply with video, image, or text content"
              icon="🎬"
              color="#4D7CFF"
            />
            <FeatureCard
              title="TikTok-style Feed"
              description="Swipe through an infinite stream of answers"
              icon="👆"
              color="#00E4F5"
            />
            <FeatureCard
              title="Social Connections"
              description="Follow friends to see their replies first"
              icon="👥"
              color="#B100FF"
            />
            <FeatureCard
              title="Engagement Tools"
              description="React with likes and comments on answers"
              icon="❤️"
              color="#FF004D"
            />
            <FeatureCard
              title="Discovery"
              description="Find fresh prompts on your For You feed"
              icon="🔍"
              color="#4D7CFF"
            />
          </div>
        </section>

        {/* App Screens */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">App Screens</h2>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-gray-800/50 mb-8">
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="ask">Ask</TabsTrigger>
              <TabsTrigger value="post">Post</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="own-profile">My Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="auth" className="mt-0">
              <ScreenCard
                title="Auth Screen"
                description="Supabase email/social login on a high-contrast background."
                color="#4D7CFF"
              />
            </TabsContent>

            <TabsContent value="feed" className="mt-0">
              <ScreenCard
                title="Feed Screen"
                description="Vertical, full-screen cards showing each question + answer (video/image/text). TikTok-style swipe up/down, with a right-side action bar for like, comment, share, and follow."
                color="#FF004D"
              />
            </TabsContent>

            <TabsContent value="ask" className="mt-0">
              <ScreenCard
                title="Ask Question Screen"
                description="Simple composer: enter your prompt, select 'Friends' or 'Public,' then Post. Character counter and Hyper Mint Post button keep it clean."
                color="#00E4F5"
              />
            </TabsContent>

            <TabsContent value="post" className="mt-0">
              <ScreenCard
                title="Post (Answer) Screen"
                description="Choose any question, record or upload your content, trim clips, add captions/filters/sounds, then publish. Electric Blue progress indicator and Neon Red publish confirmation."
                color="#B100FF"
              />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <ScreenCard
                title="Profile Screen (Others)"
                description="Browse another user's answered prompts in a swipe or grid view. Follow/unfollow Toggle in Glitch Violet."
                color="#B100FF"
              />
            </TabsContent>

            <TabsContent value="own-profile" className="mt-0">
              <ScreenCard
                title="Own Profile Screen"
                description="Manage your bio, avatar, and posts. Edit or delete answers via a Neon Red swipe-to-delete confirmation. Stats overview in Hyper Mint."
                color="#00E4F5"
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Color Scheme */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Color Scheme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="col-span-1 md:col-span-2 mb-4">
              <p className="text-center text-gray-300 max-w-2xl mx-auto">
                The dual-primary palette of Neon Red + Electric Blue keeps CTAs bold and consistent, while Hyper Mint
                and Glitch Violet provide lively secondary accents.
              </p>
            </div>

            <ColorCard name="Neon Red" hex="#FF004D" role="Primary accent & CTA" />
            <ColorCard name="Electric Blue" hex="#4D7CFF" role="Primary accent & CTA" />
            <ColorCard name="Hyper Mint" hex="#00E4F5" role="Secondary actions / hovers" />
            <ColorCard name="Glitch Violet" hex="#B100FF" role="Card & badge accents" />
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ title, description, icon, color }) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}30` }}
          >
            {icon}
          </div>
          <CardTitle className="text-xl" style={{ color }}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-gray-300">{description}</CardContent>
    </Card>
  )
}

function ScreenCard({ title, description, color }) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
      <div className="h-2" style={{ backgroundColor: color }}></div>
      <CardHeader>
        <CardTitle className="text-xl" style={{ color }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <div className="flex gap-4">
          <div className="flex-1">
            <p>{description}</p>
          </div>
          <div className="hidden md:block w-[200px] h-[400px] bg-gray-900 rounded-xl border border-gray-700 flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <span className="text-sm">Screen Preview</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ColorCard({ name, hex, role }) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
      <div className="h-24" style={{ backgroundColor: hex }}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="outline" className="font-mono">
            {hex}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-gray-300">
        <CardDescription className="text-gray-400">{role}</CardDescription>
      </CardContent>
    </Card>
  )
}
