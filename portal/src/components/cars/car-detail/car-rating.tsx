'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageMeta, Rating, SearchParams } from '@/lib/defines';
import { Icons } from '@/components/icons';
import CommentRating from './comment-rating';
import { Button } from '@/components/ui/button';
import { getDateFormatted } from '@/lib/utils';
import { fetchRatingByCarId } from '@/lib/actions';
import { useEffect, useState } from 'react';

export default function CarRating({
    carId,
    averageRating,
}: Readonly<{
    carId: number;
    averageRating: number;
}>) {
    const [page, setPage] = useState(1);

    const [listRatings, setListRatings] = useState<Rating[]>([]);
    const [pageMeta, setPageMeta] = useState<PageMeta>({} as PageMeta);

    useEffect(() => {
        fetchRatingByCarId(carId, 1, 3 * page).then(res => {
            setListRatings(res.ratings);
            setPageMeta(res.pageMeta);
        });
    }, [page, carId]);

    return (
        <>
            <div className="mb-3 mt-5">
                <span className="lg:text-lg sm:text-sm md:text-base font-bold text-neutral-600 flex gap-2">
                    <div id="avg" className="flex flex-col justify-center">
                        <Icons.Star className="h-[20px] w-[20px] text-yellow-300" />
                    </div>
                    {averageRating.toFixed(1)}
                    {pageMeta.totalElements &&
                        ` (${pageMeta.totalElements} ${pageMeta.totalElements > 1 ? 'ratings' : 'rating'})`}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {listRatings.map((rating, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all bg-white max-w-[800px]"
                    >
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        <Avatar className="h-[50px] w-[50px] border-[2px]">
                                            <AvatarImage
                                                src={rating.picture}
                                                alt="avatar"
                                            />
                                            <AvatarFallback>
                                                {rating.fullName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col justify-start gap-1">
                                            <span className="text-md font-medium">
                                                {rating.fullName}
                                            </span>
                                            <span className="flex text-neutral-600 gap-1 justify-start ">
                                                <span className="text-neutral-500 flex gap-0.5">
                                                    {Array.from({
                                                        length: rating.rating,
                                                    }).map((_, index) => (
                                                        <Icons.Star
                                                            key={index}
                                                            className="h-[17px] w-[17px] text-yellow-300"
                                                        />
                                                    ))}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto text-foreground text-sm text-neutral-600">
                                    {getDateFormatted(rating.createdAt)}
                                </div>
                            </div>
                        </div>
                        <CommentRating comment={rating.comment} />
                    </div>
                ))}
            </div>
            <div id="see-more" className="mt-5">
                {pageMeta?.hasNext && (
                    <Button
                        onClick={() => {
                            setPage(page + 1);
                        }}
                    >
                        See more
                    </Button>
                )}
            </div>
        </>
    );
}
