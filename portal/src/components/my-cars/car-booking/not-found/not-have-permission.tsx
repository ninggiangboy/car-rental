'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotHavePermission = () => {
    return (
        <div className="w-full h-[500px] flex flex-col justify-center">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <div className="text-center text-xl">
                        You have not permission to access this page
                    </div>
                    <div className="text-center text-lg text-neutral-600">
                        Please login with the correct account
                    </div>
                </div>
                <div className="flex justify-center gap-3">
                    <Link href="">
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">Login</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotHavePermission;
