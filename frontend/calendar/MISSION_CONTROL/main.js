const statsEl = document.getElementById("stats");
const eventsEl = document.getElementById("events");
const reportsEl = document.getElementById("reports");
const boardEl = document.getElementById("task-board");
const pipelineBoardEl = document.getElementById("pipeline-board");
const activityFeedEl = document.getElementById("activity-feed");
const syncStatusEl = document.getElementById("sync-status");
const memorySearchEl = document.getElementById("memory-search");
const memoryResultsEl = document.getElementById("memory-results");
const officeFloorEl = document.getElementById("office-floor");
const teamStructureEl = document.getElementById("team-structure");
const missionViewDotsEl = document.getElementById("mission-view-dots");
const frontendStatusRowEl = document.getElementById("frontend-status-row");
const frontendStatusLabelEl = document.getElementById("frontend-status-label");
const backendStatusRowEl = document.getElementById("backend-status-row");
const backendStatusLabelEl = document.getElementById("backend-status-label");

const taskFormEl = document.getElementById("task-form");
const taskTitleInputEl = document.getElementById("task-title");
const taskAssigneeSelectEl = document.getElementById("task-assignee");
const taskStatusSelectEl = document.getElementById("task-status");

const pipelineFormEl = document.getElementById("pipeline-form");
const pipelineTitleEl = document.getElementById("pipeline-title");
const pipelineIdeaEl = document.getElementById("pipeline-idea");
const pipelineScriptEl = document.getElementById("pipeline-script");
const pipelineStageEl = document.getElementById("pipeline-stage");
const pipelineAssigneeEl = document.getElementById("pipeline-assignee");
const pipelineImagesEl = document.getElementById("pipeline-images");

const scheduleFormEl = document.getElementById("schedule-form");
const scheduleTitleEl = document.getElementById("schedule-title");
const scheduleAssigneeEl = document.getElementById("schedule-assignee");
const scheduleKindEl = document.getElementById("schedule-kind");
const scheduleStatusEl = document.getElementById("schedule-status");
const scheduleDatetimeEl = document.getElementById("schedule-datetime");
const scheduleCronEl = document.getElementById("schedule-cron");
const scheduleNotesEl = document.getElementById("schedule-notes");
const calendarPrevEl = document.getElementById("calendar-prev");
const calendarNextEl = document.getElementById("calendar-next");
const calendarMonthLabelEl = document.getElementById("calendar-month-label");
const calendarGridEl = document.getElementById("calendar-grid");
const scheduleListEl = document.getElementById("schedule-list");
const scheduleDayLabelEl = document.getElementById("schedule-day-label");
const scheduleDayListEl = document.getElementById("schedule-day-list");
const scheduleModalEl = document.getElementById("schedule-modal");
const scheduleModalBackdropEl = document.getElementById("schedule-modal-backdrop");
const scheduleModalCloseEl = document.getElementById("schedule-modal-close");
const missionTabsEl = document.getElementById("mission-tabs");
const missionContentEl = document.querySelector(".mission-content");
const tabButtons = Array.from(document.querySelectorAll(".tab"));
const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
const telemetryTasksEl = document.getElementById("telemetry-tasks");
const telemetryContentEl = document.getElementById("telemetry-content");
const telemetrySchedulesEl = document.getElementById("telemetry-schedules");
const telemetryActiveEl = document.getElementById("telemetry-active");

const APP_STATE_KEY = "jarvis_calendar_board_v2";
const APP_TAB_KEY = "jarvis_calendar_active_tab";
const CHANNEL_NAME = "jarvis_task_pipeline_sync";
const MAX_IMAGE_SIZE = 1_600_000;
const SERVER_STATUS_REFRESH_MS = 20_000;
const TAB_LABELS = {
  schedule: "Schedule",
  tasks: "Tasks",
  pipeline: "Pipeline",
  office: "Digital Office",
  team: "Team Structure",
  memory: "Memory",
  activity: "Activity",
  intel: "Intel",
};

const TASK_STATUSES = ["todo", "in_progress", "blocked", "done"];
const TASK_STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

const PIPELINE_STAGES = [
  "idea_backlog",
  "research",
  "outline",
  "scripting",
  "production",
  "editing",
  "qa_review",
  "scheduled",
  "published",
];

const PIPELINE_STAGE_LABELS = {
  idea_backlog: "Idea Backlog",
  research: "Research",
  outline: "Outline",
  scripting: "Scripting",
  production: "Production",
  editing: "Editing",
  qa_review: "QA Review",
  scheduled: "Scheduled",
  published: "Published",
};

const SCHEDULE_KINDS = ["scheduled", "cron"];
const SCHEDULE_KIND_LABELS = {
  scheduled: "Scheduled Task",
  cron: "Cron Job",
};

