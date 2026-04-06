import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";
import { Comments } from "@/components/comments";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = getPostById(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <main className="py-20 lg:py-32">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 ${post.color}`}>
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-500">
              <span>{post.date}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none mb-24 whitespace-pre-wrap">
            {post.content}
          </div>

          <hr className="border-slate-200 mb-16" />
          
          <Comments postId={post.id} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
