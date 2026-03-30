import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for BriefMyNews",
  description:
    "Create your free BriefMyNews account and start receiving personalised news digests tailored to your interests.",
  alternates: { canonical: "/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
