import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
    CounterClockwiseClockIcon,
    FaceIcon,
    StarFilledIcon,
    StarIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { SonnerRating } from './sonnerRating';
import { toast } from 'sonner';
import { getDateFormatted } from '@/lib/utils';

export default function ViewRatingModal({
    rating,
    comment,
    createdAt,
}: Readonly<{ rating: number; comment: string; createdAt: string }>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FaceIcon className="mr-2" />
                    View my rating
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[465px]">
                <DialogHeader>
                    <DialogTitle className="text-center">My Rating</DialogTitle>
                    <DialogDescription className="text-center">
                        {getDateFormatted(createdAt)}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="">
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) =>
                                i < rating ? (
                                    <StarFilledIcon
                                        key={i}
                                        className="w-8 h-8 text-yellow-300 "
                                    />
                                ) : (
                                    <StarIcon
                                        key={i}
                                        className="w-8 h-8 text-yellow-200 "
                                    />
                                )
                            )}
                        </div>
                    </div>
                    {comment && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Textarea
                                id="comment"
                                className="col-span-4 h-32 resize-none"
                                value={comment}
                                readOnly
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
