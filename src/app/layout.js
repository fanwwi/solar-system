import "./globals.css";

export const metadata = {
  title: "HOLOX — Interactive 3D",
  description:
    "Interactive 3D holographic experience powered by hand tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
