import "../styles/globals.css";

export const metadata = {
  title: "Varun ❤️ Aashna",
  description: "A chic little love-site in pixels + motion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
