"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/ui/ProjectCard";

const projects = [
  {
    title: "高光谱图像分类",
    description:
      "软件工程理论项目，基于 Python 实现高光谱图像分类算法，探索遥感影像的深度学习分析方法。",
    tags: ["Python", "PyTorch", "高光谱", "图像分类"],
    gitee: "https://gitee.com/yuan-jiajunun/Hyperspectral-image-classification",
  },
  {
    title: "教务管理系统",
    description:
      "基于 SpringBoot 开发的教务管理系统，涵盖课程管理、学生信息管理、成绩管理等核心模块，简化教务工作流程。",
    tags: ["SpringBoot", "Java", "MySQL"],
    gitee: "https://gitee.com/yuan-jiajunun/Educational_system",
  },
  {
    title: "PVZ 自创版",
    description:
      "使用 C++ 复刻实现植物大战僵尸简易版，还原经典玩法，包含多种植物和僵尸类型，自主实现游戏逻辑与碰撞检测。",
    tags: ["C++", "游戏开发"],
    gitee: "https://gitee.com/yuan-jiajunun/pvz-self-created",
  },
];

export function Projects() {
  return (
    <SectionWrapper id="projects" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Projects
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Things IThings I've built for fun, for class, and for the sake of learning.apos;ve built for fun, for class, and for the sake of learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
