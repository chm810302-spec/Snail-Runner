"use client";

import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Comments } from "@/components/comments";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc, collection, query, orderBy, limit, getDocs, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { use } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import { Pencil, Trash2, Share2, Facebook, Link as LinkIcon, Heart } from "lucide-react";

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
  likes?: number;
}

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (resolvedParams.id) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (likedPosts[resolvedParams.id]) {
        setHasLiked(true);
      }
    }
  }, [resolvedParams.id]);

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

  useEffect(() => {
    async function fetchRelated() {
      if (!post) return;
      try {
        const q = query(collection(db, "posts"), orderBy("id", "desc"), limit(4));
        const snap = await getDocs(q);
        const related = snap.docs
          .map(d => d.data() as Post)
          .filter(p => p.id !== post.id)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (e) {
        console.error("Failed to fetch related posts", e);
      }
    }
    fetchRelated();
  }, [post]);

  const handleLike = async () => {
    if (!post || isLiking) return;
    setIsLiking(true);
    
    const docRef = doc(db, "posts", post.id);
    const newHasLiked = !hasLiked;
    
    try {
      await updateDoc(docRef, {
        likes: increment(newHasLiked ? 1 : -1)
      });
      
      setPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + (newHasLiked ? 1 : -1) } : null);
      setHasLiked(newHasLiked);
      
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (newHasLiked) {
        likedPosts[post.id] = true;
      } else {
        delete likedPosts[post.id];
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    setErrorMsg("");
    try {
      await deleteDoc(doc(db, "posts", resolvedParams.id));
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
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
    setShowShareMenu(false);
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
      <main className="py-12 lg:py-20 bg-slate-50">
        <article className="max-w-3xl mx-auto bg-white sm:rounded-3xl sm:shadow-sm sm:border sm:border-slate-100 overflow-hidden">
          
          {errorMsg && (
            <div className="m-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          {post && (
            <>
              <div className="p-6 sm:p-10 pb-0">
                <div className="mb-8 text-center">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 ${post.color || 'bg-slate-100 text-slate-700'}`}>
                    {post.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
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
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Post
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 text-slate-500 mb-8">
                    <span>{post.date}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden bg-slate-100">
                <Image
                  src={post.image || "https://picsum.photos/seed/placeholder/1200/600"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 sm:p-10 pt-10 ql-snow">
                <div className="ql-editor prose prose-lg md:prose-xl prose-slate max-w-none mb-12 break-normal hyphens-auto prose-p:leading-[1.8] prose-img:rounded-2xl prose-img:w-full prose-img:object-cover prose-img:my-8" style={{ padding: 0, textAlign: 'justify' }}>
                  <Markdown rehypePlugins={[rehypeRaw]}>{post.content}</Markdown>
                </div>

                <div className="flex items-center justify-start gap-4 mb-12 py-6 border-y border-slate-100 relative">
                  <button 
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      hasLiked 
                        ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    {post.likes || 0}
                  </button>

                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-medium transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  
                  {showShareMenu && (
                    <div className="absolute top-20 left-28 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 z-10 w-48">
                      <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors text-left">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Share to Facebook
                      </button>
                      <button onClick={() => handleShare('copy')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors text-left">
                        <LinkIcon className="w-4 h-4 text-slate-500" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
                
                <Comments postId={post.id} />
              </div>
            </>
          )}
        </article>

        {post && relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 px-2">More Posts</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map(rp => (
                <Link key={rp.id} href={`/posts/${rp.id}`} className="block group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <h4 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2 text-lg">{rp.title}</h4>
                  <p className="text-sm text-slate-500">{rp.date}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Post</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
