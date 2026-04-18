import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function NewsletterIssuePage({ params }: { params: Promise<{ id: string }> }) {
  // Use React's use() if we needed to await params, but Next.js 14 server components usually just accept params.
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // We can fetch directly from Firestore in a server component (optional, though Firebase Admin is preferred for strict server-side, 
  // since this is just reading public data we can use the regular SDK).
  const docRef = doc(db, "newsletters", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const newsletter = docSnap.data();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4 mt-16 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{newsletter.title}</h1>
        <p className="text-slate-500 mb-8">{newsletter.date}</p>
        
        {newsletter.pdfUrl ? (
          <div className="flex flex-col gap-4">
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl flex items-center justify-between">
              <span className="text-sm">Having trouble viewing the PDF?</span>
              <a 
                href={newsletter.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Open / Download PDF
              </a>
            </div>
            
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(newsletter.pdfUrl)}&embedded=true`} 
              className="w-full h-[800px] rounded-xl shadow-lg border border-slate-200 bg-white" 
              title={newsletter.title}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div dangerouslySetInnerHTML={{ __html: newsletter.htmlContent }} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
