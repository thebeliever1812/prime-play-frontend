import { Container } from "@/components";

export default function EditProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Container className="w-full max-w-5xl">
            {children}
        </Container>
    );
}
