import { UserAuthSignInForm } from '@/components/auth/user-auth-signin-form';

export default function LoginPage() {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Sign in using your account
                </h1>
                {/*<p className="text-sm text-muted-foreground">*/}
                {/*  Enter your email and password below to access your account*/}
                {/*</p>*/}
            </div>
            <UserAuthSignInForm />
        </>
    );
}
