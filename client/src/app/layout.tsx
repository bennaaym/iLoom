"use client";
import { ReactNode } from "react";
import {
  AppThemeProvider,
  AuthProvider,
  QueryProvider,
} from "@/common/providers";
import { AgoraProvider } from "@/features/classroom/video-conference/providers/AgoraProvider";
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
              <AgoraProvider>
                <RouteGuard>
                  <MainLayout>{children}</MainLayout>
                </RouteGuard>
              </AgoraProvider>
            </AuthProvider>
          </QueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
