"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto lg:mx-0">
              <Image
                src="/profile.jpg"
                alt="Portrait of the author running"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-100 rounded-full -z-10 blur-2xl opacity-60" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-2xl opacity-60" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Hi, I&apos;m the runner behind the blog.
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              I&apos;m a runner in my mid-40s who started running in 2021. For me, running isn&apos;t about races or fast paces—it&apos;s about joy and routine. 
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              My philosophy is simple: <strong className="text-orange-500 font-semibold">to run long, run healthy, and stay pain-free</strong>. This space is my personal diary where I share my thoughts, gear reviews, and the routines that keep me on the road.
            </p>
            
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors group"
            >
              <span className="border-b-2 border-orange-500 pb-1">Read my full story</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
