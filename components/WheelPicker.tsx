type WheelPickerProps = {
    setDate: (date: Date) => void;
    time: Date;
    isEndTime?: boolean;
    onClose?: () => void; // <-- add this
};

export default function WheelPicker({ setDate, time, isEndTime = false, onClose }: WheelPickerProps) {
    const times = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, '0')}:${minute}`;
    });

    return (
        <div className="relative h-[200px] overflow-y-scroll no-scrollbar snap-y snap-mandatory bg-white rounded-md border border-gray-300 text-center text-[16px] leading-[40px]">
            <div className="py-5">
                {times.map((t, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            const [h, m] = t.split(":").map(Number);
                            const newTime = new Date(time);
                            newTime.setHours(h);
                            newTime.setMinutes(m);
                            setDate(newTime);
                            if (onClose) onClose(); // <-- hide after selection
                        }}
                        className="snap-start cursor-pointer hover:bg-gray-200 transition-all"
                    >
                        {t}
                    </div>
                ))}
            </div>
        </div>
    );
}
