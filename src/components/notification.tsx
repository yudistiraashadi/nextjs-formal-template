"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { notificationHelper } from "@/utils/notification";

/**
 * Notification component for search params
 *
 * @returns
 */
export function SearchParamsNotification() {
  const searchParams = useSearchParams();

  const notificationType = searchParams.get("notificationType");
  const notificationMessage = searchParams.get("notificationMessage");
  const notificationTitle = searchParams.get("notificationTitle");

  useEffect(() => {
    if (notificationMessage) {
      notificationHelper({
        type: notificationType as any,
        message: notificationMessage,
        title: notificationTitle,
      });
    }
  }, [notificationMessage, notificationTitle, notificationType]);

  return <></>;
}
