export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col h-screen dark:bg-background bg-neutral-100">{children}</div>;
}

