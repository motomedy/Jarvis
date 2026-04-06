import React, { useState } from 'react';
import { Event } from './api';

interface EventFormProps {
  initial?: Partial<Event>;
  onSave: (data: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ initial = {}, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [start, setStart] = useState(initial.start ? initial.start.slice(0, 16) : '');
  const [end, setEnd] = useState(initial.end ? initial.end.slice(0, 16) : '');
  const [allDay, setAllDay] = useState(initial.all_day || false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !start || !end) return;
    onSave({
      title,
      description,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      all_day: allDay,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #0001', minWidth: 320 }}>
      <h3 style={{ margin: 0 }}>{initial.id ? 'Edit Event' : 'Add Event'}</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={2} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
      <label>Start: <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} required /></label>
      <label>End: <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required /></label>
      <label><input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} /> All Day</label>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={{ background: '#eee' }}>Cancel</button>
        <button type="submit" style={{ background: '#1976d2', color: '#fff' }}>{initial.id ? 'Save' : 'Add'}</button>
      </div>
    </form>
  );
};

export default EventForm;
