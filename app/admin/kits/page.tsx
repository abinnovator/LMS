import { adminGetKits } from "@/app/data/admin/admin-get-kits";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";

import EmptyState from "@/components/general/EmptyState";
import AdminKitCard, { AdminCourseCardSkeleton } from "./_components/AdminCourseCard";

const page = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your kits</h1>
        <Link href="/admin/kits/create" className={buttonVariants()}>
          Create kit
        </Link>
      </div>
      <div className="">
        <h1>Here you will see all of your video kits</h1>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderKits />
      </Suspense>
    </>
  );
};

export default page;

async function RenderKits() {
  const data = await adminGetKits();
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Kits Found"
          description="You have not created any kits yet"
          buttonText="Create Kit"
          href="/admin/kits/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {data?.map((kit) => (
            <AdminKitCard key={kit.id} kit={kit} />
          ))}
        </div>
      )}
    </>
  );
}
function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
