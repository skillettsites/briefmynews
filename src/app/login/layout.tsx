import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In to BriefMyNews",
  description:
    "Log in to your BriefMyNews account to manage your personalised news digest, topics, and sources.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
