'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CarNotFound = () => {
    return (
        <div className="w-full h-[500px] flex flex-col justify-center">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <div className="text-center text-xl font-bold">
                        The car you are looking for is not found or have been
                        remove
                    </div>
                    <div className="text-center text text-neutral-600">
                        Please check the url or contact the owner for more
                    </div>
                </div>
                <div className="flex justify-center gap-3">
                    <Link href="">
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline">Return Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarNotFound;
