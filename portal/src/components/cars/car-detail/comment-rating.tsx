'use client';

import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
export default function CommentRating({ comment }: { comment: string }) {
    const [isShowMore, setIsShowMore] = useState(false);
    return (
        <>
            <div className="text-muted-foreground text-sm font-[400px] text-neutral-600">
                {comment.length > 150 && !isShowMore
                    ? `${comment.slice(0, 150)}...`
                    : comment}
            </div>
            {comment.length > 150 && (
                <Badge
                    className="cursor-pointer font-normal"
                    variant="third"
                    onClick={() => setIsShowMore(!isShowMore)}
                >
                    {isShowMore ? 'Show less' : 'Show more'}
                </Badge>
            )}
        </>
    );
}
