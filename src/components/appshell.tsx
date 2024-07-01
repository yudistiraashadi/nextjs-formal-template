"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  UnstyledButton,
  Box,
  Button,
  Menu,
  Text,
} from "@mantine/core";
import { IconHome, IconUserCircle, IconUsersGroup } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import { getUserData } from "@/app/_actions";

import Link from "next/link";

import { logout } from "@/app/_actions";

/**
 * Dashboard App Shell
 */
export function DashboardAppShell({
  children,
  userData,
}: React.PropsWithChildren<{
  userData: Awaited<ReturnType<typeof getUserData>>;
}>) {
  const [opened, { toggle }] = useDisclosure();

  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "lg", collapsed: { mobile: !opened } }}
      padding="xs"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <div className="flex w-full items-center justify-between">
            {/* burger menu and brand logo */}
            <div className="flex items-center space-x-2">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="lg"
                size="sm"
              />

              <UnstyledButton hiddenFrom="lg" onClick={toggle}>
                Acme Inc.
              </UnstyledButton>

              <Box visibleFrom="lg">Acme Inc.</Box>
            </div>

            {/* user avatar */}
            <div className="flex items-center space-x-1">
              <Menu width={150} shadow="md">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="dark"
                    leftSection={<IconUserCircle stroke={1.5} />}
                    px={"0.25rem"}
                  >
                    <Text fw={500} size="md" lh={1}>
                      {userData.name}
                    </Text>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <form action={logout}>
                    <Menu.Item type="submit" color="red">
                      Logout
                    </Menu.Item>
                  </form>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </Group>
      </AppShell.Header>

      {/* sidebar */}
      <AppShell.Navbar p="xs">
        <NavLink
          label="Dashboard"
          onClick={toggle}
          component={Link}
          href="/dashboard"
          active={pathname === "/dashboard"}
          leftSection={<IconHome size="1.25rem" stroke={1.5} />}
        />

        {/* ONLY FOR ADMIN */}
        {userData.userRoleId === 2 && (
          <NavLink
            label="User"
            onClick={toggle}
            component={Link}
            href="/dashboard/user"
            active={pathname.startsWith("/dashboard/user")}
            leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
          />
        )}
        {/* END OF ONLY FOR ADMIN */}
      </AppShell.Navbar>
      <AppShell.Main bg={"gray.1"}>{children}</AppShell.Main>
    </AppShell>
  );
}
