import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { EmailTemplate } from "@/components/sidebar/EmailTemplate";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // if (type === "sign-in") {
        //   // Send the OTP for sign in
        // } else if (type === "email-verification") {
        await resend.emails.send({
          from: "Aadit Bhambri <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email",
          html: `Your verification code is ${otp}`,
        });
        // } else {
        //   // Send the OTP for password reset
        // }
      },
    }),
  ],
});
