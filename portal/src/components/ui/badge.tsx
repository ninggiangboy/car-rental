import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
                outline: 'text-foreground',
                third: 'border-transparent bg-gray-200 text-secondary-foreground hover:bg-gray-200/80',
                confirm:
                    'border-transparent bg-blue-600 text-secondary-foreground shadow hover:bg-blue-600/80 text-white',
                inprogress:
                    'border-transparent bg-orange-600 text-secondary-foreground shadow hover:bg-orange-600/80 text-white',
                pending:
                    'border-transparent bg-teal-500 text-secondary-foreground shadow hover:bg-teal-500/80 text-white',
                cancel: 'border-transparent bg-slate-600 text-secondary-foreground shadow hover:bg-slate-600/80 text-white',
                complete:
                    'border-transparent bg-green-600 text-secondary-foreground shadow hover:bg-green-600/80 text-white',
                reject: 'border-transparent bg-rose-600 text-secondary-foreground shadow hover:bg-rose-600/80 text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
