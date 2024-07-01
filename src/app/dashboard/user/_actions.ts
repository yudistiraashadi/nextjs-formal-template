"use server";

import { createAdminClient } from "@/db/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { userRoles, userProfiles } from "@/db/drizzle/schema";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { permanentRedirect } from "next/navigation";

/**
 * Create User
 */
export async function createUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validation = await z
    .object({
      username: z.string().min(1),
      name: z.string().min(1),
      roleId: z.coerce.number().refine(
        async (val) => {
          return db
            .select()
            .from(userRoles)
            .where(eq(userRoles.id, val))
            .then((res) => res.length > 0);
        },
        {
          message: "Role tidak ditemukan",
        }
      ),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParseAsync({
      username: formData.get("username")
        ? (formData.get("username") as string)
        : undefined,
      name: formData.get("name") ? (formData.get("name") as string) : undefined,
      roleId: formData.get("roleId")
        ? (formData.get("roleId") as string)
        : undefined,
      password: formData.get("password")
        ? (formData.get("password") as string)
        : undefined,
      passwordConfirmation: formData.get("passwordConfirmation")
        ? (formData.get("passwordConfirmation") as string)
        : undefined,
    });

  // validasi error
  if (!validation.success) {
    let errorFormatted = validation.error.format();

    return {
      error: {
        general: undefined, // for typescript
        username: errorFormatted.username?._errors[0],
        name: errorFormatted.name?._errors[0],
        roleId: errorFormatted.roleId?._errors[0],
        password: errorFormatted.password?._errors[0],
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  // create user
  const { data: createUserData, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email: validation.data.username + "@email.com",
      password: validation.data.password,
      email_confirm: true,
      user_metadata: { name: validation.data.name },
    });

  // supabase createUser error
  if (createUserError) {
    return {
      error: {
        general:
          createUserError?.status === 422
            ? "Username sudah digunakan"
            : createUserError.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  const searchParamString = new URLSearchParams({
    notificationType: "success",
    notificationMessage: `Berhasil membuat user baru Username: ${
      createUserData.user.email?.split("@")[0]
    }`,
  }).toString();

  permanentRedirect(`/dashboard/user?${searchParamString}`);
}

/**
 * Edit User
 */
export async function editUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validation = await z
    .object({
      id: z
        .string()
        .min(1)
        .refine(
          async (val) => {
            return db
              .select()
              .from(userProfiles)
              .where(eq(userProfiles.id, val))
              .then((res) => res.length > 0);
          },
          {
            message: "User tidak ditemukan",
          }
        ),
      username: z.string().min(1).optional(),
      name: z.string().min(1).optional(),
      roleId: z.coerce
        .number()
        .refine(
          async (val) => {
            return db
              .select()
              .from(userRoles)
              .where(eq(userRoles.id, val))
              .then((res) => res.length > 0);
          },
          {
            message: "Role tidak ditemukan",
          }
        )
        .optional(),
      password: z.string().min(6).optional(),
      passwordConfirmation: z.string().min(6).optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParseAsync({
      id: formData.get("id") ? (formData.get("id") as string) : undefined,
      username: formData.get("username")
        ? (formData.get("username") as string)
        : undefined,
      name: formData.get("name") ? (formData.get("name") as string) : undefined,
      roleId: formData.get("roleId")
        ? (formData.get("roleId") as string)
        : undefined,
      password: formData.get("password")
        ? (formData.get("password") as string)
        : undefined,
      passwordConfirmation: formData.get("passwordConfirmation")
        ? (formData.get("passwordConfirmation") as string)
        : undefined,
    });

  // validasi error
  if (!validation.success) {
    let errorFormatted = validation.error.format();

    return {
      error: {
        general: errorFormatted.id?._errors[0],
        username: errorFormatted.username?._errors[0],
        name: errorFormatted.name?._errors[0],
        roleId: errorFormatted.roleId?._errors[0],
        password: errorFormatted.password?._errors[0],
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  try {
    // update user
    await db.transaction(async (tx) => {
      await tx
        .update(userProfiles)
        .set({
          name: validation.data.name,
          userRoleId: validation.data.roleId,
        })
        .where(eq(userProfiles.id, validation.data.id));

      const { data: updateUserData, error: updateUserError } =
        await supabaseAdmin.auth.admin.updateUserById(validation.data.id, {
          email: validation.data.username + "@email.com",
          password: validation.data.password,
        });

      if (updateUserError) {
        throw new Error(updateUserError.message);
      }
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  const searchParamString = new URLSearchParams({
    notificationType: "success",
    notificationMessage: `Berhasil edit user`,
  }).toString();

  permanentRedirect(`/dashboard/user?${searchParamString}`);
}

/**
 * Deltete User
 */
export async function deleteUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validation = await z
    .object({
      userId: z
        .string()
        .min(1)
        .refine(
          async (val) => {
            return db
              .select()
              .from(userProfiles)
              .where(eq(userProfiles.id, val))
              .then((res) => res.length > 0);
          },
          {
            message: "User tidak ditemukan",
          }
        ),
    })
    .safeParseAsync({
      userId: formData.get("userId")
        ? (formData.get("userId") as string)
        : undefined,
    });

  // validasi error
  if (!validation.success) {
    let errorFormatted = validation.error.format();

    return {
      error: {
        general: errorFormatted.userId?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  const { data: deleteUserData, error: deleteUserError } =
    await supabaseAdmin.auth.admin.updateUserById(validation.data.userId, {
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

/**
 * Activate User
 */
export async function activateUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validation = await z
    .object({
      userId: z.string().refine(
        async (val) => {
          return db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.id, val))
            .then((res) => res.length > 0);
        },
        {
          message: "User tidak ditemukan",
        }
      ),
    })
    .safeParseAsync({
      userId: formData.get("userId")
        ? (formData.get("userId") as string)
        : undefined,
    });

  // validasi error
  if (!validation.success) {
    let errorFormatted = validation.error.format();

    return {
      error: {
        general: errorFormatted.userId?._errors[0],
      },
    };
  }

  const supabaseAdmin = createAdminClient();

  const { data: activateUserData, error: activateUserError } =
    await supabaseAdmin.auth.admin.updateUserById(validation.data.userId, {
      app_metadata: {
        deleted_at: null,
      },
    });

  if (activateUserError) {
    return {
      error: {
        general: activateUserError.message,
      },
    };
  }

  // if success
  revalidatePath("/dashboard/user");

  return {
    message: "User berhasil diaktifkan",
  };
}
