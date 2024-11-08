"use client";
import { MainLayout } from "@/common/components";
import ArticleGenerator from "@/features/generate-content/pages/english/article-generator/ArticleGenerator.page";

export default function ArticleGeneratorPage() {
  return (
    <MainLayout>
      <ArticleGenerator />
    </MainLayout>
  );
}
