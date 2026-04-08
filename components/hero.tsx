"use client";

import { motion } from "motion/react";
import { Snail, Cloud } from "lucide-react";

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
            <div className="relative w-full aspect-square max-w-[500px] rounded-full bg-gradient-to-b from-white to-orange-50 overflow-hidden shadow-2xl shadow-orange-500/20 border-8 border-white flex items-center justify-center">
              
              {/* Sun */}
              <div className="absolute top-12 right-16 w-20 h-20 bg-amber-300 rounded-full blur-[2px] opacity-80" />

              {/* Clouds */}
              <motion.div 
                animate={{ x: [0, -40, 0] }} 
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-24 right-32 text-orange-200/60"
              >
                <Cloud size={80} fill="currentColor" />
              </motion.div>
              <motion.div 
                animate={{ x: [0, 50, 0] }} 
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 left-16 text-orange-200/40"
              >
                <Cloud size={60} fill="currentColor" />
              </motion.div>

              {/* Ground / Track */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-orange-200/50 to-orange-100/50 border-t-4 border-orange-300 border-dashed"></div>

              {/* The Snail & Speed lines */}
              <motion.div
                animate={{ 
                  x: [-350, 350],
                }}
                transition={{ 
                  x: { duration: 15, repeat: Infinity, ease: "linear" },
                }}
                className="absolute bottom-[22%] flex items-center"
              >
                {/* Speed lines */}
                <div className="relative right-2 flex flex-col gap-3 opacity-60">
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1, 0.5], originX: 1 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-1.5 bg-orange-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1, 0.5], originX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-1.5 bg-orange-400 rounded-full ml-4"
                  />
                </div>

                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -2, 0]
                  }}
                  transition={{ 
                    y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="text-orange-500 drop-shadow-2xl"
                >
                  <Snail size={160} strokeWidth={1.5} />
                </motion.div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
