"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequest() {
  const [emailPenidng, startTranistion] = useTransition();
  const [otp, setOtp] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email") as string;
  function verifyOtp() {
    startTranistion(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed In ");
            redirect("/");
          },
          onError: (error) => {
            toast.error(`There was an error: ${error}`);
          },
        },
      });
    });
  }
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center ">
        <p className="text-xl">Please check your email</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center flex-col items-center space-y-7">
          <InputOTP
            type="text"
            placeholder="Enter verification code"
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(e) => setOtp(e)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button onClick={verifyOtp}>Verify</Button>
        </div>
      </CardContent>
    </Card>
  );
}
