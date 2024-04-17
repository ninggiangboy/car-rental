import PaymentCard from '@/components/payment/payment-card';
import {
    fetchCarDetails,
    fetchRentalInfo,
    fetchUserBalance,
    getUserRole,
} from '@/lib/actions';
import { ROLE } from '@/lib/defines';

export default async function PaymentPage({
    params,
}: {
    params: { id: number };
}) {
    const userRole = await getUserRole();
    const rentalInfo = await fetchRentalInfo(params.id);
    const balance = await fetchUserBalance();
    const car = await fetchCarDetails(rentalInfo?.carId || 0);
    if (!rentalInfo || !car) {
        return <div>Not found</div>;
    }
    const dontNeedPay = () => (
        <div className="w-full h-[70vh]">
            <div className="flex justify-center items-center h-full">
                <div className="text-2xl font-bold">No payment required</div>
            </div>
        </div>
    );
    let amount = undefined;
    let typePayment = undefined;
    if (rentalInfo?.status == 'PENDING_DEPOSIT') {
        amount = rentalInfo?.deposit;
        typePayment = 'DEPOSIT';
    }
    if (rentalInfo?.status == 'PENDING_PAYMENT') {
        amount = rentalInfo?.totalPrice - rentalInfo?.deposit;
        typePayment = 'PAYRENT';
    }
    if (!amount || amount == 0) {
        return dontNeedPay();
    }
    if (typePayment == 'PAYRENT' && userRole == ROLE.CAROWNER && amount > 0) {
        return dontNeedPay();
    }
    if (typePayment == 'PAYRENT' && userRole == ROLE.CUSTOMER && amount < 0) {
        return dontNeedPay();
    }
    amount = Math.abs(amount);
    return (
        <div className="flex justify-center w-full my-32">
            <PaymentCard
                typePayment={typePayment}
                amount={amount}
                balance={balance}
                car={car}
                rental={rentalInfo}
            />
        </div>
    );
}
