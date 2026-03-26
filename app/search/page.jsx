import SearchPage from "@/components/SearchPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>   {/* needed because useSearchParams is used inside */}
      <SearchPage />
    </Suspense>
  );
}