const SCHEDULE_STATUSES = ["planned", "running", "completed", "blocked"];
const SCHEDULE_STATUS_LABELS = {
  planned: "Planned",
  running: "Running",
  completed: "Completed",
  blocked: "Blocked",
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TEAM_MEMBERS = [
  { id: "me", name: "Me", role: "Project Lead", initials: "ME", color: "#0284c7" },
  { id: "copilot", name: "Copilot", role: "Engineering Agent", initials: "CP", color: "#0ea5a3" },
  { id: "research", name: "Research Agent", role: "Research", initials: "RS", color: "#2563eb" },
  { id: "content", name: "Content Agent", role: "Content", initials: "CT", color: "#16a34a" },
  { id: "ops", name: "Ops Agent", role: "Operations", initials: "OP", color: "#b45309" },
  { id: "analytics", name: "Analytics Agent", role: "Analytics", initials: "AN", color: "#7c3aed" },
];
const ASSIGNEE_NAMES = TEAM_MEMBERS.map((member) => member.name);

const TEAM_STRUCTURE = [
  {
    role: "Developers",
    members: [
      {
        name: "Copilot",
        title: "Primary Engineering Agent",
        responsibilities: [
          "Implements features across Mission Control",
          "Maintains architecture and integrations",
          "Reviews and verifies builds",
        ],
        color: "#0ea5a3",
      },
      {
        name: "Explore Agent",
        title: "Codebase Exploration Specialist",
        responsibilities: [
          "Performs rapid read-only discovery",
          "Finds relevant code and docs",
          "Supports deep repository research",
        ],
        color: "#2563eb",
      },
      {
        name: "JARVIS Ops Agent",
        title: "Runtime and Reliability Engineer",
        responsibilities: [
          "Keeps backend/frontend services healthy",
          "Manages startup and recovery flows",
          "Handles operational incidents",
        ],
        color: "#b45309",
      },
      {
        name: "Save Agent",
        title: "Versioning and Save-Point Agent",
        responsibilities: [
          "Creates checkpoint commits",
          "Organizes clean save history",
          "Supports rollback-safe workflows",
        ],
        color: "#0f766e",
      },
    ],
  },
  {
    role: "Writers",
    members: [
      {
        name: "Content Agent",
        title: "Content Production Writer",
        responsibilities: [
          "Drafts content ideas and scripts",
          "Owns voice and publishing clarity",
          "Maintains pipeline writing quality",
        ],
        color: "#16a34a",
      },
      {
        name: "Research Agent",
        title: "Research and Source Writer",
        responsibilities: [
          "Builds research briefs",
          "Validates claims and references",
          "Transforms findings into outlines",
        ],
        color: "#1d4ed8",
      },
      {
        name: "Documentation Writer",
        title: "Technical Documentation Agent",
        responsibilities: [
          "Writes internal runbooks",
          "Documents APIs and workflows",
          "Tracks release notes and changelogs",
        ],
        color: "#0d9488",
      },
    ],
  },
  {
    role: "Designers",
    members: [
      {
        name: "UI Designer Agent",
        title: "Interface Design Specialist",
        responsibilities: [
          "Designs screen layouts and hierarchy",
          "Improves usability and clarity",
          "Maintains visual consistency",
        ],
        color: "#7c3aed",
      },
      {
        name: "Visual Designer Agent",
        title: "Brand and Visual Language",
        responsibilities: [
          "Builds color and typography direction",
          "Designs iconography and assets",
          "Refines visual storytelling",
        ],
        color: "#9333ea",
      },
      {
        name: "Motion Designer Agent",
        title: "Interaction and Motion Design",
        responsibilities: [
          "Designs meaningful transitions",
          "Creates state-change animations",
          "Supports responsive motion behavior",
        ],
        color: "#6d28d9",
      },
    ],
  },
];

const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;
let eventsCount = 0;
let reportsCount = 0;
let memorySearchTerm = "";
let calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let activeTab = "schedule";
let selectedScheduleDateKey = toDateKey(new Date().toISOString());

const nowIso = new Date().toISOString();
const defaultState = {
  version: 3,
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "Build shared task board",
      assignee: "Copilot",
      status: "done",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: crypto.randomUUID(),
      title: "Track active work in real time",
      assignee: "Copilot",
      status: "in_progress",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: crypto.randomUUID(),
      title: "Build content pipeline tool",
      assignee: "Copilot",
      status: "done",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: crypto.randomUUID(),
      title: "Maintain mission schedule calendar",
      assignee: "Copilot",
      status: "in_progress",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ],
  pipeline: [
    {
      id: crypto.randomUUID(),
      title: "Weekly content roadmap",
      assignee: "Me",
      stage: "outline",
      idea: "Plan 5 short-form posts around productivity, automation, and execution habits.",
      script: "Hook: Most teams are not short on ideas, they are short on flow.\n\nBody: Walk through how one board tracks work from idea to publish.\n\nCTA: Follow for the full workflow templates.",
      attachments: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: crypto.randomUUID(),
      title: "Pipeline demo walkthrough",
      assignee: "Copilot",
      stage: "scripting",
      idea: "Show the new pipeline board and how to move content through all stages.",
      script: "Open on the board.\nShow stage movement.\nEdit idea and full script.\nAttach visual references.\nClose with publishing checklist.",
      attachments: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ],
  schedules: [
    {
      id: crypto.randomUUID(),
      title: "My Birthday",
      assignee: "Me",
      kind: "scheduled",
      status: "planned",
      nextRunAt: new Date(2026, 3, 7, 9, 0, 0).toISOString(),
      cronExpr: "",
      notes: "Birthday",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
      {
        id: crypto.randomUUID(),
        title: "Mission Control Complete!",
        assignee: "Copilot",
        kind: "scheduled",
        status: "completed",
        nextRunAt: new Date(2026, 3, 8, 12, 0, 0).toISOString(),
        cronExpr: "",
        notes: "Milestone: Mission Control is now complete, with all major features, navigation, animation, and reliability requests fulfilled and validated.",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    {
      id: crypto.randomUUID(),
      title: "iOS App Complete!",
      assignee: "Copilot",
      kind: "scheduled",
      status: "completed",
      nextRunAt: new Date(2026, 3, 8, 18, 0, 0).toISOString(),
      cronExpr: "",
      notes: "Milestone: iosmissioncontrol iPhone app is now complete, fully mobile-friendly, visually aligned with Mission Control web, and validated with a successful build and user test.",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: crypto.randomUUID(),
      title: "Daily mission status sync",
      assignee: "Copilot",
      kind: "cron",
      status: "planned",
      nextRunAt: nowIso,
      cronExpr: "0 9 * * 1-5",
      notes: "Update all boards and report progress.",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ],
  activity: [
    `${formatTime(nowIso)} Copilot completed: Build shared task board`,
    `${formatTime(nowIso)} Copilot completed: Build content pipeline tool`,
    `${formatTime(nowIso)} Copilot started: Maintain mission schedule calendar`,
  ],
};

let state = loadState();

function formatTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateTime(isoTime) {
  if (!isoTime) {
    return "Not set";
  }
  return new Date(isoTime).toLocaleString();
}

function toLocalDateTimeInputValue(isoTime) {
  if (!isoTime) {
    return "";
  }
  const dt = new Date(isoTime);
  const tzOffset = dt.getTimezoneOffset() * 60_000;
  const local = new Date(dt.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
}

function toDateKey(isoTime) {
  if (!isoTime) {
    return "";
  }
  const dt = new Date(isoTime);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateSyncStatus(label) {
  syncStatusEl.textContent = label;
  clearTimeout(updateSyncStatus._timer);
  updateSyncStatus._timer = setTimeout(() => {
    syncStatusEl.textContent = "Live sync active";
  }, 1500);
}

function updateStatusRow(rowEl, labelEl, status, message) {
  if (!rowEl || !labelEl) {
    return;
  }

  rowEl.classList.remove("checking", "online", "offline");
  rowEl.classList.add(status);
  labelEl.textContent = message;
}

function updateFrontendStatus() {
  if (navigator.onLine) {
    updateStatusRow(frontendStatusRowEl, frontendStatusLabelEl, "online", "Frontend: Online");
    return;
  }
  updateStatusRow(frontendStatusRowEl, frontendStatusLabelEl, "offline", "Frontend: Offline");
}

async function checkBackendStatus() {
  if (!navigator.onLine) {
    updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "offline", "Backend: Offline");
    return;
  }

  updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "checking", "Backend: Checking...");

  try {
    const response = await fetch("/api/events", { cache: "no-store" });
    if (response.ok) {
      updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "online", "Backend: Online");
      return;
    }
    updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "offline", "Backend: Offline");
  } catch {
    updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "offline", "Backend: Offline");
  }
}

function normalizeState(parsed) {
  return {
    version: 3,
    tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : structuredClone(defaultState.tasks),
    pipeline: Array.isArray(parsed?.pipeline) ? parsed.pipeline : structuredClone(defaultState.pipeline),
    schedules: Array.isArray(parsed?.schedules) ? parsed.schedules : structuredClone(defaultState.schedules),
    activity: Array.isArray(parsed?.activity) ? parsed.activity : structuredClone(defaultState.activity),
  };
}

function ensureTask(title, assignee, status) {
  if (state.tasks.some((task) => task.title === title)) {
    return false;
  }
  const now = new Date().toISOString();
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title,
    assignee,
    status,
    createdAt: now,
    updatedAt: now,
  });
  return true;
}

