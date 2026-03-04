import { adminGetKit } from "@/app/data/admin/admin-get-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import EditKitForm from "./_components/EditCourseForm";

type params = Promise<{ id: string }>;

const page = async ({ params }: { params: params }) => {
  const { id } = await params;

  const data = await adminGetKit(id);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Kit:{" "}
        <span className="text-primary underline">{data.title}</span>
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>
            Edit basic information about your kit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditKitForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
