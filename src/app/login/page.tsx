import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="flex w-full h-full min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gray-900">
            <div className="w-full max-w-sm md:max-w-3xl bg-gray-900 border-0">
                <LoginForm />
            </div>
        </div>
    );
}
