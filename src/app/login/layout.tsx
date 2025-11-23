import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Login - OhMyLife",
    description: "Sign in to access your OhMyLife agency management dashboard.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
