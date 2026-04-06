import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-slate-900">Your Runner Profile</h1>
          <ProfileForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
