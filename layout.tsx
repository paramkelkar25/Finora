
import "./globals.css";

export const metadata = {
  title: "Finora",
  description: "Smart Monthly Planning For Modern Indian Families"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
