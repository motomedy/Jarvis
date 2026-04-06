import React, { useState } from 'react';

export interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onPrev, onNext }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <button onClick={onPrev}>&lt;</button>
      <h2 style={{ margin: 0 }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
      <button onClick={onNext}>&gt;</button>
    </div>
  );
};

export function getMonthMatrix(month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  let day = new Date(firstDay);
  // Fill first week
  for (let i = 0; i < day.getDay(); i++) week.push(null);
  while (day <= lastDay) {
    week.push(new Date(day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
    day.setDate(day.getDate() + 1);
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
