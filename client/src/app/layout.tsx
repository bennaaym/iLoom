"use client";
import "regenerator-runtime/runtime";
import { ReactNode } from "react";
import {
  AppThemeProvider,
  AuthProvider,
  QueryProvider,
} from "@/common/providers";
import { AgoraProvider } from "@/features/classroom/video-conference/providers/AgoraProvider";
import { RouteGuard } from "@/common/guards";
import "@/common/styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";

const font = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AppThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <AgoraProvider>
                <RouteGuard>{children}</RouteGuard>
              </AgoraProvider>
            </AuthProvider>
          </QueryProvider>
        </AppThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
