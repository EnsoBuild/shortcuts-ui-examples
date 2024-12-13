import { Providers } from "./providers";

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%" }}>
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}
