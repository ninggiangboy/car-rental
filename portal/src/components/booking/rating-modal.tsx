'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FaceIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { SonnerRating } from './sonnerRating';
import { toast } from 'sonner';

export default function RatingModal({ rentalId }: { rentalId: number }) {
    const [rate, setRate] = useState({ rating: 0, comment: '' });

    const [isValidate, setIsValidate] = useState(false);
    const [message, setMessage] = useState('' as string | null);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FaceIcon className="mr-2" />
                    Rate booking
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[465px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Rate your booking
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="">
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) =>
                                i < rate.rating ? (
                                    <StarFilledIcon
                                        key={i}
                                        className="w-8 h-8 text-yellow-300 hover:scale-125"
                                        onClick={() => {
                                            if (rate.comment.length <= 1000) {
                                                setIsValidate(true);
                                            }
                                            setRate({ ...rate, rating: i + 1 });
                                        }}
                                    />
                                ) : (
                                    <StarIcon
                                        key={i}
                                        className="w-8 h-8 text-yellow-200 hover:scale-125"
                                        onClick={() => {
                                            if (rate.comment.length <= 1000) {
                                                setIsValidate(true);
                                            }
                                            setRate({ ...rate, rating: i + 1 });
                                        }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Textarea
                            id="comment"
                            placeholder="Type your comment here."
                            className="col-span-4 h-32 resize-none"
                            value={rate.comment}
                            onChange={event => {
                                const comment = event.target.value;
                                if (comment.length > 1000) {
                                    setMessage(
                                        'Your comment is too long. Comment length must less than 1000 characters.'
                                    );
                                    setIsValidate(false);
                                } else if (rate.rating !== 0) {
                                    setMessage(null);
                                    setIsValidate(true);
                                }
                                setRate({
                                    ...rate,
                                    comment: comment,
                                });
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {isValidate ? (
                        <DialogClose>
                            <SonnerRating
                                confirmMessage="Submit"
                                messageSuccess="Rated successful"
                                messageError="Failed to rate the booking. Please try again later."
                                rating={rate.rating}
                                comment={rate.comment}
                                message="Rating"
                                rentalId={rentalId}
                            />
                        </DialogClose>
                    ) : (
                        <Button
                            variant="default"
                            onClick={() => {
                                toast.error('Rating', {
                                    description:
                                        message ||
                                        'You have to rate the booking to submit.',
                                });
                            }}
                        >
                            Submit
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
