"use client";

import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconExclamationMark } from "@tabler/icons-react";

/**
 * Notification helper
 *
 * @returns
 */
export function notificationHelper({
  type = "info",
  message,
  title,
  callback,
}: {
  type: "success" | "error" | "info" | "warning";
  message: string;
  title?: string | null | undefined;
  callback?: () => void;
}) {
  let icon = null;
  let color = "";

  switch (type) {
    case "success":
      icon = <IconCheck />;
      color = "green";
      title = title ?? "Success";
      break;

    case "error":
      icon = <IconX />;
      color = "red";
      title = title ?? "Error";
      break;

    case "warning":
      icon = <IconExclamationMark />;
      color = "yellow";
      title = title ?? "Warning";
      break;

    case "info":
    default:
      color = "blue";
      title = title ?? "Info";
      break;
  }

  notifications.show({
    title,
    message,
    color,
    icon,
  });

  if (callback) {
    callback();
  }
}
