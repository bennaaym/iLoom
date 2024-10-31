import { MainLayout } from "@/common/components";
import StudentManagement from "@/features/dashboard/pages/StudentManagement.page";

export default function DashboardPage() {
  return (
    <MainLayout>
      <StudentManagement />
    </MainLayout>
  );
}
