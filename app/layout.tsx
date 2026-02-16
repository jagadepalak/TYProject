import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />

          {/* 🔔 Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937", // gray-800
                color: "#f9fafb",      // gray-50
              },
            }}
          />

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
