"use client";

import { useEffect, useState } from "react";

/**
 * Hook لضمان تشغيل الكود فقط على Client side
 * يمنع مشاكل Hydration Mismatch
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook لتوليد قيم ثابتة فقط على Client side
 * بديل آمن لـ Math.random() في SSR
 */
export function useClientOnlyValue<T>(
  generator: () => T,
  fallback: T
): T {
  const isClient = useClientOnly();
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    if (isClient) {
      setValue(generator());
    }
  }, [isClient, generator]);

  return value;
}
