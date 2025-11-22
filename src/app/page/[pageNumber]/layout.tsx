export async function generateStaticParams() {
  // Generate params for all 604 Quran pages
  const pages = Array.from({ length: 604 }, (_, i) => ({
    pageNumber: String(i + 1).padStart(3, "0"),
  }));

  return pages;
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
