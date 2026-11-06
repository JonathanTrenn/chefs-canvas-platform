import type { Metadata } from "next";
import "./globals.css";

 export const metadata: Metadata = {
  title: "Chef's Canvas",
  description: "Restaurant Menu",
  verification: {
    google: "Zclhb8w9s2BqhLLq6TCB3bSPmHhihVGj_5I0SDk1PwE",
    other: {
      "msvalidate.01": "6510675E11F4F85296B2DFF2883FFB4D",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
