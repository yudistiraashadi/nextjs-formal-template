"use client";

import { TextInput, PasswordInput, Alert } from "@mantine/core";
import { useFormState } from "react-dom";
import { IconInfoCircle } from "@tabler/icons-react";

import { login } from "./_actions";
import { SubmitButton } from "@/components/button";

export function LoginForm() {
  const [loginState, loginAction] = useFormState(login, undefined);

  return (
    <form action={loginAction}>
      {loginState?.error?.general && (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {loginState.error.general}
        </Alert>
      )}

      <TextInput
        label="Username"
        required
        name="username"
        error={loginState?.error.username}
      />

      <PasswordInput
        label="Password"
        required
        mt={"1rem"}
        name="password"
        error={loginState?.error.password}
      />

      <SubmitButton text="Login" fullWidth mt="xl" />
    </form>
  );
}
