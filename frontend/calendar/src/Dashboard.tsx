import React, { useEffect, useState } from 'react';
import { fetchEvents, fetchTasks, Event, Task } from './api';
import { MonthView, DayView } from './FullCalendarView';
import EventForm from './EventForm';
import { createEvent } from './api';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [formDay, setFormDay] = useState<Date | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setEvents(await fetchEvents());
      setTasks(await fetchTasks());
      setLoading(false);
    }
    load();
  }, [refresh]);

  return (
    <div style={{ display: 'flex', gap: 48 }}>
      <section style={{ flex: 2, minWidth: 500 }}>
        <h2>Calendar</h2>
        {loading ? <p>Loading...</p> : (
          <>
            {selectedDay ? (
              <DayView events={events} date={selectedDay} onBack={() => setSelectedDay(null)} />
            ) : (
              <MonthView events={events} onDayClick={d => { setFormDay(d); setShowEventForm(true); }} />
            )}
            {showEventForm && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <EventForm
                  initial={formDay ? { start: formDay.toISOString().slice(0, 16), end: formDay.toISOString().slice(0, 16), all_day: true } : {}}
                  onSave={async data => {
                    await createEvent(data);
                    setShowEventForm(false);
                    setFormDay(null);
                    setRefresh(r => r + 1);
                  }}
                  onCancel={() => { setShowEventForm(false); setFormDay(null); }}
                />
              </div>
            )}
            <button
              onClick={() => { setShowEventForm(true); setFormDay(null); }}
              style={{
                position: 'fixed',
                right: 32,
                bottom: 32,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#1976d2',
                color: '#fff',
                fontSize: 32,
                border: 'none',
                boxShadow: '0 2px 8px #0003',
                cursor: 'pointer',
                zIndex: 1000
              }}
              title="Add Event"
            >+
            </button>
          </>
        )}
      </section>
      <section style={{ flex: 1, minWidth: 300 }}>
        <h2>Tasks</h2>
        {loading ? <p>Loading...</p> : (
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <b>{task.title}</b> <br />
                Due: {task.due || 'N/A'} <br />
                Status: {task.status} <br />
                {task.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
