import { CheckCircle } from "lucide-react";

export function VerificationBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
      <CheckCircle size={14} />
      Verified
    </span>
  );
}
