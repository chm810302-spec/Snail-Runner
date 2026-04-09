"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useFirebase } from "@/components/firebase-provider";

import { handleFirestoreError, OperationType } from "@/lib/firestore-error";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200): Promise<string> => {
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
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function EditAboutPage() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { signInWithGoogle } = useFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "chm810302@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchAbout() {
      if (!isAdmin) return;
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(data.content || "");
          setExistingImageUrl(data.image || "");
        }
      } catch (error: any) {
        console.error("Error fetching about:", error);
        const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
        if (errorString.includes("missing or insufficient permissions")) {
          setErrorMsg("You don't have permission to view this content.");
        } else {
          setErrorMsg("Failed to load about page data. Please check your connection.");
        }
      } finally {
        setFetching(false);
      }
    }
    if (isAdmin) {
      fetchAbout();
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!content.trim()) {
      setErrorMsg("Please fill in the content field.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = existingImageUrl;

      if (imageFile) {
        try {
          imageUrl = await compressImage(imageFile, 1200, 1200);
        } catch (err) {
          console.error("Image processing failed", err);
          setErrorMsg("Failed to process the cover image. Please try a different image.");
          setLoading(false);
          return;
        }
      }

      await setDoc(doc(db, "about", "profile"), {
        content,
        image: imageUrl,
        updatedAt: serverTimestamp(),
      });

      alert("About page updated successfully!");
      router.push("/about");
    } catch (error: any) {
      console.error("Error updating about page:", error);
      
      const errorString = error?.message?.toLowerCase() || String(error).toLowerCase();
      if (errorString.includes("missing or insufficient permissions")) {
        setErrorMsg("You don't have permission to update the about page.");
      } else if (errorString.includes("offline") || errorString.includes("network")) {
        setErrorMsg("Network error. Please check your internet connection and try again.");
      } else if (errorString.includes("quota exceeded")) {
        setErrorMsg("Database quota exceeded. The daily limit has been reached, please try again tomorrow.");
      } else {
        setErrorMsg("An unexpected error occurred while updating. Please try again.");
      }
      
      try {
        handleFirestoreError(error, OperationType.UPDATE, "about");
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  if (authChecking || (isAdmin && fetching)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="py-20 lg:py-32 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-md w-full mx-4">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Admin Access Only</h1>
            <p className="text-slate-600 mb-8">Please sign in with your admin account to continue.</p>
            <button
              onClick={signInWithGoogle}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Sign In with Google
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit About Page</h1>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image (Leave empty to keep current)</label>
                {existingImageUrl && !imageFile && (
                  <div className="mb-4">
                    <img src={existingImageUrl} alt="Current cover" className="h-32 rounded-lg object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    className="h-96"
                    placeholder="Write your about content here... You can use the toolbar to format text, add colors, and insert images."
                  />
                </div>
                <div className="mt-16 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Need to add a compressed image inside the content?</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          try {
                            const compressedBase64 = await compressImage(file, 800, 800);
                            setContent((prev) => prev + `<p><img src="${compressedBase64}" alt="Image" /></p>`);
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
                {loading ? "Updating..." : "Update About Page"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
