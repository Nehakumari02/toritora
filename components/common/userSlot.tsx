import { parseISO, format } from "date-fns";
import { useTranslations } from "next-intl";

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
  loading?: boolean;
  handleEditSlot: (slot: SlotProps) => void;
  handleDeleteSlot: (slot: SlotProps) => void;
}

function UserSlot({ slot, index, handleEditSlot, handleDeleteSlot }: Props) {
  const t = useTranslations("Calendar");
  let startDateTime = parseISO(slot.startTime);
  let endDateTime = parseISO(slot.endTime);

  let textColor, bgColor, border, timeColor;
  textColor = "text-[#2EC4B6]";
  // bgColor = "bg-gray-100";
  bgColor = "bg-[#2EC4B60F]";
  border = "border-[#2EC4B6]";
  timeColor = "text-[#2EC4B6]";

  return (
    <li key={index}>
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
            {t("ichiSession")}
          </h3>
          <p className="mt-1 text-sm text-black dark:text-neutral-400">
            {format(startDateTime, "HH:mm")} - {format(endDateTime, "HH:mm")}
          </p>
          {slot.status === "booked" ?
            <span className="flex  gap-2 flex-wrap">
            <button
              onClick={() => handleEditSlot(slot)}
              disabled={slot.status === "booked"}
              className={`mt-2 text-sm px-3 py-1 rounded ${slot.status === "booked" ? "bg-gray-400" : "bg-secondary"} text-white`}
            >
              {slot.status === "booked" ? "Booked" : "Edit Slot"}
            </button>
            </span>
            :
            <span className="flex  gap-2 flex-wrap">
            <button
              onClick={() => handleEditSlot(slot)}
              disabled={slot.status === "booked"}
              className={`mt-2 text-sm px-3 py-1 rounded bg-secondary text-white`}
            >
              {t("edit_slot_list")}
            </button>
            <button
              onClick={() => handleDeleteSlot(slot)}
              disabled={slot.status === "booked"}
              className={`mt-2 text-sm px-3 py-1 rounded bg-red-500 text-white`}
            >
              {t("delete_slot")}
            </button>
            </span>
          }
        </div>
      </div>
    </li>
  );
}

export default UserSlot;
