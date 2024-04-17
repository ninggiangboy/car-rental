'use client';

import * as React from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { SonnerChangeStatus } from './sonner-change-status';
import { Checkbox } from '../ui/checkbox';

export function SelectStatus({
    status,
    carId,
}: {
    status: string;
    carId: number;
}) {
    const [newStatus, setNewStatus] = React.useState(status);
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    return (
        <div className="flex gap-3">
            <Select defaultValue={status} onValueChange={v => setNewStatus(v)}>
                <SelectTrigger
                    className={cn(
                        'w-[180px] text-xl font-semibold',
                        newStatus == 'AVAILABLE'
                            ? 'text-green-600'
                            : 'text-red-600'
                    )}
                >
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className={cn('text-xl')}>
                    <SelectGroup>
                        <SelectLabel>Car Status</SelectLabel>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {newStatus != status && <Button>Change</Button>}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        {newStatus !== 'AVAILABLE' ? (
                            <>
                                <AlertDialogDescription>
                                    - This action will prevent your car from
                                    being searched by renters.
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    - All pending and ongoing booking will not
                                    be affected.
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    - You must manually cancel each booking if
                                    you want to stop leasing your car.
                                </AlertDialogDescription>
                            </>
                        ) : (
                            <>
                                <AlertDialogDescription>
                                    This action will allow your car to be
                                    searched by renters.
                                </AlertDialogDescription>
                            </>
                        )}
                        <div className="flex items-center space-x-2 mt-7">
                            <Checkbox
                                id="terms"
                                onCheckedChange={e =>
                                    setIsConfirmed(
                                        typeof e === 'boolean' ? e : false
                                    )
                                }
                            />
                            <label htmlFor="terms" className="text-sm">
                                I want to confirm this action
                            </label>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <SonnerChangeStatus
                            isConfirmed={isConfirmed}
                            carId={carId}
                            status={newStatus}
                        />
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
