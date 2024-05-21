"use server";

import { createAdminClient } from "@/db/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { users } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";

/**
 * Delete User
 */
export async function deleteUser(prevState: any, formData: FormData) {
  const userId = formData.get("userId")
    ? (formData.get("userId") as string)
    : undefined;

  const db = createDrizzleConnection();
  const userData = await db.select().from(users);

  const result = z
    .object({
      userId: z
        .string()
        .refine((val) => userData.find((user) => user.id === val), {
          message: "User tidak ditemukan",
        }),
    })
    .safeParse({
      userId,
    });

  // validasi error
  if (!result.success) {
    let errorFormatted = result.error.format();

    return {
      error: {
        general: errorFormatted.userId?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  const { data: deleteUserData, error: deleteUserError } =
    await supabaseAdmin.auth.admin.updateUserById(result.data.userId, {
      app_metadata: {
        deleted_at: new Date().toISOString(),
      },
    });

  if (deleteUserError) {
    return {
      error: {
        general: deleteUserError.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  return {
    message: "User berhasil dihapus",
  };
}
