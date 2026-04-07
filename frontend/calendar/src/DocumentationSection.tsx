
import React, { useEffect, useState } from 'react';

interface Report {
  id: number;
  project: string;
  manager: string;
  team: string[];
  summary: string;
  created_at: string;
  updated_at: string;
}

const DocumentationSection: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ project: '', manager: '', team: '', summary: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({ project: '', manager: '', team: '', summary: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = search ? `/api/reports/search?q=${encodeURIComponent(search)}` : '/api/reports';
    fetch(url)
      .then(res => res.json())
      .then(setReports)
      .finally(() => setLoading(false));
  }, [search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 0,
        project: form.project,
        manager: form.manager,
        team: form.team.split(',').map(s => s.trim()),
        summary: form.summary,
        created_at: '',
        updated_at: ''
      })
    });
    setForm({ project: '', manager: '', team: '', summary: '' });
    setSubmitting(false);
    setLoading(true);
    fetch('/api/reports')
      .then(res => res.json())
      .then(setReports)
      .finally(() => setLoading(false));
  };

  const startEdit = (r: Report) => {
    setEditingId(r.id);
    setEditForm({
      project: r.project,
      manager: r.manager,
      team: r.team.join(', '),
      summary: r.summary
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null) return;
    setSubmitting(true);
    await fetch(`/api/reports/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        project: editForm.project,
        manager: editForm.manager,
        team: editForm.team.split(',').map(s => s.trim()),
        summary: editForm.summary,
        created_at: '',
        updated_at: ''
      })
    });
    setEditingId(null);
    setSubmitting(false);
    setLoading(true);
    fetch('/api/reports')
      .then(res => res.json())
      .then(setReports)
      .finally(() => setLoading(false));
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h2>Documentation & Status Reports</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by project, manager, or keyword..."
        style={{ marginBottom: 16, padding: 6, width: '100%', borderRadius: 4, border: '1px solid #ccc' }}
      />
      {loading ? <p>Loading...</p> : (
        <ul>
          {reports.map((r) => (
            <li key={r.id} style={{ marginBottom: 16 }}>
              {editingId === r.id ? (
                <form onSubmit={handleEditSubmit} style={{ background: '#fffbe6', padding: 12, borderRadius: 8 }}>
                  <label style={{ marginRight: 4 }} htmlFor={`edit-project-${r.id}`}>Project</label>
                  <input id={`edit-project-${r.id}`} name="project" value={editForm.project} onChange={handleEditChange} required style={{ marginRight: 8 }} placeholder="Project" />
                  <label style={{ marginRight: 4 }} htmlFor={`edit-manager-${r.id}`}>Manager</label>
                  <input id={`edit-manager-${r.id}`} name="manager" value={editForm.manager} onChange={handleEditChange} required style={{ marginRight: 8 }} placeholder="Manager" />
                  <label style={{ marginRight: 4 }} htmlFor={`edit-team-${r.id}`}>Team</label>
                  <input id={`edit-team-${r.id}`} name="team" value={editForm.team} onChange={handleEditChange} required style={{ marginRight: 8 }} placeholder="Team (comma separated)" />
                  <label style={{ display: 'block', marginTop: 8 }} htmlFor={`edit-summary-${r.id}`}>Summary</label>
                  <textarea id={`edit-summary-${r.id}`} name="summary" value={editForm.summary} onChange={handleEditChange} required style={{ width: '100%', marginTop: 8 }} placeholder="Status summary" />
                  <button type="submit" disabled={submitting} style={{ marginTop: 8 }}>Save</button>
                  <button type="button" onClick={() => setEditingId(null)} style={{ marginLeft: 8, marginTop: 8 }}>Cancel</button>
                </form>
              ) : (
                <>
                  <b>{r.project}</b> <br />
                  <i>Manager:</i> {r.manager} <br />
                  <i>Team:</i> {r.team.join(', ')} <br />
                  <i>Status:</i> {r.summary} <br />
                  <small>Last updated: {new Date(r.updated_at).toLocaleString()}</small><br />
                  <button onClick={() => startEdit(r)} style={{ marginTop: 4 }}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: 24, background: '#f4f8ff', padding: 16, borderRadius: 8 }}>
        <h3>Submit New Report</h3>
        <label style={{ marginRight: 4 }} htmlFor="project">Project</label>
        <input id="project" name="project" value={form.project} onChange={handleChange} placeholder="Project" required style={{ marginRight: 8 }} />
        <label style={{ marginRight: 4 }} htmlFor="manager">Manager</label>
        <input id="manager" name="manager" value={form.manager} onChange={handleChange} placeholder="Manager" required style={{ marginRight: 8 }} />
        <label style={{ marginRight: 4 }} htmlFor="team">Team</label>
        <input id="team" name="team" value={form.team} onChange={handleChange} placeholder="Team (comma separated)" required style={{ marginRight: 8 }} />
        <label style={{ display: 'block', marginTop: 8 }} htmlFor="summary">Summary</label>
        <textarea id="summary" name="summary" value={form.summary} onChange={handleChange} placeholder="Status summary" required style={{ width: '100%', marginTop: 8 }} />
        <button type="submit" disabled={submitting} style={{ marginTop: 8 }}>Submit</button>
      </form>
    </section>
  );
};

export default DocumentationSection;
