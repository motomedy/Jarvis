import React, { useState } from 'react';
import { Task } from './api';

interface DailyTaskListProps {
  date: Date;
  tasks: Task[];
}

export const DailyTaskList: React.FC<DailyTaskListProps> = ({ date, tasks }) => {
  const dayStr = date.toLocaleDateString();
  const filtered = tasks.filter(t => t.due && new Date(t.due).toLocaleDateString() === dayStr);
  return (
    <div>
      <h3>Tasks for {dayStr}</h3>
      <ul>
        {filtered.length === 0 && <li>No tasks</li>}
        {filtered.map(task => (
          <li key={task.id}>
            <b>{task.title}</b> ({task.status})<br />
            {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface WeeklyTaskListProps {
  weekStart: Date;
  tasks: Task[];
}

export const WeeklyTaskList: React.FC<WeeklyTaskListProps> = ({ weekStart, tasks }) => {
  // weekStart is Sunday
  const days = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));
  return (
    <div>
      <h3>Tasks for Week of {weekStart.toLocaleDateString()}</h3>
      <div style={{ display: 'flex', gap: 16 }}>
        {days.map(day => (
          <div key={day.toISOString()} style={{ flex: 1 }}>
            <b>{day.toLocaleDateString()}</b>
            <ul>
              {tasks.filter(t => t.due && new Date(t.due).toLocaleDateString() === day.toLocaleDateString()).map(task => (
                <li key={task.id}>{task.title} ({task.status})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
