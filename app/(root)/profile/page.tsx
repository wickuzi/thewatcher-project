// app/(root)/profile/page.tsx
import React from "react";
import WatchList from "@/components/WatchList";
import { sampleWatches } from "@/app/constants";
import { SignOutButton } from "@/components/SignOutButton";

const ProfilePage = () => {
  return (
    <>
    <div>
      <h1 className="text-4xl font-bebas-neue text-light-100 mb-4">Perfil</h1>
      <div className="flex justify-end">
        <SignOutButton />
      </div>
    </div>
      <WatchList name="WishList" watches={sampleWatches} />
    </>
  );  
};

export default ProfilePage;