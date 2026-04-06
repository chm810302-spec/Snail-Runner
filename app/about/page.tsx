"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { motion } from "motion/react";
import { Snail, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("/profile.jpg");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "chm810302@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.content) setContent(data.content);
          if (data.image) setImageUrl(data.image);
        } else {
          // Fallback to default content if no document exists
          setContent(`
Hello! I'm a runner in my mid-40s. The reason I started running is quite simple. I was looking for a workout that wasn't bound by time, location, or equipment. Running seemed like the absolute best choice, so I laced up my shoes and began my journey in 2021.

## My Running Philosophy

To this day, I have never participated in a single race—and honestly, I don't have much desire to.

When I first started, I was obsessed with getting faster. I pushed myself frantically, but I soon realized that chasing speed was actually stealing the pure joy of running away from me. Since that realization, I stopped constantly checking my watch to measure my pace.

For me, the philosophy of running comes down to two things: **joy and routine**. My ultimate goal is simple: **to run long, run healthy, and stay pain-free**. I just want to keep enjoying this wonderful, healthy routine for a very long time.

## Why I Started This Blog

I created this space to share my journey and connect with runners all over the world. Here, you'll find:

- **Honest Gear Reviews:** I test shoes and gear so you know what actually works for everyday runners.
- **Strength & Mobility:** The secret to running pain-free is what you do when you're *not* running. I share the routines that keep injuries away.
- **Personal Reflections:** Thoughts on motivation, the mental side of running, and finding joy in the miles.

<div class="bg-orange-50 p-8 rounded-2xl border border-orange-100 mt-12">
  <h3 class="text-xl font-bold text-slate-900 mb-4">Let's Connect</h3>
  <p class="text-lg text-slate-600">
    Running is better together. I'd love to hear about your running journey, your favorite routes, or the shoes you're currently loving. Feel free to reach out on social media or subscribe to the newsletter to stay in touch!
  </p>
</div>
          `);
        }
      } catch (error: any) {
        console.error("Error fetching about page:", error);
        const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
        if (errorString.includes("missing or insufficient permissions")) {
          setErrorMsg("You don't have permission to view this page.");
        } else {
          setErrorMsg("Failed to load about page data. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <main className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              About Me
            </h1>
            
            {isAdmin && (
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={() => router.push("/admin/about")}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit About Page
                </button>
              </div>
            )}

            <motion.p 
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl text-orange-500 font-medium flex items-center justify-center gap-2"
            >
              <Snail className="h-6 w-6" />
              &quot;Run long, run healthy, pain-free&quot;
            </motion.p>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden mb-16 shadow-xl bg-slate-100">
            <Image
              src={imageUrl}
              alt="Running on a trail"
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
