"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { safeNextPath } from "@/lib/safe-redirect.mjs";
import { Loader2, AlertTriangle } from "lucide-react";

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808]">
      <div className="flex items-center gap-3 text-parchment/45">
        <Loader2 className="size-5 animate-spin" />
        <p className="text-sm font-semibold">Memproses login...</p>
      </div>
    </main>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase client tidak tersedia.");
      return;
    }

    const client = supabase;

    async function handleCallback() {
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      if (window.location.hash.startsWith("#error=")) {
        const params = new URLSearchParams(window.location.hash.slice(1));
        setError(
          params.get("error_description")?.replaceAll("+", " ") ??
            params.get("error")?.replaceAll("+", " ") ??
            "Login gagal. Coba lagi."
        );
        return;
      }

      const next = safeNextPath(searchParams.get("next"));
      setTimeout(() => router.replace(next), 500);
    }

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="w-full max-w-sm rounded-xl border border-red/18 bg-[#141414] p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 size-10 text-rose" />
          <h1 className="mb-2 text-lg font-black text-white">Login Gagal</h1>
          <p className="mb-6 text-sm leading-relaxed text-parchment/55">{error}</p>
          <Link
            href="/auth"
            className="inline-flex rounded-md bg-gold px-6 py-3 text-sm font-bold text-charcoal no-underline transition hover:bg-gold-light"
          >
            Coba Lagi
          </Link>
        </div>
      </main>
    );
  }

  return <LoadingState />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackInner />
    </Suspense>
  );
}
