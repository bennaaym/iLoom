import { MainLayout } from "@/common/components";
import AlgorithmQuestionGenerator from "@/features/generate-content/pages/algorithm/algorithm-question-generator/AlgorithmQuestionGenerator.page";

export default function AlgorithmPage() {
  return (
    <MainLayout>
      <AlgorithmQuestionGenerator />
    </MainLayout>
  );
}
