import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ListPagination from "../cars/list-pagination";
import { getFormatPoint } from "@/lib/utils";
import { getDateFormatted } from "@/lib/utils";
import { TooltipProvider } from "../ui/tooltip";
import { fetchTransactionsHistory, wait } from "@/lib/actions";
import ToolTipTransactionCode from "./tool-tip-transaction-code";
import { QrCodeModal } from "./qr-code-modal";
import Link from "next/link";
const TransactionTable = async ({
  page,
  perPage,
  start,
  end,
}: {
  page: number;
  perPage: number;
  start: string;
  end: string;
}) => {
  const { transactions, pageMeta } = await fetchTransactionsHistory(
    page,
    perPage,
    start,
    end
  );

  const getAmount = (amount: number, type: string, method: string) => {
    if (
      type === "TOP_UP" ||
      type === "RECEIVE_DEPOSIT" ||
      type === "RECEIVE_RENT" ||
      type === "RECEIVE_REFUND"
    ) {
      return (
        <div className="text-green-600 font-semibold">
          {method === "CASH" && `$${getFormatPoint(amount)}`}
          {method === "WALLET" && `${getFormatPoint(amount)} Point`}
        </div>
      );
    } else {
      return (
        <div className="text-red-600 font-semibold">
          {method === "CASH" && `$${getFormatPoint(amount)}`}
          {method === "WALLET" && `${getFormatPoint(amount)} Point`}
        </div>
      );
    }
  };

  return (
    <>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="">Code</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Booking No.</TableHead>
            <TableHead>Payment method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead className="text-right">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transactionCode.toUpperCase()}>
              <TableCell className="font-medium">
                <TooltipProvider>
                  <ToolTipTransactionCode
                    transactionCode={transaction.transactionCode.toUpperCase()}
                  />
                </TooltipProvider>
              </TableCell>
              <TableCell>
                {getAmount(
                  transaction.amount,
                  transaction.transactionType,
                  transaction.paymentMethod
                )}
              </TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell className="pl-10">
                {transaction.bookingNo ? (
                  <Link
                    href={`/reservation/${transaction.bookingNo}`}
                    className="hover:underline"
                  >
                    {transaction.bookingNo}
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{transaction.paymentMethod}</TableCell>
              <TableCell>
                {transaction.transactionStatus === "PENDING" &&
                transaction.transactionType === "TOP_UP" ? (
                  <QrCodeModal
                    code={transaction.transactionCode}
                    amount={transaction.amount + ""}
                  />
                ) : (
                  transaction.transactionStatus
                )}
              </TableCell>
              <TableCell>{getDateFormatted(transaction.createdAt)}</TableCell>
              <TableCell className="text-right">
                {transaction.transactionDesc}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5">
        <ListPagination meta={pageMeta} scroll={false} />
      </div>
    </>
  );
};

export default TransactionTable;
