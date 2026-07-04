"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SkillTag } from "@/components/ui/SkillTag";

const skillCategories = [
  {
    title: "AI / ML",
    skills: [
      { name: "PyTorch", level: 5 },
      { name: "Transformers", level: 5 },
      { name: "NLP", level: 4 },
      { name: "Computer Vision", level: 3 },
      { name: "Reinforcement Learning", level: 3 },
    ],
  },
  {
    title: "Languages",
    skills: [
      { name: "Python", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "C++", level: 2 },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 5 },
    ],
  },
  {
    title: "Backend & Infra",
    skills: [
      { name: "Node.js", level: 4 },
      { name: "PostgreSQL", level: 4 },
      { name: "Docker", level: 3 },
      { name: "Redis", level: 3 },
    ],
  },
];

export function About() {
  return (
    <SectionWrapper id="about" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Left column: avatar + personal info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left md:sticky md:top-24 md:self-start"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-[#1a1d2e] mb-5 shrink-0">
              <img
                src="/images/avatar.jpg"
                alt="Julian"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-medium text-foreground mb-1">Julian</h3>
            <p className="text-sm text-muted mb-3">M.S., Ocean University of China</p>

            <div className="flex items-center gap-4 mb-4">
              <a
                href="https://github.com/yuanjuju"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="mailto:hello@jinian.dev"
                className="text-muted hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>山东青岛</span>
            </div>
          </motion.div>

          {/* Right column: about text + education + skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:col-span-3"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-6">
              About
            </h2>
            <div className="text-muted text-base leading-relaxed mb-12 space-y-4">
              <p>
                我目前是一名中国海洋大学在读一年级硕士生，我的研究方向是计算机视觉，主要关注于遥感方法。我个人比较喜欢用 Vibe Coding 倒腾一些小工具来简化并且提高学习效率，之后会不定时更新自己的博客，敬请期待～
              </p>
              <p>
                学习之余，我比较喜欢旅行，可以特种兵式也可以松弛式，不想过被框住的人生，所以选择把地图上的名字，变成脚下的泥土和眼前的风景。我骨子里是个无可救药的远方崇拜者。比起标准的标准答案，更喜欢在未知的旅途中盲抽人生盲盒。
              </p>
              <p>
                运动方面，我比较喜欢打羽毛球，目前还属于中羽二级的水平，如果有感兴趣的小伙伴，可以一起切磋切磋。
              </p>
              <p>
                我坚信音符是比文字更诚实的语言。我的耳机里装着一整个华语流行乐的黄金时代：欢快时喜欢周杰伦的天马行空，迷茫时反复播放孙燕姿的干净治愈；想要力量时就听蔡依林的蜕变与自我，而那些无法言说的爱恨遗憾，都留给薛之谦在深夜里撕扯。
              </p>
            </div>

            <h3 className="text-lg font-medium text-foreground mb-5">
              Education
            </h3>

            <div className="mb-14">
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-medium text-foreground">Ocean University of China</h4>
                    <p className="text-sm text-muted mt-0.5">M.S. in Computer Science and Technology</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap shrink-0 pt-0.5">2026.8 – Present</span>
                </div>
              </div>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-medium text-foreground">Ocean University of China</h4>
                    <p className="text-sm text-muted mt-0.5">B.S. in Software Engineering</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap shrink-0 pt-0.5">2022.8 – 2026.7</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mb-6">
              Skills
            </h3>

            <div className="space-y-8">
              {skillCategories.map((category, ci) => (
                <div key={category.title}>
                  <h4 className="text-sm font-medium text-muted mb-3 tracking-wider uppercase">
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {category.skills.map((skill, si) => (
                      <SkillTag
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={ci * 0.1 + si * 0.03}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
