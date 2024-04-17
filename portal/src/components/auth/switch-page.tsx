'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

export default function SwitchPage() {
    const pathName = usePathname();
    return (
        <Link
            href={pathName.startsWith('/login') ? '/signup' : '/login'}
            className={cn(
                buttonVariants({ variant: 'ghost' }),
                'absolute right-4 top-4 md:right-8 md:top-8'
            )}
        >
            {pathName.startsWith('/login') ? 'Sign Up' : 'Login'}
        </Link>
    );
}
