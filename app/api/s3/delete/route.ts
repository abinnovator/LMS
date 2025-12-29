import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Cient";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import arcjet, { detectBot, fixedWindow } from "@arcjet/next";

import { RequireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 2,
      characteristics: ["userId"],
    }),
  ],
});

export async function DELETE(request: Request) {
  const session = await RequireAdmin();
  try {
    const decision = await aj.protect(request, {
      userId: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Sorry scammeer. Request Blocked. " },
        { status: 429 }
      );
    }
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return NextResponse.json(
        { error: "Missing or Invalid Key" },
        { status: 400 }
      );
    }
    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });
    await S3.send(command);
    return NextResponse.json(
      { message: "File Deleted Succesfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Missing or Invalid Key" },
      { status: 400 }
    );
  }
}
