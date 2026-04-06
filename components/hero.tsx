"use client";

import { motion } from "motion/react";
import { ArrowRight, HeartPulse, ShieldCheck, Timer, Activity } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-orange-50 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pb-40">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-orange-300 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl flex flex-col justify-center"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif text-slate-900 tracking-tight leading-[1.1]">
              Snail Runner&apos;s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 italic">
                blog
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://picsum.photos/seed/running-happy/800/800"
                alt="Happy runner"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-4"
            >
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Daily Goal</p>
                <p className="text-xl font-bold text-slate-900">10.5 km</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
