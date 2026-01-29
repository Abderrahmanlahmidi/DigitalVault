import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});


export const metadata = {
  title: "DigitalVault",
  description: "Securely buy and sell 3D models, code snippets, and Notion templates with instant delivery via temporary links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans `} >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
