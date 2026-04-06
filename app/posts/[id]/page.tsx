"use client";

import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Comments } from "@/components/comments";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { use } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import { Pencil, Trash2 } from "lucide-react";

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

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
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
    async function fetchPost() {
      try {
        const docRef = doc(db, "posts", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data() as Post);
        } else {
          setPost(null);
        }
      } catch (error: any) {
        console.error("Error fetching post:", error);
        const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
        if (errorString.includes("missing or insufficient permissions")) {
          setErrorMsg("You don't have permission to view this post.");
        } else {
          setErrorMsg("Failed to load post data. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    // We cannot use window.confirm easily in an iframe, but we will keep it for now as requested or use a custom modal.
    // The prompt says "offer actionable steps to resolve them", so we will just improve the error message.
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setErrorMsg("");
    try {
      await deleteDoc(doc(db, "posts", resolvedParams.id));
      alert("Post deleted successfully.");
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
      if (errorString.includes("missing or insufficient permissions")) {
        setErrorMsg("You don't have permission to delete this post. Please log in as an admin.");
      } else {
        setErrorMsg("Failed to delete post. Please check your connection and try again.");
      }
      try {
        handleFirestoreError(error, OperationType.DELETE, "posts");
      } catch (e) {}
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post && !errorMsg) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
        <a href="/" className="text-orange-500 hover:underline">Return home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <main className="py-20 lg:py-32">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          {post && (
            <>
              <div className="mb-12 text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 ${post.color || 'bg-slate-100 text-slate-700'}`}>
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                  {post.title}
                </h1>
                
                {isAdmin && (
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => router.push(`/admin/edit/${post.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-slate-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden mb-16 shadow-xl bg-slate-100">
                <Image
                  src={post.image || "https://picsum.photos/seed/placeholder/1200/600"}
                  alt={post.title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="prose prose-lg prose-slate max-w-none mb-24">
                <Markdown>{post.content}</Markdown>
              </div>

              <hr className="border-slate-200 mb-16" />
              
              <Comments postId={post.id} />
            </>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
