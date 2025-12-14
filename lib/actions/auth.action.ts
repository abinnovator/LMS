import { auth } from "../auth";
import { authClient } from "../auth-client";

export async function ServerLogout() {
  try {
    await auth.api.signOut({ headers: {} });
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function logout() {
  await authClient.signOut({});
}