function ensurePipeline(title, assignee, stage, idea, script) {
  if (state.pipeline.some((item) => item.title === title)) {
    return false;
  }
  const now = new Date().toISOString();
  state.pipeline.unshift({
    id: crypto.randomUUID(),
    title,
    assignee,
    stage,
    idea,
    script,
    attachments: [],
    createdAt: now,
    updatedAt: now,
  });
  return true;
}

function ensureSchedule(title, assignee, kind, status, nextRunAt, cronExpr, notes) {
  if (state.schedules.some((item) => item.title === title)) {
    return false;
  }
  const now = new Date().toISOString();
  state.schedules.unshift({
    id: crypto.randomUUID(),
    title,
    assignee,
    kind,
    status,
    nextRunAt,
    cronExpr,
    notes,
    createdAt: now,
    updatedAt: now,
  });
  return true;
}

function migrateState() {
  let touched = false;
  touched = ensureTask("Build content pipeline tool", "Copilot", "done") || touched;
  touched = ensureTask("Maintain mission schedule calendar", "Copilot", "in_progress") || touched;
  touched =
    ensurePipeline(
      "Pipeline demo walkthrough",
      "Copilot",
      "scripting",
      "Show the new pipeline board and how to move content through all stages.",
      "Open on the board.\nShow stage movement.\nEdit idea and full script.\nAttach visual references.\nClose with publishing checklist."
    ) || touched;
  touched =
    ensureSchedule(
      "My Birthday",
      "Me",
      "scheduled",
      "planned",
      new Date(2026, 3, 7, 9, 0, 0).toISOString(),
      "",
      "Birthday"
    ) || touched;
    touched =
      ensureSchedule(
        "Mission Control Complete!",
        "Copilot",
        "scheduled",
        "completed",
        new Date(2026, 3, 8, 12, 0, 0).toISOString(),
        "",
        "Milestone: Mission Control is now complete, with all major features, navigation, animation, and reliability requests fulfilled and validated."
      ) || touched;
      touched =
        ensureSchedule(
          "iOS App Complete!",
          "Copilot",
          "scheduled",
          "completed",
          new Date(2026, 3, 8, 18, 0, 0).toISOString(),
          "",
          "Milestone: iosmissioncontrol iPhone app is now complete, fully mobile-friendly, visually aligned with Mission Control web, and validated with a successful build and user test."
        ) || touched;
  touched =
    ensureSchedule(
      "Daily mission status sync",
      "Copilot",
      "cron",
      "planned",
      new Date().toISOString(),
      "0 9 * * 1-5",
      "Update all boards and report progress."
    ) || touched;

  if (touched) {
    addActivity("Copilot updated: mission schedule calendar is now available");
  }
  return touched;
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) {
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(defaultState));
      return structuredClone(defaultState);
    }
    const parsed = normalizeState(JSON.parse(raw));
    state = parsed;
    const changed = migrateState();
    if (changed) {
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
      return state;
    }
    return parsed;
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState(reasonLabel) {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
  if (bc) {
    bc.postMessage({ type: "board_state_sync" });
  }
  updateSyncStatus(reasonLabel);
}

function addActivity(message) {
  const entry = `${formatTime(new Date().toISOString())} ${message}`;
  state.activity.unshift(entry);
  state.activity = state.activity.slice(0, 140);
}

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

function renderStats() {
  const activeCount = state.tasks.filter((task) => task.status === "in_progress").length;
  const cards = [
    { label: "Board Tasks", value: state.tasks.length },
    { label: "Content Items", value: state.pipeline.length },
    { label: "Scheduled Jobs", value: state.schedules.length },
    { label: "In Progress", value: activeCount },
    {
      label: "Scripting Stage",
      value: state.pipeline.filter((item) => item.stage === "scripting").length,
    },
    {
      label: "Cron Jobs",
      value: state.schedules.filter((item) => item.kind === "cron").length,
    },
    { label: "Events", value: eventsCount },
    { label: "Reports", value: reportsCount },
  ];

  statsEl.innerHTML = cards
    .map(
      (c) =>
        `<article class="card"><div class="label">${c.label}</div><div class="value">${c.value}</div></article>`
    )
    .join("");

  if (telemetryTasksEl) telemetryTasksEl.textContent = String(state.tasks.length);
  if (telemetryContentEl) telemetryContentEl.textContent = String(state.pipeline.length);
  if (telemetrySchedulesEl) telemetrySchedulesEl.textContent = String(state.schedules.length);
  if (telemetryActiveEl) telemetryActiveEl.textContent = String(activeCount);
}

function officeStatusFor(memberName) {
  const taskWork = state.tasks.filter((task) => task.assignee === memberName);
  const pipelineWork = state.pipeline.filter((item) => item.assignee === memberName);
  const scheduleWork = state.schedules.filter((item) => item.assignee === memberName);

  const activeTask = taskWork.find((task) => task.status === "in_progress") || null;
  const blockedTask = taskWork.find((task) => task.status === "blocked") || null;
  const activePipeline =
    pipelineWork.find((item) => ["research", "outline", "scripting", "production", "editing", "qa_review"].includes(item.stage)) ||
    null;
  const blockedSchedule = scheduleWork.find((item) => item.status === "blocked") || null;
  const runningSchedule = scheduleWork.find((item) => item.status === "running") || null;

  if (blockedTask || blockedSchedule) {
    return {
      mood: "blocked",
      label: "Blocked",
      work: (blockedTask && blockedTask.title) || (blockedSchedule && blockedSchedule.title) || "Needs unblocking",
      totals: { tasks: taskWork.length, pipeline: pipelineWork.length, schedules: scheduleWork.length },
    };
  }

  if (activeTask || activePipeline || runningSchedule) {
    return {
      mood: "working",
      label: "Working",
      work:
        (activeTask && activeTask.title) ||
        (activePipeline && activePipeline.title) ||
        (runningSchedule && runningSchedule.title) ||
        "Focused work",
      totals: { tasks: taskWork.length, pipeline: pipelineWork.length, schedules: scheduleWork.length },
    };
  }

  return {
    mood: "idle",
    label: "Idle",
    work: "No active assignment",
    totals: { tasks: taskWork.length, pipeline: pipelineWork.length, schedules: scheduleWork.length },
  };
}

