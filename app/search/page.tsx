"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Clock, Search as SearchIcon } from "lucide-react";

interface Post {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  color: string;
  date: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
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
          setErrorMsg("Failed to load posts. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAllPosts();
  }, []);

  useEffect(() => {
    if (!queryParam.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const lowerQuery = queryParam.toLowerCase();
    const filtered = posts.filter((post) => {
      return (
        (post.title && post.title.toLowerCase().includes(lowerQuery)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) ||
        (post.content && post.content.toLowerCase().includes(lowerQuery)) ||
        (post.category && post.category.toLowerCase().includes(lowerQuery))
      );
    });
    setFilteredPosts(filtered);
  }, [queryParam, posts]);

  return (
    <main className="py-20 lg:py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <SearchIcon className="h-8 w-8 text-orange-500" />
            Search Results
          </h1>
          <p className="text-lg text-slate-600">
            {queryParam ? (
              <>Showing results for <span className="font-semibold text-slate-900">&quot;{queryParam}&quot;</span></>
            ) : (
              "Showing all posts"
            )}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm font-medium">{errorMsg}</div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : !errorMsg && filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
            <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-500">
              We couldn&apos;t find any posts matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
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
                  
                  <div className="p-6 flex-1 flex flex-col">
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
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
