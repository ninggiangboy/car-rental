'use client';

import { Button } from '@/components/ui/button';
import { CheckCircledIcon, Share1Icon } from '@radix-ui/react-icons';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';

const ButtonShare = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    className="flex gap-2"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    <Share1Icon />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogDescription>
                        <div className="flex flex-col gap-2 justify-center">
                            <div className="flex justify-center">
                                <CheckCircledIcon className="w-10 h-10 text-green-400" />
                            </div>
                            <div className="flex justify-center text-sm font-medium text-neutral-600">
                                Link copied
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ButtonShare;
