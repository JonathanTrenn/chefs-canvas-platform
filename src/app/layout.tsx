import "./globals.css";

export const metadata = {
  title: "Chef's Canvas",
  description: "Restaurant Menu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}