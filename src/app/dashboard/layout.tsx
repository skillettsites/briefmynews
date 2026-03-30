import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BriefMyNews",
  description:
    "Manage your personalised news digest. Add topics, choose sources, set your delivery schedule, and view past digests.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
