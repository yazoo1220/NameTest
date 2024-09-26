"use client";

import { ToastProvider } from "@/components/ui/toast";
import { KomaWariConverterComponent } from "@/components/koma-wari-converter";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default function Page() {
  return (
    <ToastProvider>
      <KomaWariConverterComponent />
    </ToastProvider>
  );
}
