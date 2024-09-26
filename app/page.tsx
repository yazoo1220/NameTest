"use client";  // This ensures the component is rendered on the client side

import { ToastProvider } from "@/components/ui/toast"; // Ensure the correct import path
import { KomaWariConverterComponent } from "@/components/koma-wari-converter";

export default function Page() {
  return (
    <ToastProvider>
      <KomaWariConverterComponent />
    </ToastProvider>
  );
}
