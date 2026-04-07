const statsEl = document.getElementById("stats");
const eventsEl = document.getElementById("events");
const tasksEl = document.getElementById("tasks");
const reportsEl = document.getElementById("reports");

function renderList(el, items, format) {
  el.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = "No data yet.";
    el.appendChild(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = format(item);
    el.appendChild(li);
  }
}

function renderStats(events, tasks, reports) {
  const cards = [
    { label: "Events", value: events.length },
    { label: "Tasks", value: tasks.length },
    { label: "Reports", value: reports.length },
  ];

  statsEl.innerHTML = cards
    .map(
      (c) =>
        `<article class="card"><div class="label">${c.label}</div><div class="value">${c.value}</div></article>`
    )
    .join("");
}

async function loadAll() {
  const [eventsRes, tasksRes, reportsRes] = await Promise.all([
    fetch("/api/events"),
    fetch("/api/tasks"),
    fetch("/api/reports"),
  ]);

  const [events, tasks, reports] = await Promise.all([
    eventsRes.json(),
    tasksRes.json(),
    reportsRes.json(),
  ]);

  renderStats(events, tasks, reports);
  renderList(eventsEl, events, (e) => `${e.title} | ${e.start}`);
  renderList(tasksEl, tasks, (t) => `${t.title} | ${t.status}`);
  renderList(reportsEl, reports, (r) => `${r.project} | ${r.manager}`);
}

loadAll().catch((err) => {
  statsEl.innerHTML = `<article class="card"><div class="label">Error</div><div class="value">${err.message}</div></article>`;
});
