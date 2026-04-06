import { Activity, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 inline-flex">
              <div className="bg-orange-500 text-white p-2 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Run<span className="text-orange-500">Long</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-md mb-6">
              Our mission is simple: Run Long, Run Healthy, Pain-Free. Join our global community of runners dedicated to lifelong fitness and joy.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Me</Link></li>
              <li><Link href="/#gear" className="hover:text-orange-500 transition-colors">Gear Reviews</Link></li>
              <li><Link href="/#training" className="hover:text-orange-500 transition-colors">Training & Strength</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Run Long & Healthy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
