import LoginForm from "@/app/components/login-form";
import { Metadata } from "next";
import TrackerLogo from "../components/logo";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    // <main className="flex items-center justify-center md:h-screen">
    //   <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
    //     <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
    //       <div className="w-32 text-center text-white md:w-36">
    //         <TrackerLogo width={100} height={100} />{" "}
    //       </div>
    //     </div>
    //     <LoginForm />
    //   </div>
    // </main>
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center justify-center rounded-lg mb-3 md:h-36">
          <div className="text-center text-white">
            {/* <TrackerLogo width={80} height={100}  /> */}
            <TrackerLogo width={70} height={90} className="w-70 h-90" />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
