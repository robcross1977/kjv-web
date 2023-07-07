"use client";

import Header from "@/components/shared/header";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default async function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div className="text-zinc-50">Loading...</div>;

  return (
    <div className="flex flex-col w-11/12 mx-auto my-5">
      <Header />
      {user ? (
        <div className="flex flex-col gap-3 mt-5">
          <h1 className="text-3xl underline">User Profile</h1>
          <div className="flex flex-row gap-3">
            <label className="font-bold" htmlFor="name">
              Name:
            </label>
            <p id="name">{user.name}</p>
          </div>
          <div className="flex flex-row gap-3">
            <label className="font-bold" htmlFor="email">
              Email:
            </label>
            <p id="email">{user.email}</p>
          </div>
          <div className="flex flex-row gap-3">
            <label className="font-bold" htmlFor="sub">
              Email Verified:
            </label>
            <p id="sub">{user.email_verified ? "Yes" : "No"}</p>
          </div>
          <div className="flex flex-row gap-3 align-middle items-center">
            <label className="font-bold" htmlFor="picture">
              Picture:
            </label>
            <Image
              src={user.picture ?? ""}
              alt="profile picture"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-row gap-3 align-middle items-center">
            <label className="font-bold" htmlFor="uid">
              User Id:
            </label>
            <p id="uid">{user.sub}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
