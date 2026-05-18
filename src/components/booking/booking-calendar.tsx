"use client";

import React, { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  availabilityMap: Record<string, string[]>;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onSelectDate,
  availabilityMap,
  currentMonth,
  onMonthChange,
}) => {
  const today = startOfDay(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          disabled={isBefore(startOfMonth(currentMonth), startOfMonth(today))}
        >
          <ChevronLeft className={`w-5 h-5 ${isBefore(startOfMonth(currentMonth), startOfMonth(today)) ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <h2 className="text-lg font-semibold font-outfit text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(startOfMonth(currentMonth));
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm text-gray-500 font-inter py-2">
          {format(addDays(startDate, i), "EEEEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dateStr = format(day, "yyyy-MM-dd");
        
        // Determine availability
        const isPast = isBefore(day, today);
        const availableSlots = availabilityMap[dateStr];
        // If it's not in the map, it means 0 bookings, so fully available (unless past)
        const isFullyBooked = availableSlots && availableSlots.length === 0;
        const isAvailable = !isPast && !isFullyBooked;
        
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className="flex justify-center relative py-1"
          >
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectDate(cloneDay)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-inter transition-all relative
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                ${isFullyBooked && !isPast ? "text-red-300 cursor-not-allowed bg-red-50" : ""}
                ${isAvailable && !isSelected && isCurrentMonth ? "text-gray-700 hover:bg-gray-100 hover:text-black" : ""}
                ${isSelected ? "bg-black text-white shadow-md shadow-gray-300" : ""}
              `}
            >
              {formattedDate}
              
              {/* Indicators */}
              {isAvailable && isCurrentMonth && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-green-500"}`}></span>
              )}
              {isFullyBooked && !isPast && isCurrentMonth && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400"></span>
              )}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full max-w-sm mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-500 font-inter">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span className="text-xs text-gray-500 font-inter">Fully Booked</span>
        </div>
      </div>
    </div>
  );
};
