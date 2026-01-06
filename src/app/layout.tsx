import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduVibe - Learn • Listen • Enjoy - ena",
  description: "Media Pembelajaran Musik Interaktif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning ditambahkan di body juga untuk menangani suntikan skrip ekstensi */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
