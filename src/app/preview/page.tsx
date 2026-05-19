import { redirect } from "next/navigation";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Barber Brothers",
};

export default function PreviewPage() {
  redirect("/");
}
