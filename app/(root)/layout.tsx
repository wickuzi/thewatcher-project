import React from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { WishlistProvider } from "@/context/WishlistContext";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if(!session) redirect("/sign-in");

  return (
    <WishlistProvider>
      <main className="root-container">
        <div className="mx-auto max-w-5xl">
          <Header session={session} />
          <div className="mt-15 pb-20">{children}</div>
        </div>
      </main>
    </WishlistProvider>
  );
};
export default Layout;
