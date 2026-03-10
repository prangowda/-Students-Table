/**
 * app/layout.tsx
 * Minimal Next.js root layout required for App Router.
 */

export const metadata = {
  title: 'Students Table Manager API',
  description: 'REST API backend for Students Table Manager',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
