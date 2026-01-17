import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";
import { admin, emailOTP } from "better-auth/plugins";
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
    // OTP
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // if (type === "sign-in") {
        //   // Send the OTP for sign in
        // } else if (type === "email-verification") {
        await resend.emails.send({
          from: "React Mastery <support@hello.aaditbhambri.com>",
          to: [email],
          subject: "Verify your email",
          html: `Your verification code is ${otp}`,
        });
        // } else {
        //   // Send the OTP for password reset
        // }
      },
    }),
    // Admin Settings
    admin(),
  ],
});
