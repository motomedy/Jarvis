import React, { useState } from 'react';
import { CalendarHeader, getMonthMatrix, WEEKDAYS } from './CalendarUtils';
import { Event } from './api';

interface MonthViewProps {
  events: Event[];
}

const MonthView: React.FC<MonthViewProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const matrix = getMonthMatrix(currentMonth.getMonth(), currentMonth.getFullYear());

  function prevMonth() {
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function eventsForDay(day: Date) {
    return events.filter(ev => {
      const evStart = new Date(ev.start);
      return (
        evStart.getFullYear() === day.getFullYear() &&
        evStart.getMonth() === day.getMonth() &&
        evStart.getDate() === day.getDate()
      );
    });
  }

  return (
    <div>
      <CalendarHeader currentMonth={currentMonth} onPrev={prevMonth} onNext={nextMonth} />
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr>
            {WEEKDAYS.map(d => (
              <th key={d} style={{ padding: 8, background: '#f0f0f0', fontWeight: 600 }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} style={{ minWidth: 80, height: 64, verticalAlign: 'top', border: '1px solid #eee', padding: 4 }}>
                  {day && (
                    <div>
                      <div style={{ fontWeight: 600 }}>{day.getDate()}</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {eventsForDay(day).map(ev => (
                          <li key={ev.id} style={{ fontSize: 12, background: '#e3f2fd', margin: '2px 0', borderRadius: 4, padding: '2px 4px' }}>{ev.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthView;
