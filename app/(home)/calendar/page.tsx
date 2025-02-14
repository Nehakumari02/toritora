'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog } from '@headlessui/react';

export default function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSave = () => {
    if (selectedDate && startTime && endTime) {
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-2 bg-white">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border rounded-[41px] h-[926px]" >
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Time</h2>

        {/* Date Picker - Always Visible */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy/MM/dd (EEE)"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-center"
            inline
          />
        </div>

        {/* Start Time Picker */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={(time: Date | null) => setStartTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            className=" text-white w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-center bg-[#2EC4B6]"
            placeholderText="Select start time"
          />
        </div>

        {/* End Time Picker */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 mt-6">End Time</label>
          <DatePicker
            selected={endTime}
            onChange={(time: Date | null) => setEndTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 text-center text-[#FFFFFF] bg-[#2EC4B6]"
            placeholderText="Select end time"
          />
        </div>

        {/* Save Button */}
        <button
          className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition mt-6"
          onClick={handleSave}
        >
          Add to your calendar
        </button>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold">Saved Successfully</h2>
          <p className="text-gray-600 mt-2">Your time slot was saved successfully</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition"
            onClick={() => setIsSuccessModalOpen(false)}
          >
            OK
          </button>
        </div>
      </Dialog>
    </div>
  );
}

