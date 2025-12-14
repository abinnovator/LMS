import { headers } from "next/headers";
import Form from "./_components/Form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthPage } from "./_components/auth-page";

const page = async () => {
  return <AuthPage />;
};

export default page;
