import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { FeaturedPosts } from "@/components/featured-posts";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <FeaturedPosts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
