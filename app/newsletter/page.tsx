"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { db } from "@/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const q = query(collection(db, "newsletters"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setNewsletters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4 md:px-8 mt-16 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">Snail Runner Newsletter</h1>
          <p className="text-lg text-slate-600">Weekly tips, stories, and inspiration for slow and steady runners.</p>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {newsletters.map((newsletter) => (
              <Link 
                href={`/newsletter/${newsletter.id}`} 
                key={newsletter.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                    {newsletter.title}
                  </h2>
                  <p className="text-sm text-slate-500">{newsletter.date}</p>
                </div>
                <div className="text-orange-500 font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Issue <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}

            {newsletters.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No newsletters have been published yet.</p>
                <p className="text-sm text-slate-400 mt-2">Check back soon for the first issue!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
