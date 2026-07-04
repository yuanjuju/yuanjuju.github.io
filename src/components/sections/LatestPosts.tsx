"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function LatestPosts() {
  return (
    <SectionWrapper id="posts" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Writing
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Blog posts, technical notes, and slices of daily life.
          </p>
        </div>

        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className=" rounded-2xl p-6 md:p-8 text-center border border-black/[0.2]"
          >
            <p className="text-muted text-base leading-relaxed">
              敬请期待～
            </p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
