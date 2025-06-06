import React, { useState, useEffect, useRef } from "react";

interface WheelPickerProps {
  setDate: (date: Date) => void;
  isEndTime?: boolean;
  time?: Date;
}

const WheelPicker: React.FC<WheelPickerProps> = ({ setDate, isEndTime = false, time }) => {
  const initialDate = time ? new Date(time) : new Date();
  if (!time && isEndTime) {
    initialDate.setHours(initialDate.getHours() + 1);
  }

  const [selectedHour, setSelectedHour] = useState(initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes());

  const hourRef = useRef<HTMLDivElement>(null!);
  const minuteRef = useRef<HTMLDivElement>(null!);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Update date state whenever hour or minute changes
  useEffect(() => {
    const updatedTime = new Date();
    updatedTime.setHours(selectedHour, selectedMinute, 0, 0);
    setDate(updatedTime);
  }, [selectedHour, selectedMinute, setDate]);

  // Function to handle scroll event and set the closest value
  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setFunc: React.Dispatch<React.SetStateAction<number>>, options: number[]) => {
    if (ref.current) {
      const scrollTop = ref.current.scrollTop;
      const itemHeight = ref.current.scrollHeight / options.length;
      const selectedIdx = Math.round(scrollTop / itemHeight);
      setFunc(options[selectedIdx]);
    }
  };

  useEffect(() => {
    const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number, options: number[]) => {
      if (ref.current) {
        const itemHeight = ref.current.scrollHeight / options.length;
        ref.current.scrollTop = value * itemHeight;
      }
    };

    scrollToValue(hourRef, selectedHour, hours);
    scrollToValue(minuteRef, selectedMinute, minutes);
  }, [selectedHour, selectedMinute, hours, minutes]);

  return (
    <div className="flex justify-center items-center space-x-4 p-4">
      {/* Hours Picker */}
      <div className="relative w-20 h-12 overflow-hidden">
        <div
          ref={hourRef}
          className="flex flex-col items-center overflow-y-scroll snap-y snap-mandatory h-full scrollbar-hide no-scrollbar"
          onScroll={() => handleScroll(hourRef, setSelectedHour, hours)}
        >
          {hours.map((hour) => (
            <div
              key={hour}
              className={`snap-center py-2 text-lg cursor-pointer ${hour === selectedHour ? "text-blue-500 font-bold" : "text-gray-500"
                }`}
            >
              {hour.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>

      <span className="text-xl font-bold">:</span>

      {/* Minutes Picker */}
      <div className="relative w-20 h-12 overflow-hidden">
        <div
          ref={minuteRef}
          className="flex flex-col items-center overflow-y-scroll snap-y snap-mandatory h-full scrollbar-hide no-scrollbar"
          onScroll={() => handleScroll(minuteRef, setSelectedMinute, minutes)}
        >
          {minutes.map((minute) => (
            <div
              key={minute}
              className={`snap-center py-2 text-lg cursor-pointer ${minute === selectedMinute ? "text-blue-500 font-bold" : "text-gray-500"
                }`}
            >
              {minute.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WheelPicker;
