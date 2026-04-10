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
import rehypeRaw from "rehype-raw";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";

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
<h2>🐌 The Snail Runner’s Manifesto</h2>

<h3>Who is the Snail Runner?</h3>
<p>I am a healthcare professional by day—managing a GP practice and nursing—and a dedicated runner by dawn. But more than that, I am a believer in the power of consistency. My journey isn’t about being the fastest on the bitumen; it’s about the "Snail Philosophy": Slow is smooth, smooth is fast, and forward is the only direction.</p>

<h3>My Definition of Running</h3>
<p>To me, running is a mirror of life. It’s built on a delicate rhythm. I’ve learned that finding that perfect flow takes immense effort and focus, yet it can be broken in a heartbeat. That is why I show up every morning. Whether it’s a 20km long-grind through a "pea-souper" (thick fog), an adrenaline-fueled dash through heavy rain, or a peaceful 5km recovery with my wife—I am there to protect my rhythm.</p>

<h3>The 1% Rule</h3>
<p>I don’t chase miracles; I chase 1% growth.</p>
<p>I believe that being 1% better than I was yesterday is the ultimate win. Some days, that 1% is a new distance record. Other days, it’s simply the discipline to lace up when my legs are sore and the "hard yakka" feels heavy.</p>

<h3>Why the Snail?</h3>
<p>The snail is my spirit animal on the road. It carries its home, moves with intention, and leaves a trail of progress behind. It doesn't matter if the pace is slow, as long as you don't stop.</p>

<p>On this blog, I share my miles, my mistakes, and my momentum. Because in the end, it’s not just about the run—it’s about how we choose to start our day and guard our rhythm.</p>
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

          <div className="prose prose-lg md:prose-xl prose-slate max-w-none break-normal hyphens-auto prose-p:leading-[1.8] ql-snow">
            <div className="ql-editor" style={{ padding: 0, textAlign: 'justify' }}>
              <Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
