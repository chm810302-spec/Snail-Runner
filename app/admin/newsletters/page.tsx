"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { useFirebase } from "@/components/firebase-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Trash2, Eye } from "lucide-react";
import firebaseConfig from "@/firebase-applet-config.json";

export default function AdminNewsletters() {
  const { user, profile, loading: authChecking } = useFirebase();
  const isAdmin = profile?.role === "admin";
  const router = useRouter();
  
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!authChecking && !isAdmin) {
      router.push("/");
      return;
    }

    const fetchNewsletters = async () => {
      try {
        const q = query(collection(db, "newsletters"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsletters(data);
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      } finally {
        setFetching(false);
      }
    };

    if (isAdmin) fetchNewsletters();
  }, [isAdmin, authChecking, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }

    setPdfFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    if (!date) {
      const today = new Date();
      setDate(today.toISOString().split('T')[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !pdfFile || !user) return;

    setIsUploading(true);
    setUploadProgress(10); // Initialize progress
    try {
      const id = Date.now().toString();
      const token = await user.getIdToken();
      
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('token', token);
      formData.append('id', id);
      formData.append('bucket', firebaseConfig.storageBucket);

      setUploadProgress(40); // Communicating

      // We use an API proxy to bypass restrictive Firebase web SDK CORS rules
      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Upload failed: ${res.statusText}`);
      }
      
      setUploadProgress(80); // Uploaded, saving metadata
      const { pdfUrl } = await res.json();

      // Save document to Firestore
      await setDoc(doc(db, "newsletters", id), {
        id,
        title,
        date,
        pdfUrl,
        createdAt: serverTimestamp()
      });
      
      setUploadProgress(100);
      alert("Newsletter uploaded successfully!");
      setTitle("");
      setDate("");
      setPdfFile(null);
      
      // clear file input
      const fileInput = document.getElementById('pdfUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // refresh
      const q = query(collection(db, "newsletters"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setNewsletters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Error uploading newsletter. " + err.message + "\n(Please make sure you have allowed Google Cloud Storage via the Firebase console as instructed)");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    // Remove window.confirm to avoid iframe blocks
    setDeletingId(id);
    try {
      if (user) {
        // Find the URL to delete from storage if possible
        const itemToDelete = newsletters.find(n => n.id === id);
        
        // Use proxy to delete file to bypass CORS
        if (itemToDelete?.pdfUrl) {
          const token = await user.getIdToken();
          await fetch('/api/delete-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              id,
              bucket: firebaseConfig.storageBucket,
            }),
          });
        }
      }

      // Delete the Firestore document
      await deleteDoc(doc(db, "newsletters", id));
      
      setNewsletters(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      if (err.code === 'permission-denied') {
        alert("Permission denied! Your account does not have admin privileges to delete this post.");
      } else {
        alert("Error deleting newsletter: " + (err.message || "Unknown error"));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (authChecking || fetching) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Manage Newsletters</h1>
        <Link href="/admin" className="text-orange-500 hover:text-orange-600">Back to Admin</Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Upload New Newsletter
        </h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Issue #2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PDF File</label>
            <input id="pdfUpload" type="file" accept=".pdf" onChange={handleFileUpload} className="w-full" required={!pdfFile} />
          </div>

          {pdfFile && (
            <div className="p-4 bg-slate-50 border rounded-lg text-xs text-slate-500 overflow-auto flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              {uploadProgress !== null && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={isUploading || !pdfFile} className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-colors hover:bg-orange-600">
            {isUploading ? `Uploading... ${uploadProgress !== null ? uploadProgress + '%' : ''}` : "Upload Newsletter"}
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-6">Existing Newsletters</h2>
      <div className="space-y-4">
        {newsletters.map(n => (
          <div key={n.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-800">{n.title}</h3>
              <p className="text-sm text-slate-500">{n.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/newsletter/${n.id}`} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 rounded-lg">
                <Eye className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => handleDelete(n.id)} 
                disabled={deletingId === n.id}
                className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg disabled:opacity-50"
              >
                {deletingId === n.id ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
        {newsletters.length === 0 && <p className="text-slate-500 text-center py-8">No newsletters uploaded yet.</p>}
      </div>
    </div>
  );
}
