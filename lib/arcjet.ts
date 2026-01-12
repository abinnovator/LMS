import "server-only";
import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";
export {
  shield,
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
};

export const aj = arcjet({
  // Get your site key from https://app.arcjet.com
  // and set it as an environment variable rather than hard coding.
  // See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
  key: env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: "LIVE",
    }),
  ],
});
