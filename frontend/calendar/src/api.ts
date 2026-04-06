import React, { useEffect, useState } from 'react';

export type Event = {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  all_day: boolean;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  due: string | null;
  status: string;
};

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch('/api/events');
  return res.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks');
  return res.json();
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return res.json();
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateEvent(id: number, event: Omit<Event, 'id'>): Promise<Event> {
  const res = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return res.json();
}

export async function updateTask(id: number, task: Omit<Task, 'id'>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteEvent(id: number): Promise<void> {
  await fetch(`/api/events/${id}`, { method: 'DELETE' });
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
}
