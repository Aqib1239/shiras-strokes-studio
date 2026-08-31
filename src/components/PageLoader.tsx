"use client";

import { AnimatePresence, motion } from "framer-motion";

interface PageLoaderProps {
  loading: boolean;
}

export default function PageLoader({ loading }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center justify-center text-center">
            {/* Fluent-style dot ring spinner */}
            <div className="relative h-14 w-14">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-22px)`,
                  }}
                >
                  <span
                    className="block h-full w-full rounded-full bg-primary animate-[fluent-pulse_1.2s_ease-in-out_infinite]"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </span>
              ))}
            </div>

            {/* Loading text */}
            <div className="mt-6">
              <p className="font-display text-lg font-semibold tracking-tight text-ink">
                Shira&rsquo;s Strokes
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Loading your creative space
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}