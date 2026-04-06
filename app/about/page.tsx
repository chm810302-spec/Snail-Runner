"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { motion } from "motion/react";
import { Snail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <main className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              About Me
            </h1>
            <motion.p 
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl text-orange-500 font-medium flex items-center justify-center gap-2"
            >
              <Snail className="h-6 w-6" />
              &quot;Run long, run healthy, pain-free&quot;
            </motion.p>
          </div>

          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-xl">
            <Image
              src="https://picsum.photos/seed/running-trail/1200/600"
              alt="Running on a trail"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl leading-relaxed text-slate-700 mb-8">
              Hello! I&apos;m a runner in my mid-40s. The reason I started running is quite simple. I was looking for a workout that wasn&apos;t bound by time, location, or equipment. Running seemed like the absolute best choice, so I laced up my shoes and began my journey in 2021.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">My Running Philosophy</h2>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              To this day, I have never participated in a single race—and honestly, I don&apos;t have much desire to.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              When I first started, I was obsessed with getting faster. I pushed myself frantically, but I soon realized that chasing speed was actually stealing the pure joy of running away from me. Since that realization, I stopped constantly checking my watch to measure my pace.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              For me, the philosophy of running comes down to two things: <strong>joy and routine</strong>. My ultimate goal is simple: <strong>아프지 않고 길게 오래 달리자</strong> (Run long, run healthy, pain-free). I just want to keep enjoying this wonderful, healthy routine for a very long time.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Why I Started This Blog</h2>
            <p className="text-lg leading-relaxed text-slate-600 mb-6">
              I created this space to share my journey and connect with runners all over the world. Here, you&apos;ll find:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-lg text-slate-600 mb-8">
              <li><strong>Honest Gear Reviews:</strong> I test shoes and gear so you know what actually works for everyday runners.</li>
              <li><strong>Strength &amp; Mobility:</strong> The secret to running pain-free is what you do when you&apos;re <em>not</em> running. I share the routines that keep injuries away.</li>
              <li><strong>Personal Reflections:</strong> Thoughts on motivation, the mental side of running, and finding joy in the miles.</li>
            </ul>

            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100 mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Let&apos;s Connect</h3>
              <p className="text-lg text-slate-600">
                Running is better together. I&apos;d love to hear about your running journey, your favorite routes, or the shoes you&apos;re currently loving. Feel free to reach out on social media or subscribe to the newsletter to stay in touch!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
