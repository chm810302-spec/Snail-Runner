"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            🐌 The Snail Runner&apos;s Manifesto
          </h2>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Who is the Snail Runner?
          </h3>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            I am a healthcare professional by day—managing a GP practice and nursing—and a dedicated runner by dawn. But more than that, I am a believer in the power of consistency.
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            My journey isn&apos;t about being the fastest on the bitumen; it&apos;s about the <strong className="text-orange-500 font-semibold">&quot;Snail Philosophy&quot;</strong>: Slow is smooth, smooth is fast, and forward is the only direction.
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
    </section>
  );
}
