"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase";

interface Post {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  color: string;
  date: string;
}

export function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, "posts"), orderBy("id", "desc"), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push(doc.data() as Post);
        });
        setPosts(fetchedPosts);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
        if (errorString.includes("missing or insufficient permissions")) {
          setErrorMsg("You don't have permission to view posts.");
        } else {
          setErrorMsg("Failed to load recent posts. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="gear" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="gear" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest Insights</h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Everything you need to run better, from in-depth shoe reviews to science-backed nutrition.
            </p>
          </div>
          <button suppressHydrationWarning className="hidden md:flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors">
            View All Articles <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-medium">{errorMsg}</div>
          </div>
        )}

        {!errorMsg && posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No posts yet. Check back later!
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer flex flex-col h-full"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={post.image || "https://picsum.photos/seed/placeholder/800/600"}
                      alt={post.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${post.color || 'bg-slate-100 text-slate-700'}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-orange-500 font-medium mt-auto">
                      Read Article <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
        
        <button className="md:hidden mt-10 w-full flex items-center justify-center gap-2 text-orange-500 font-semibold bg-orange-50 py-3 rounded-xl hover:bg-orange-100 transition-colors">
          View All Articles <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