function workloadFor(memberName) {
  const tasks = state.tasks.filter((task) => task.assignee === memberName).length;
  const pipeline = state.pipeline.filter((item) => item.assignee === memberName).length;
  const schedules = state.schedules.filter((item) => item.assignee === memberName).length;
  return { tasks, pipeline, schedules, total: tasks + pipeline + schedules };
}

function initialsFromName(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderTeamStructure() {
  teamStructureEl.innerHTML = "";

  TEAM_STRUCTURE.forEach((group) => {
    const groupEl = document.createElement("section");
    groupEl.className = "team-role-group";

    const head = document.createElement("h3");
    head.className = "team-role-head";
    head.textContent = group.role;
    groupEl.appendChild(head);

    group.members.forEach((member) => {
      const card = document.createElement("article");
      card.className = "team-member-card";

      const top = document.createElement("div");
      top.className = "team-member-top";

      const left = document.createElement("div");
      const name = document.createElement("p");
      name.className = "team-member-name";
      name.textContent = member.name;

      const title = document.createElement("p");
      title.className = "team-member-title";
      title.textContent = member.title;
      left.append(name, title);

      const avatar = document.createElement("div");
      avatar.className = "team-avatar";
      avatar.style.background = `linear-gradient(145deg, ${member.color}, #0f172a)`;
      avatar.textContent = initialsFromName(member.name);

      top.append(left, avatar);

      const load = workloadFor(member.name);
      const status = document.createElement("span");
      status.className = `team-member-status ${load.total > 0 ? "active" : "standby"}`;
      status.textContent = load.total > 0 ? `Active (${load.total})` : "Standby";

      const body = document.createElement("p");
      body.className = "team-member-body";
      body.textContent = `Responsibilities:\n- ${member.responsibilities.join("\n- ")}\n\nWorkload:\nTasks ${load.tasks}, Content ${load.pipeline}, Schedules ${load.schedules}`;

      card.append(top, status, body);
      groupEl.appendChild(card);
    });

    teamStructureEl.appendChild(groupEl);
  });
}

function renderOffice() {
  officeFloorEl.innerHTML = "";

  TEAM_MEMBERS.forEach((member) => {
    const status = officeStatusFor(member.name);
    const card = document.createElement("article");
    card.className = `office-card ${status.mood}`;

    const head = document.createElement("div");
    head.className = "office-head";

    const titleWrap = document.createElement("div");
    titleWrap.innerHTML = `<h3 class="office-name">${member.name}</h3><p class="office-role">${member.role}</p>`;

    const badge = document.createElement("span");
    badge.className = `office-status ${status.mood}`;
    badge.textContent = status.label;

    head.append(titleWrap, badge);

    const scene = document.createElement("div");
    scene.className = `office-scene ${status.mood}`;

    const desk = document.createElement("div");
    desk.className = "desk";

    const computer = document.createElement("div");
    computer.className = `computer ${status.mood}`;

    const figure = document.createElement("div");
    figure.className = `agent-figure ${status.mood}`;
    figure.style.setProperty("--agent-color", member.color);

    const torso = document.createElement("span");
    torso.className = "figure-torso";
    const headShape = document.createElement("span");
    headShape.className = "figure-head";
    const eyes = document.createElement("span");
    eyes.className = "figure-eyes";
    const leftArm = document.createElement("span");
    leftArm.className = "figure-arm left";
    const rightArm = document.createElement("span");
    rightArm.className = "figure-arm right";
    const badgeInitials = document.createElement("span");
    badgeInitials.className = "figure-badge";
    badgeInitials.textContent = member.initials;

    figure.append(torso, headShape, eyes, leftArm, rightArm, badgeInitials);

    scene.append(desk, computer, figure);

    const work = document.createElement("p");
    work.className = "office-work";
    work.textContent = `Now: ${status.work} | Tasks ${status.totals.tasks}, Content ${status.totals.pipeline}, Schedules ${status.totals.schedules}`;

    card.append(head, scene, work);
    officeFloorEl.appendChild(card);
  });
}

function buildMemoryDocuments() {
  const docs = [];

  docs.push({
    id: "memory-overview",
    type: "system",
    title: "Mission Memory Overview",
    updatedAt: new Date().toISOString(),
    body: [
      `Tasks tracked: ${state.tasks.length}`,
      `Content items tracked: ${state.pipeline.length}`,
      `Scheduled jobs tracked: ${state.schedules.length}`,
      `Activity entries: ${state.activity.length}`,
      `Open work (in progress tasks): ${state.tasks.filter((task) => task.status === "in_progress").length}`,
    ].join("\n"),
    keywords: ["overview", "mission", "memory", "summary", "schedule", "cron"],
  });

  state.tasks.forEach((task) => {
    docs.push({
      id: `task-${task.id}`,
      type: "task",
      title: `Task Memory: ${task.title}`,
      updatedAt: task.updatedAt,
      body: [
        `Assignee: ${task.assignee}`,
        `Status: ${TASK_STATUS_LABELS[task.status]}`,
        `Created: ${new Date(task.createdAt).toLocaleString()}`,
        `Updated: ${new Date(task.updatedAt).toLocaleString()}`,
      ].join("\n"),
      keywords: [task.assignee, task.status, "task"],
    });
  });

  state.pipeline.forEach((item) => {
    docs.push({
      id: `pipeline-${item.id}`,
      type: "content",
      title: `Content Memory: ${item.title}`,
      updatedAt: item.updatedAt,
      body: [
        `Assignee: ${item.assignee}`,
        `Stage: ${PIPELINE_STAGE_LABELS[item.stage]}`,
        `Idea:\n${item.idea || "(empty)"}`,
        `Script:\n${item.script || "(empty)"}`,
        `Attachments: ${(item.attachments || []).map((a) => a.name).join(", ") || "none"}`,
      ].join("\n\n"),
      keywords: [item.assignee, item.stage, "pipeline", "script", "idea"],
    });
  });

  state.schedules.forEach((item) => {
    docs.push({
      id: `schedule-${item.id}`,
      type: "schedule",
      title: `Schedule Memory: ${item.title}`,
      updatedAt: item.updatedAt,
      body: [
        `Assignee: ${item.assignee}`,
        `Type: ${SCHEDULE_KIND_LABELS[item.kind]}`,
        `Status: ${SCHEDULE_STATUS_LABELS[item.status]}`,
        `Next Run: ${formatDateTime(item.nextRunAt)}`,
        `Cron: ${item.cronExpr || "(none)"}`,
        `Notes: ${item.notes || "(none)"}`,
      ].join("\n"),
      keywords: [item.assignee, item.kind, item.status, "schedule", "cron", item.cronExpr || ""],
    });
  });

  state.activity.slice(0, 30).forEach((entry, index) => {
    docs.push({
      id: `activity-${index}`,
      type: "activity",
      title: `Activity Memory ${index + 1}`,
      updatedAt: new Date().toISOString(),
      body: entry,
      keywords: ["activity", "timeline", "log"],
    });
  });

  return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function renderMemoryResults() {
  const docs = buildMemoryDocuments();
  const term = memorySearchTerm.trim().toLowerCase();

  const filtered = term
    ? docs.filter((doc) => {
        const haystack = [doc.title, doc.body, doc.type, ...(doc.keywords || [])].join(" ").toLowerCase();
        return haystack.includes(term);
      })
    : docs;

  memoryResultsEl.innerHTML = "";
  if (!filtered.length) {
    memoryResultsEl.innerHTML = '<div class="memory-empty">No memories matched your search. Try another keyword.</div>';
    return;
  }

  filtered.forEach((doc) => {
    const card = document.createElement("article");
    card.className = "memory-doc";

    const heading = document.createElement("h3");
    heading.textContent = doc.title;

    const meta = document.createElement("div");
    meta.className = "memory-meta";
    meta.innerHTML = `<span class="memory-type">${doc.type}</span><span>${new Date(doc.updatedAt).toLocaleString()}</span>`;

    const body = document.createElement("p");
    body.className = "memory-body";
    body.textContent = doc.body;

    card.append(heading, meta, body);
    memoryResultsEl.appendChild(card);
  });
}

function updateTask(taskId, updates) {
  state.tasks = state.tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }
    return { ...task, ...updates };
  });
}

