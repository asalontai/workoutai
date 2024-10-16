import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WorkoutAI",
  description: "A Chat Bot to help your fitness and diet needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

