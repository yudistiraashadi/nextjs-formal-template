"use server";

import { redirect } from "next/navigation";

export async function redirectToEditUser(userId: string) {
  redirect(`/dashboard/user/edit/${userId}`);
}
