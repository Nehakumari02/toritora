import Footer from "@/components/common/footer";
import GoogleProvider from "@/context/googleContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleProvider>
      {children}
    </GoogleProvider>
  );
}
