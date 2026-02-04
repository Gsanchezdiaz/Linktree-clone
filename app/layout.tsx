import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { esES } from "@clerk/localizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linktree Clone",
  description: "Linktree clone built with Next.js, Prisma, and PostgreSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}> 
        <ClerkProvider localization={esES}>
          <header className="w-full border-b border-[#E5E5E5] bg-white">
            <div className="max-w-3xl mx-auto flex items-center justify-between p-4">
              <div className="font-bold text-lg">Linktree Clone</div>
              <div className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton>
                    <button className="bg-white text-black border border-[#E5E5E5] rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                      Iniciar sesión
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-[#FFDD00] text-black rounded-full font-semibold text-sm h-10 px-4 cursor-pointer">
                      Crear cuenta
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto py-10 px-4">{children}</div>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
