import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getUser } from '@/lib/actions';
import { ROLE } from '@/lib/defines';

export async function UserNav() {
    const user = await getUser();
    if (!user) {
        return (
            <Button asChild>
                <Link href={'/login'}>Sign in</Link>
            </Button>
        );
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.picture} alt="picture" />
                            <AvatarFallback>{'A'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user.fullName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href={'/profile'}>Profile</Link>
                        </DropdownMenuItem>
                        {user.role === 'CUSTOMER' && (
                            <DropdownMenuItem asChild>
                                <Link href={'/booking'}>My Bookings</Link>
                            </DropdownMenuItem>
                        )}
                        {user.role === 'CAROWNER' && (
                            <DropdownMenuItem asChild>
                                <Link href={'/my-cars'}>My Cars</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link href={'/wallet'}>Wallet</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={'/logout'}>Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
