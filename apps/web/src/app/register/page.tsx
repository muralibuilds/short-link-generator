import { Suspense } from "react";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
