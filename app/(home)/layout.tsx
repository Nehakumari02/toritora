import Footer from "@/components/common/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full w-[100%]">
        <div className="flex-1 overflow-y-scroll no-scrollbar">
            {children}
        </div>
        <div className="">
          <Footer/>
        </div>
    </div>
  );
}
