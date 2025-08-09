"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const NotesCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm mx-auto w-full max-w-xs"
      captionLayout="dropdown"
    />
  );
};

export default NotesCalendar;
