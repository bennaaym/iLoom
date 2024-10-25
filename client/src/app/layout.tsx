"use client";
import { ReactNode } from "react";
import {
  AppThemeProvider,
  AuthProvider,
  QueryProvider,
} from "@/common/providers";
import { RouteGuard } from "@/common/guards";
import { MainLayout } from "@/common/components";
import "@/common/styles/global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <RouteGuard>
                <MainLayout>{children}</MainLayout>
              </RouteGuard>
            </AuthProvider>
          </QueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
