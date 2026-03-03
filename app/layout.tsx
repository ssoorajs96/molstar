import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MolViz — Molecular Visualization with Mol*",
  description: "Interactive 3D molecular structure visualization powered by the Mol* library. Explore proteins, DNA, and other biomolecules in stunning detail.",
  keywords: ["molecular visualization", "molstar", "protein structure", "3D viewer", "bioinformatics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
