import { parseISO, format } from "date-fns";
import Link from "next/link";

interface SlotProps {
  _id: string;
  user_id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  slot: SlotProps;
  index: number;
  handleSlotBooking: (slot: SlotProps) => void;
  user: any;
}

function BookingSlot({ slot, index, handleSlotBooking, user }: Props) {
  let startDateTime = parseISO(slot.startTime);
  let endDateTime = parseISO(slot.endTime);

  let textColor, bgColor, border, timeColor;
  if ( slot.status === "available" ) {
    textColor = "text-[#2EC4B6]";
    bgColor = "bg-gray-100";
    // bgColor = "bg-[#2EC4B60F]";
    border = "border-[#2EC4B6]";
    timeColor = "text-[#2EC4B6]";
  } else {
    textColor = "text-[#FF0000]";
    bgColor = "bg-gray-100";
    // bgColor = "bg-[#FF00000F]";
    border = "border-[#FF0000]";
    timeColor = "text-gray-500";
  }

  return (
    <li>
      <div className="flex gap-x-3">
        <div className="w-16 text-end">
          <span className={`text-xs ${timeColor} dark:text-neutral-400`}>
            {format(startDateTime, "h:mm a")}
          </span>
        </div>

        <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
          <div className="relative size-7 flex justify-center items-center">
            <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
          </div>
        </div>

        <div className={`grow pt-0.5 pb-4 mb-8 px-2 rounded-md border-l-8 ${border} ${textColor} ${bgColor}`}>
          <h3 className="flex gap-x-1.5 font-semibold dark:text-white">
            {slot.status === "available" ? "Available Slot" : slot.status === "booked" ? "Booked" : "Pending"}
          </h3>
          <p className="mt-1 text-sm text-black dark:text-neutral-400">
            {format(startDateTime, "h:mm a")} - {format(endDateTime, "h:mm a")}
          </p>
          {/* <button
            onClick={() => handleSlotBooking(slot)}
            className={`mt-2 text-sm px-3 py-1 rounded ${
              slot.status === "available"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={slot.status !== "available"}
          >
            {slot.status === "available" ? "Book Slot" : "Unavailable"}
          </button> */}
          <Link
            href={{
              pathname:"/userDetails/book-slot",
              query: {
                user: JSON.stringify(user),
                slot: JSON.stringify(slot)
              },
            }}
            tabIndex={slot.status === "available" ? -1 : undefined}
            className={`${slot.status === "available" ? 'pointer-events-none' : ''}mt-2 text-sm px-3 py-1 rounded ${
              slot.status === "available"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            aria-disabled={slot.status !== "available"}
          >
            {slot.status === "available" ? "Book Slot" : "Unavailable"}
          </Link>
        </div>
      </div>
    </li>
  );
}

export default BookingSlot;
