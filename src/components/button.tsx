"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import Link from "next/link";

/**
 * Submit button
 *
 * @param {string} text
 * @returns
 */
export function SubmitButton({
  text = "Submit",
  variant = "filled",
  ...buttonProps
}: ButtonProps & { text?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} loading={pending} {...buttonProps}>
      {text}
    </Button>
  );
}

/**
 * Back Button
 *
 * @returns
 */
export function BackButton({
  text = "Back",
  variant = "light",
  confirmation = false,
  href,
  ...buttonProps
}: ButtonProps & { text?: string; href: string; confirmation?: boolean }) {
  return (
    <Button
      component={Link}
      href={href}
      variant="subtle"
      leftSection={<IconArrowLeft size={14} />}
      p={0}
      onClick={(e) => {
        if (confirmation) {
          if (!confirm("Are you sure you want to leave this page?")) {
            e.preventDefault();
          }
        }
      }}
      {...buttonProps}
    >
      {text}
    </Button>
  );
}
