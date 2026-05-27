import type { Metadata } from "next";

import { StaffLoginPage } from "@/components/staff/staff-login-page";

export const metadata: Metadata = {
  title: "Staff login",
  manifest: "/staff-manifest.json",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function StaffLoginRoute() {
  return <StaffLoginPage />;
}
