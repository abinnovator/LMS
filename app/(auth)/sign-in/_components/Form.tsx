"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [githubPending, startGithubTransition] = useTransition();
  const [emailTransition, setemailTransition] = useTransition();
  async function SignInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed In With Github");
          },
          onError: (error) => {
            toast.error(`There was an error: ${error}`);
          },
        },
      });
    });
  }
  function SignInWithEmail() {
    setemailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed In With Email");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (error) => {
            toast.error(`There was an error: ${error}`);
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>Login to start learning again</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          onClick={() => SignInWithGithub()}
          disabled={githubPending}
        >
          <GithubIcon className="size-4" />
          Sign In with Github
          {githubPending && <Loader2 className="size-4 animate-spin" />}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email"></Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="me@example.com"
              required
            />
          </div>
          <Button
            className="w-full"
            onClick={() => SignInWithEmail()}
            disabled={emailTransition}
          >
            Sign In
            {emailTransition && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Form;
