export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <div className="container">
                <div className="bg-card border border-border p-4 max-w-[600px] mx-auto rounded-lg">
                    {children}
                </div>
            </div>
        </main>
    )
}