function createTaskCard(task) {
  const li = document.createElement("li");
  li.className = "task-card";

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.innerHTML = `<span class="badge">${task.assignee}</span><span>Updated ${formatTime(task.updatedAt)}</span>`;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const statusSelect = document.createElement("select");
  for (const status of TASK_STATUSES) {
    const opt = document.createElement("option");
    opt.value = status;
    opt.textContent = TASK_STATUS_LABELS[status];
    if (task.status === status) {
      opt.selected = true;
    }
    statusSelect.appendChild(opt);
  }

  statusSelect.addEventListener("change", () => {
    updateTask(task.id, {
      status: statusSelect.value,
      updatedAt: new Date().toISOString(),
    });
    addActivity(`${task.assignee} changed task status: ${task.title} -> ${TASK_STATUS_LABELS[statusSelect.value]}`);
    persistState("Task status updated");
    renderTaskBoard();
    renderStats();
    renderActivity();
  });

  const assigneeSelect = document.createElement("select");
  ASSIGNEE_NAMES.forEach((who) => {
    const opt = document.createElement("option");
    opt.value = who;
    opt.textContent = who;
    if (task.assignee === who) {
      opt.selected = true;
    }
    assigneeSelect.appendChild(opt);
  });

  assigneeSelect.addEventListener("change", () => {
    updateTask(task.id, {
      assignee: assigneeSelect.value,
      updatedAt: new Date().toISOString(),
    });
    addActivity(`${assigneeSelect.value} is now assigned: ${task.title}`);
    persistState("Task assignee updated");
    renderTaskBoard();
    renderActivity();
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "ghost";
  removeButton.textContent = "Archive";
  removeButton.addEventListener("click", () => {
    state.tasks = state.tasks.filter((entry) => entry.id !== task.id);
    addActivity(`Task archived: ${task.title}`);
    persistState("Task archived");
    renderTaskBoard();
    renderStats();
    renderActivity();
  });

  actions.append(statusSelect, assigneeSelect, removeButton);
  li.append(title, meta, actions);
  return li;
}

function renderTaskBoard() {
  boardEl.innerHTML = "";
  for (const status of TASK_STATUSES) {
    const section = document.createElement("section");
    section.className = "column";

    const header = document.createElement("h3");
    const count = state.tasks.filter((task) => task.status === status).length;
    header.textContent = `${TASK_STATUS_LABELS[status]} (${count})`;

    const list = document.createElement("ul");
    const filtered = state.tasks.filter((task) => task.status === status);
    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks";
      list.appendChild(empty);
    } else {
      for (const task of filtered) {
        list.appendChild(createTaskCard(task));
      }
    }

    section.append(header, list);
    boardEl.appendChild(section);
  }

  renderMemoryResults();
}

function updatePipelineItem(itemId, updates) {
  state.pipeline = state.pipeline.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return { ...item, ...updates };
  });
}

function updateScheduleItem(itemId, updates) {
  state.schedules = state.schedules.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return { ...item, ...updates };
  });
}

