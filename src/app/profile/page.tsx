"use client";

import { Label } from "@/components/ui/label";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      {user ? (
        <div className="flex flex-col gap-3 mt-5">
          <h1 className="text-3xl underline">User Profile</h1>
          <div className="flex flex-row gap-3">
            <Label className="font-bold" htmlFor="name">
              Name:
            </Label>
            <p id="name">{user.name}</p>
          </div>
          <div className="flex flex-row gap-3">
            <Label className="font-bold" htmlFor="email">
              Email:
            </Label>
            <p id="email">{user.email}</p>
          </div>
          <div className="flex flex-row gap-3">
            <Label className="font-bold" htmlFor="sub">
              Email Verified:
            </Label>
            <p id="sub">{user.email_verified ? "Yes" : "No"}</p>
          </div>
          <div className="flex flex-row gap-3 align-middle items-center">
            <Label className="font-bold" htmlFor="picture">
              Picture:
            </Label>
            <Image
              src={user.picture ?? ""}
              alt="profile picture"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-row gap-3 align-middle items-center">
            <Label className="font-bold" htmlFor="uid">
              User Id:
            </Label>
            <p id="uid">{user.sub}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
