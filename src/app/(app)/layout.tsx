import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // font weights you want to use
    subsets: ['latin'], // usually 'latin' is enough
    style: 'normal', // optional, can also use 'italic'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${poppins.className}`}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
