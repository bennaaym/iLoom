"use client";
import { ReactNode } from "react";
import {
  AppThemeProvider,
  AuthProvider,
  QueryProvider,
} from "@/common/providers";
import { RouteGuard } from "@/common/guards";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <RouteGuard>{children}</RouteGuard>
            </AuthProvider>
          </QueryProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
