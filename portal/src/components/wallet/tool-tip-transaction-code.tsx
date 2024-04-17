'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export default function ToolTipTransactionCode({
    transactionCode,
}: {
    transactionCode: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger>
                {transactionCode.substring(0, 10) + '...'}
            </TooltipTrigger>
            <TooltipContent>
                <p>{transactionCode}</p>
            </TooltipContent>
        </Tooltip>
    );
}
