"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

const events: TimelineEvent[] = [
  {
    date: "2026.08",
    title: "换个身份，再度启航",
    description:
      "重返中国海洋大学攻读硕士学位，在计算机视觉与遥感领域继续深耕。",
  },
  {
    date: "2026.07",
    title: "顺利毕业，轻帆已过",
    description:
      "正式为四年的本科生涯画上圆满句点。行李箱里装满了答辩通过的论文，也装满了大半个中国的泥土。",
  },
  {
    date: "2026.06",
    title: "东北七日，友谊万岁",
    description:
      "与挚友同行，盲抽了一场属于夏日的东北盲盒。用松弛的步调，丈量白山黑水间的烟火气。",
  },
  {
    date: "2026.05",
    title: "新疆十日，旷野逐风",
    description:
      "本科毕业论文答辩结束后的硬核庆祝。在广袤的新疆旷野里扮演了十天“特种兵”，把地图上的远方变成了脚下的风景。",
  },
  {
    date: "2022.09",
    title: "初见海大",
    description:
      "顺利进入中国海洋大学攻读本科学位，开启了探索计算机世界与追寻未知的序幕。",
  },
];

export function Timeline() {
  return (
    <SectionWrapper id="timeline" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Timeline
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Moments that shaped the journey — from campus to the open road.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px bg-gray-200 dark:bg-[#1a1d2e]" />

          <div className="space-y-12">
            {events.map((event, i) => (
              <motion.div
                key={event.date + event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-blue-500/50 bg-background z-10" />

                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 0 ? "md:pr-0 md:text-right" : "md:pl-0"}`}>
                  <div className=" rounded-2xl p-5 md:p-6 border border-black/[0.2]">
                    <span className="text-xs font-mono text-blue-500/70 mb-2 block">
                      {event.date}
                    </span>
                    <h3 className="text-base font-medium text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for the other side on desktop */}
                <div className="hidden md:block md:w-[calc(50%-40px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