async function toAttachment(file) {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${file.name} is too large; please use images under 1.6MB`);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
      });
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function createPipelineCard(item) {
  const card = document.createElement("li");
  card.className = "pipeline-card";

  const wrapper = document.createElement("div");
  wrapper.className = "pipeline-grid";

  const titleInput = document.createElement("input");
  titleInput.value = item.title;

  const metaWrap = document.createElement("div");
  metaWrap.className = "pipeline-inline-meta";

  const assigneeSelect = document.createElement("select");
  ASSIGNEE_NAMES.forEach((who) => {
    const opt = document.createElement("option");
    opt.value = who;
    opt.textContent = who;
    if (item.assignee === who) {
      opt.selected = true;
    }
    assigneeSelect.appendChild(opt);
  });

  const stageSelect = document.createElement("select");
  PIPELINE_STAGES.forEach((stage) => {
    const opt = document.createElement("option");
    opt.value = stage;
    opt.textContent = PIPELINE_STAGE_LABELS[stage];
    if (item.stage === stage) {
      opt.selected = true;
    }
    stageSelect.appendChild(opt);
  });

  metaWrap.append(assigneeSelect, stageSelect);

  const ideaArea = document.createElement("textarea");
  ideaArea.rows = 3;
  ideaArea.value = item.idea;
  ideaArea.placeholder = "Idea details";

  const scriptArea = document.createElement("textarea");
  scriptArea.className = "script-area";
  scriptArea.value = item.script;
  scriptArea.placeholder = "Full script";

  const attachInput = document.createElement("input");
  attachInput.type = "file";
  attachInput.multiple = true;
  attachInput.accept = "image/*";

  const attachmentStrip = document.createElement("div");
  attachmentStrip.className = "attachment-strip";

  (item.attachments || []).forEach((attachment) => {
    const box = document.createElement("div");
    box.className = "attachment-item";

    const img = document.createElement("img");
    img.src = attachment.dataUrl;
    img.alt = attachment.name;

    const caption = document.createElement("div");
    caption.className = "attachment-caption";
    caption.textContent = attachment.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ghost";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const nextAttachments = (item.attachments || []).filter((entry) => entry.id !== attachment.id);
      updatePipelineItem(item.id, {
        attachments: nextAttachments,
        updatedAt: new Date().toISOString(),
      });
      addActivity(`Image removed from: ${item.title}`);
      persistState("Attachment removed");
      renderPipelineBoard();
      renderActivity();
    });

    box.append(img, caption, removeBtn);
    attachmentStrip.appendChild(box);
  });

  const actions = document.createElement("div");
  actions.className = "pipeline-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Save Changes";
  saveBtn.addEventListener("click", () => {
    updatePipelineItem(item.id, {
      title: titleInput.value.trim() || item.title,
      assignee: assigneeSelect.value,
      stage: stageSelect.value,
      idea: ideaArea.value.trim(),
      script: scriptArea.value.trim(),
      updatedAt: new Date().toISOString(),
    });
    addActivity(`${assigneeSelect.value} updated content item: ${titleInput.value.trim() || item.title}`);
    persistState("Pipeline item updated");
    renderPipelineBoard();
    renderStats();
    renderActivity();
  });

  const attachBtn = document.createElement("button");
  attachBtn.type = "button";
  attachBtn.className = "ghost";
  attachBtn.textContent = "Attach Images";
  attachBtn.addEventListener("click", async () => {
    const files = Array.from(attachInput.files || []);
    if (!files.length) {
      return;
    }
    try {
      const additions = await Promise.all(files.map((file) => toAttachment(file)));
      updatePipelineItem(item.id, {
        attachments: [...(item.attachments || []), ...additions],
        updatedAt: new Date().toISOString(),
      });
      addActivity(`${item.assignee} attached ${additions.length} image(s) to: ${item.title}`);
      persistState("Images attached");
      renderPipelineBoard();
      renderActivity();
    } catch (err) {
      updateSyncStatus(err.message);
    }
  });

  const archiveBtn = document.createElement("button");
  archiveBtn.type = "button";
  archiveBtn.className = "ghost";
  archiveBtn.textContent = "Archive";
  archiveBtn.addEventListener("click", () => {
    state.pipeline = state.pipeline.filter((entry) => entry.id !== item.id);
    addActivity(`Content item archived: ${item.title}`);
    persistState("Pipeline item archived");
    renderPipelineBoard();
    renderStats();
    renderActivity();
  });

  actions.append(saveBtn, attachBtn, archiveBtn);
  wrapper.append(titleInput, metaWrap, ideaArea, scriptArea, attachInput, attachmentStrip, actions);
  card.appendChild(wrapper);
  return card;
}

function renderPipelineBoard() {
  pipelineBoardEl.innerHTML = "";
  PIPELINE_STAGES.forEach((stage) => {
    const section = document.createElement("section");
    section.className = "column";

    const header = document.createElement("h3");
    const inStage = state.pipeline.filter((item) => item.stage === stage);
    header.textContent = `${PIPELINE_STAGE_LABELS[stage]} (${inStage.length})`;

    const list = document.createElement("ul");
    if (!inStage.length) {
      const empty = document.createElement("li");
      empty.textContent = "No content";
      list.appendChild(empty);
    } else {
      inStage.forEach((item) => list.appendChild(createPipelineCard(item)));
    }

    section.append(header, list);
    pipelineBoardEl.appendChild(section);
  });

  renderMemoryResults();
}

function scheduleCountByDateKey() {
  const counts = {};
  state.schedules.forEach((item) => {
    const key = toDateKey(item.nextRunAt);
    if (!key) {
      return;
    }
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function renderScheduleCalendar() {
  if (!calendarGridEl || !calendarMonthLabelEl) {
    return;
  }

  calendarGridEl.innerHTML = "";
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  calendarMonthLabelEl.textContent = calendarCursor.toLocaleDateString([], { month: "long", year: "numeric" });

  WEEK_DAYS.forEach((day) => {
    const head = document.createElement("div");
    head.className = "calendar-day-name";
    head.textContent = day;
    calendarGridEl.appendChild(head);
  });

  const counts = scheduleCountByDateKey();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const todayKey = toDateKey(new Date().toISOString());

  const totalCells = 42;
  for (let i = 0; i < totalCells; i += 1) {
    let day;
    let cellDate;
    let muted = false;

    if (i < startOffset) {
      day = daysInPrevMonth - startOffset + i + 1;
      cellDate = new Date(year, month - 1, day);
      muted = true;
    } else if (i < startOffset + daysInMonth) {
      day = i - startOffset + 1;
      cellDate = new Date(year, month, day);
    } else {
      day = i - (startOffset + daysInMonth) + 1;
      cellDate = new Date(year, month + 1, day);
      muted = true;
    }

    const key = toDateKey(cellDate.toISOString());
    const count = counts[key] || 0;

    const birthdayItem = state.schedules.find((item) => toDateKey(item.nextRunAt) === key && /birthday/i.test(item.title));
    const milestoneItem = state.schedules.find((item) => {
      if (toDateKey(item.nextRunAt) !== key) return false;
      return /milestone/i.test(item.notes || "") || /complete!$/i.test(item.title);
    });

    const cell = document.createElement("div");
    cell.className = "calendar-day-cell";
    if (muted) {
      cell.classList.add("muted");
    }
    if (key === todayKey) {
      cell.classList.add("today");
    }
    if (key === selectedScheduleDateKey) {
      cell.classList.add("selected");
    }
    if (birthdayItem) {
      cell.classList.add("birthday");
    }
    if (milestoneItem) {
      cell.classList.add("milestone-schedule");
    }

    cell.addEventListener("click", () => {
      selectedScheduleDateKey = key;
      renderScheduleCalendar();
      renderSelectedDayTasks();
      openScheduleModal();
    });

    const num = document.createElement("span");
    num.className = "day-num";
    num.textContent = String(day);

    const badge = document.createElement("span");
    badge.className = "day-count";
    if (birthdayItem) {
      badge.textContent = "Birthday";
    } else {
      badge.textContent = count ? `${count} job${count > 1 ? "s" : ""}` : "";
    }

    cell.append(num, badge);
    calendarGridEl.appendChild(cell);
  }
}

function renderSelectedDayTasks() {
  if (!scheduleDayLabelEl || !scheduleDayListEl) {
    return;
  }

  scheduleDayListEl.innerHTML = "";

  const displayDate = new Date(`${selectedScheduleDateKey}T00:00:00`);
  scheduleDayLabelEl.textContent = Number.isNaN(displayDate.getTime())
    ? "Daily Schedules"
    : `Daily Schedules: ${displayDate.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`;

  const dayItems = state.schedules
    .filter((item) => toDateKey(item.nextRunAt) === selectedScheduleDateKey)
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime());

  if (!dayItems.length) {
    const li = document.createElement("li");
    li.textContent = "No schedules for this day.";
    scheduleDayListEl.appendChild(li);
    return;
  }

  dayItems.forEach((item) => {
    const li = document.createElement("li");
    const timeLabel = item.nextRunAt ? new Date(item.nextRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "No time";
    const kindLabel = SCHEDULE_KIND_LABELS[item.kind] || "Schedule";
    const statusLabel = SCHEDULE_STATUS_LABELS[item.status] || "Planned";
    const isMilestone = /milestone/i.test(item.notes || "") || /complete!$/i.test(item.title);
    if (isMilestone) {
      li.className = "milestone-schedule";
      li.innerHTML = `🎉 <strong style='color:#0ea5a3;'>${timeLabel} | ${item.title}</strong> | <span style='color:#f59e42;'>${kindLabel}</span> | <span style='color:#22c55e;'>${statusLabel}</span> <span style='background:#fffbe6;color:#b45309;padding:2px 8px;border-radius:8px;margin-left:8px;'>Milestone</span>`;
    } else {
      li.textContent = `${timeLabel} | ${item.title} | ${kindLabel} | ${statusLabel}`;
    }
    scheduleDayListEl.appendChild(li);
  });
}

function openScheduleModal() {
  if (!scheduleModalEl) {
    return;
  }
  scheduleModalEl.classList.add("is-open");
  scheduleModalEl.setAttribute("aria-hidden", "false");
}

function closeScheduleModal() {
  if (!scheduleModalEl) {
    return;
  }
  scheduleModalEl.classList.remove("is-open");
  scheduleModalEl.setAttribute("aria-hidden", "true");
}

function createScheduleCard(item) {
  const li = document.createElement("li");
  li.className = "schedule-item";

  const top = document.createElement("div");
  top.className = "schedule-item-top";

  const titleInput = document.createElement("input");
  titleInput.value = item.title;

  const assigneeSelect = document.createElement("select");
  ASSIGNEE_NAMES.forEach((who) => {
    const opt = document.createElement("option");
    opt.value = who;
    opt.textContent = who;
    if (item.assignee === who) {
      opt.selected = true;
    }
    assigneeSelect.appendChild(opt);
  });

  const kindSelect = document.createElement("select");
  SCHEDULE_KINDS.forEach((kind) => {
    const opt = document.createElement("option");
    opt.value = kind;
    opt.textContent = SCHEDULE_KIND_LABELS[kind];
    if (item.kind === kind) {
      opt.selected = true;
    }
    kindSelect.appendChild(opt);
  });

  const statusSelect = document.createElement("select");
  SCHEDULE_STATUSES.forEach((status) => {
    const opt = document.createElement("option");
    opt.value = status;
    opt.textContent = SCHEDULE_STATUS_LABELS[status];
    if (item.status === status) {
      opt.selected = true;
    }
    statusSelect.appendChild(opt);
  });

  top.append(titleInput, assigneeSelect, kindSelect, statusSelect);

  const bottom = document.createElement("div");
  bottom.className = "schedule-item-bottom";

  const dateInput = document.createElement("input");
  dateInput.type = "datetime-local";
  dateInput.value = toLocalDateTimeInputValue(item.nextRunAt);

  const cronInput = document.createElement("input");
  cronInput.placeholder = "Cron expression";
  cronInput.value = item.cronExpr || "";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "Save";

  const notesArea = document.createElement("textarea");
  notesArea.rows = 2;
  notesArea.value = item.notes || "";
  notesArea.placeholder = "Notes";

  const archiveBtn = document.createElement("button");
  archiveBtn.type = "button";
  archiveBtn.className = "ghost";
  archiveBtn.textContent = "Archive";

  saveBtn.addEventListener("click", () => {
    const nextRunAt = dateInput.value ? new Date(dateInput.value).toISOString() : "";
    const kind = kindSelect.value;
    const cronExpr = cronInput.value.trim();

    if (kind === "scheduled" && !nextRunAt) {
      updateSyncStatus("Scheduled tasks require a date/time");
      return;
    }
    if (kind === "cron" && !cronExpr) {
      updateSyncStatus("Cron jobs require a cron expression");
      return;
    }

    updateScheduleItem(item.id, {
      title: titleInput.value.trim() || item.title,
      assignee: assigneeSelect.value,
      kind,
      status: statusSelect.value,
      nextRunAt,
      cronExpr,
      notes: notesArea.value.trim(),
      updatedAt: new Date().toISOString(),
    });

    addActivity(`${assigneeSelect.value} updated schedule: ${titleInput.value.trim() || item.title}`);
    persistState("Schedule updated");
    renderScheduleList();
    renderScheduleCalendar();
    renderStats();
    renderMemoryResults();
    renderActivity();
  });

  archiveBtn.addEventListener("click", () => {
    state.schedules = state.schedules.filter((entry) => entry.id !== item.id);
    addActivity(`Schedule archived: ${item.title}`);
    persistState("Schedule archived");
    renderScheduleList();
    renderScheduleCalendar();
    renderStats();
    renderMemoryResults();
    renderActivity();
  });

  bottom.append(dateInput, cronInput, saveBtn);
  li.append(top, bottom, notesArea, archiveBtn);
  return li;
}

function renderScheduleList() {
  if (!scheduleListEl) {
    return;
  }

  scheduleListEl.innerHTML = "";
  const ordered = [...state.schedules].sort((a, b) => {
    const aTime = a.nextRunAt ? new Date(a.nextRunAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.nextRunAt ? new Date(b.nextRunAt).getTime() : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });

  if (!ordered.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scheduled tasks or cron jobs yet.";
    scheduleListEl.appendChild(empty);
    return;
  }

  ordered.forEach((item) => {
    scheduleListEl.appendChild(createScheduleCard(item));
  });
}

function renderActivity() {
  renderList(activityFeedEl, state.activity, (entry) => entry);
}

function renderMissionViewReview() {
  if (missionViewDotsEl) {
    missionViewDotsEl.innerHTML = "";
    tabButtons.forEach((button) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", TAB_LABELS[button.dataset.tab] || "Mission section");
      dot.setAttribute("title", TAB_LABELS[button.dataset.tab] || "Mission section");
      dot.className = `mission-review-dot ${button.dataset.tab === activeTab ? "is-active" : ""}`.trim();
      dot.addEventListener("click", () => {
        setActiveTab(button.dataset.tab || "schedule");
      });
      missionViewDotsEl.appendChild(dot);
    });
  }
}

function setActiveTab(tabName, { scrollIntoPanel = true } = {}) {
  const validTab = tabButtons.some((button) => button.dataset.tab === tabName) ? tabName : "schedule";
  activeTab = validTab;

  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === activeTab);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === activeTab);
  });

  const activeButton = tabButtons.find((button) => button.dataset.tab === activeTab);
  if (activeButton) {
    activeButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  if (scrollIntoPanel) {
    const activePanel = tabPanels.find((panel) => panel.dataset.tabPanel === activeTab);
    if (activePanel) {
      activePanel.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }

  renderMissionViewReview();

  localStorage.setItem(APP_TAB_KEY, activeTab);
}

function renderEverything() {
  renderTaskBoard();
  renderPipelineBoard();
  renderScheduleCalendar();
  renderSelectedDayTasks();
  renderScheduleList();
  renderOffice();
  renderTeamStructure();
  renderActivity();
  renderStats();
  renderMemoryResults();
}

async function readJsonArraySafe(response) {
  if (!response.ok) {
    return [];
  }

  const body = await response.text();
  if (!body.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function loadAll() {
  try {
    const [eventsRes, reportsRes] = await Promise.all([fetch("/api/events"), fetch("/api/reports")]);
    const [events, reports] = await Promise.all([
      readJsonArraySafe(eventsRes),
      readJsonArraySafe(reportsRes),
    ]);

    eventsCount = events.length;
    reportsCount = reports.length;

    renderList(eventsEl, events, (e) => `${e.title} | ${e.start}`);
    renderList(reportsEl, reports, (r) => `${r.project} | ${r.manager}`);
    renderStats();
  } catch {
    eventsCount = 0;
    reportsCount = 0;
    renderList(eventsEl, [], (e) => `${e.title} | ${e.start}`);
    renderList(reportsEl, [], (r) => `${r.project} | ${r.manager}`);
    updateSyncStatus("Live intel is unavailable");
    renderStats();
  }
}

taskFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitleInputEl.value.trim();
  if (!title) {
    return;
  }

  const now = new Date().toISOString();
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title,
    assignee: taskAssigneeSelectEl.value,
    status: taskStatusSelectEl.value,
    createdAt: now,
    updatedAt: now,
  });

  addActivity(`${taskAssigneeSelectEl.value} added task: ${title}`);
  persistState("Task added");
  taskFormEl.reset();
  taskAssigneeSelectEl.value = "Me";
  taskStatusSelectEl.value = "todo";
  renderEverything();
});

pipelineFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = pipelineTitleEl.value.trim();
  if (!title) {
    return;
  }

  const files = Array.from(pipelineImagesEl.files || []);
  try {
    const attachments = await Promise.all(files.map((file) => toAttachment(file)));
    const now = new Date().toISOString();
    state.pipeline.unshift({
      id: crypto.randomUUID(),
      title,
      assignee: pipelineAssigneeEl.value,
      stage: pipelineStageEl.value,
      idea: pipelineIdeaEl.value.trim(),
      script: pipelineScriptEl.value.trim(),
      attachments,
      createdAt: now,
      updatedAt: now,
    });

    addActivity(`${pipelineAssigneeEl.value} added content item: ${title}`);
    persistState("Content item added");
    pipelineFormEl.reset();
    pipelineAssigneeEl.value = "Me";
    pipelineStageEl.value = "idea_backlog";
    renderEverything();
  } catch (err) {
    updateSyncStatus(err.message);
  }
});

if (scheduleFormEl) {
  scheduleFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = scheduleTitleEl.value.trim();
    if (!title) {
      return;
    }

    const kind = scheduleKindEl.value;
    const nextRunAt = scheduleDatetimeEl.value ? new Date(scheduleDatetimeEl.value).toISOString() : "";
    const cronExpr = scheduleCronEl.value.trim();

    if (kind === "scheduled" && !nextRunAt) {
      updateSyncStatus("Scheduled tasks require a date/time");
      return;
    }

    if (kind === "cron" && !cronExpr) {
      updateSyncStatus("Cron jobs require a cron expression");
      return;
    }

    const now = new Date().toISOString();
    state.schedules.unshift({
      id: crypto.randomUUID(),
      title,
      assignee: scheduleAssigneeEl.value,
      kind,
      status: scheduleStatusEl.value,
      nextRunAt,
      cronExpr,
      notes: scheduleNotesEl.value.trim(),
      createdAt: now,
      updatedAt: now,
    });

    addActivity(`${scheduleAssigneeEl.value} added ${SCHEDULE_KIND_LABELS[kind]}: ${title}`);
    persistState("Schedule added");
    scheduleFormEl.reset();
    scheduleAssigneeEl.value = "Me";
    scheduleKindEl.value = "scheduled";
    scheduleStatusEl.value = "planned";
    renderEverything();
  });
}

memorySearchEl.addEventListener("input", () => {
  memorySearchTerm = memorySearchEl.value || "";
  renderMemoryResults();
});

if (scheduleModalBackdropEl) {
  scheduleModalBackdropEl.addEventListener("click", () => {
    closeScheduleModal();
  });
}

if (scheduleModalCloseEl) {
  scheduleModalCloseEl.addEventListener("click", () => {
    closeScheduleModal();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeScheduleModal();
  }
});

if (missionTabsEl) {
  missionTabsEl.addEventListener("click", (event) => {
    const button = event.target.closest(".tab");
    if (!button) {
      return;
    }
    setActiveTab(button.dataset.tab || "schedule");
  });
}

window.addEventListener("keydown", (event) => {
  if (
    event.target instanceof HTMLElement &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
  ) {
    return;
  }

  if (event.key === "ArrowLeft") {
    const activeIndex = tabButtons.findIndex((button) => button.dataset.tab === activeTab);
    if (activeIndex > 0) {
      setActiveTab(tabButtons[activeIndex - 1].dataset.tab || "schedule");
    }
  }

  if (event.key === "ArrowRight") {
    const activeIndex = tabButtons.findIndex((button) => button.dataset.tab === activeTab);
    if (activeIndex >= 0 && activeIndex < tabButtons.length - 1) {
      setActiveTab(tabButtons[activeIndex + 1].dataset.tab || "schedule");
    }
  }
});

if (missionContentEl) {
  const panelObserver = new IntersectionObserver(
    (entries) => {
      let nextPanel = null;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (!nextPanel || entry.intersectionRatio > nextPanel.intersectionRatio) {
          nextPanel = entry;
        }
      });

      if (nextPanel?.target?.dataset?.tabPanel) {
        setActiveTab(nextPanel.target.dataset.tabPanel, { scrollIntoPanel: false });
      }
    },
    {
      root: missionContentEl,
      threshold: [0.55, 0.7, 0.9],
    }
  );

  tabPanels.forEach((panel) => {
    panelObserver.observe(panel);
  });
}

calendarPrevEl.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderScheduleCalendar();
});

calendarNextEl.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderScheduleCalendar();
});

if (bc) {
  bc.onmessage = (event) => {
    if (event.data?.type === "board_state_sync") {
      state = loadState();
      renderEverything();
      updateSyncStatus("Synced from another session");
    }
  };
}

window.addEventListener("storage", (event) => {
  if (event.key === APP_STATE_KEY) {
    state = loadState();
    renderEverything();
    updateSyncStatus("Synced from storage");
  }
});

renderEverything();
setActiveTab(activeTab, { scrollIntoPanel: false });
requestAnimationFrame(() => {
  setActiveTab(activeTab);
});
updateFrontendStatus();
checkBackendStatus();
setInterval(checkBackendStatus, SERVER_STATUS_REFRESH_MS);

window.addEventListener("online", () => {
  updateFrontendStatus();
  checkBackendStatus();
});

window.addEventListener("offline", () => {
  updateFrontendStatus();
  updateStatusRow(backendStatusRowEl, backendStatusLabelEl, "offline", "Backend: Offline");
});

loadAll().catch((err) => {
  statsEl.innerHTML = `<article class="card"><div class="label">Error</div><div class="value">${err.message}</div></article>`;
});
