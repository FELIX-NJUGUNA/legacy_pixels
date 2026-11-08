import { revalidatePath } from "next/cache";

/** Call after any admin change so the public site shows it immediately. */
export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("revalidate failed:", e);
  }
}