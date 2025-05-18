import "./globals.css";

export const metadata = {
  title: "Product | List",
  description: "Product",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
