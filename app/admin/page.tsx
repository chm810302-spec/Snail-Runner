"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { handleFirestoreError, OperationType } from "@/lib/firestore-error";

const compressImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Gear Review");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin (using email for simplicity based on rules)
        if (user.email === "chm810302@gmail.com") {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      } else {
        router.push("/");
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!title.trim() || !content.trim() || !excerpt.trim() || !imageFile) {
      setErrorMsg("Please fill in all required fields and select a cover image.");
      return;
    }

    setLoading(true);
    try {
      // 1. Process image (Base64 only to avoid Storage hangs)
      let imageUrl = "";
      try {
        imageUrl = await compressImage(imageFile, 800, 800);
      } catch (err) {
        console.error("Image processing failed", err);
        setErrorMsg("Failed to process the cover image. Please try a different image or check if the file is corrupted.");
        setLoading(false);
        return;
      }

      // 2. Save post to Firestore
      const postId = Date.now().toString();
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Calculate read time (rough estimate: 200 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200) + " min read";

      // Assign color based on category
      let color = "bg-slate-100 text-slate-700";
      if (category === "Gear Review") color = "bg-blue-100 text-blue-700";
      if (category === "Training & Strength") color = "bg-green-100 text-green-700";
      if (category === "Race Report") color = "bg-orange-100 text-orange-700";

      await setDoc(doc(db, "posts", postId), {
        id: postId,
        title,
        category,
        excerpt,
        content,
        image: imageUrl,
        readTime,
        color,
        date: dateStr,
        createdAt: serverTimestamp(),
      });

      alert("Post published successfully!");
      router.push(`/posts/${postId}`);
    } catch (error: any) {
      console.error("Error publishing post:", error);
      
      // Parse specific errors to give actionable feedback
      const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
      if (errorString.includes("missing or insufficient permissions")) {
        setErrorMsg("You don't have permission to publish posts. Please ensure you are logged in as an admin.");
      } else if (errorString.includes("offline") || errorString.includes("network")) {
        setErrorMsg("Network error. Please check your internet connection and try again.");
      } else if (errorString.includes("quota exceeded")) {
        setErrorMsg("Database quota exceeded. The daily limit has been reached, please try again tomorrow.");
      } else {
        setErrorMsg("An unexpected error occurred while publishing. Please try again.");
      }
      
      try {
        handleFirestoreError(error, OperationType.CREATE, "posts");
      } catch (e) {
        // Ignore the thrown error from handleFirestoreError as we are handling it in UI
      }
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Write a New Post</h1>
            
            {errorMsg && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm font-medium">{errorMsg}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Gear Review">Gear Review</option>
                  <option value="Training & Strength">Training & Strength</option>
                  <option value="Race Report">Race Report</option>
                  <option value="Thoughts">Thoughts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt (Short Summary)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="A brief summary of the post..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-y"
                  placeholder="Write your post content here... You can use Markdown or HTML."
                  required
                />
                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Need to add an image inside the content?</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          try {
                            const compressedBase64 = await compressImage(file, 800, 800);
                            setContent((prev) => prev + `\n\n![Image](${compressedBase64})\n\n`);
                            alert("Image added to content!");
                          } catch (compressionErr) {
                            console.error("Compression failed", compressionErr);
                            alert("Failed to process image.");
                          }
                        }
                      }}
                      className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
