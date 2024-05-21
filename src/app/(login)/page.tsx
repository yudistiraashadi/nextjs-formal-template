import { Paper, Image } from "@mantine/core";

import { LoginForm } from "@/app/(login)/_forms";

export default function Login() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-2">
      <h2 className="text-center text-3xl font-semibold">Login</h2>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
      </Paper>
    </main>
  );
}
