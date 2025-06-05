"use client";
import SideNav from "@/app/components/dashboard/sidenav";
import Profile from "../components/profile";
import LanguageSwitcher from "../components/languageSwitcher";
import Footer from "../components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex  flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <div className="flex  justify-end items-center gap-2 ">
          <LanguageSwitcher />
          <Profile />
        </div>
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
