import { PreviewLock } from "@/components/preview/preview-lock";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Private Preview - Barber Brothers",
};

export default function PreviewPage() {
  return <PreviewLock />;
}
