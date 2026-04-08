import Foundation
import SwiftUI

enum MissionTaskStatus: String, Codable, CaseIterable, Identifiable {
    case todo
    case inProgress
    case blocked
    case done

    var id: String { rawValue }

    var title: String {
        switch self {
        case .todo:
            return "To Do"
        case .inProgress:
            return "In Progress"
        case .blocked:
            return "Blocked"
        case .done:
            return "Done"
        }
    }

    var tint: Color {
        switch self {
        case .todo:
            return .blue
        case .inProgress:
            return .orange
        case .blocked:
            return .red
        case .done:
            return .green
        }
    }
}

enum PipelineStage: String, Codable, CaseIterable, Identifiable {
    case ideaBacklog
    case research
    case outline
    case scripting
    case production
    case editing
    case qaReview
    case scheduled
    case published

    var id: String { rawValue }

    var title: String {
        switch self {
        case .ideaBacklog:
            return "Idea Backlog"
        case .research:
            return "Research"
        case .outline:
            return "Outline"
        case .scripting:
            return "Scripting"
        case .production:
            return "Production"
        case .editing:
            return "Editing"
        case .qaReview:
            return "QA Review"
        case .scheduled:
            return "Scheduled"
        case .published:
            return "Published"
        }
    }
}

enum ScheduleKind: String, Codable, CaseIterable, Identifiable {
    case scheduled
    case cron

    var id: String { rawValue }

    var title: String {
        switch self {
        case .scheduled:
            return "Scheduled Task"
        case .cron:
            return "Cron Job"
        }
    }
}

enum ScheduleStatus: String, Codable, CaseIterable, Identifiable {
    case planned
    case running
    case completed
    case blocked

    var id: String { rawValue }

    var title: String {
        rawValue.capitalized
    }
}

struct MissionTask: Identifiable, Codable {
    let id: UUID
    var title: String
    var assignee: String
    var status: MissionTaskStatus
    var updatedAt: Date
}

struct PipelineItem: Identifiable, Codable {
    let id: UUID
    var title: String
    var assignee: String
    var stage: PipelineStage
    var idea: String
    var script: String
    var updatedAt: Date
}

struct ScheduleItem: Identifiable, Codable {
    let id: UUID
    var title: String
    var assignee: String
    var kind: ScheduleKind
    var status: ScheduleStatus
    var nextRunAt: Date
    var notes: String
}

struct ActivityEntry: Identifiable, Codable {
    let id: UUID
    let message: String
    let createdAt: Date
}

struct MissionSnapshot: Codable {
    var tasks: [MissionTask]
    var pipeline: [PipelineItem]
    var schedules: [ScheduleItem]
    var activity: [ActivityEntry]
}

final class MissionControlStore: ObservableObject {
    private enum Keys {
        static let snapshot = "missionControlStandaloneSnapshot"
    }

    @Published var tasks: [MissionTask]
    @Published var pipeline: [PipelineItem]
    @Published var schedules: [ScheduleItem]
    @Published var activity: [ActivityEntry]

    init() {
        if let data = UserDefaults.standard.data(forKey: Keys.snapshot),
           let snapshot = try? JSONDecoder().decode(MissionSnapshot.self, from: data) {
            tasks = snapshot.tasks
            pipeline = snapshot.pipeline
            schedules = snapshot.schedules
            activity = snapshot.activity
        } else {
            let seed = Self.seedData()
            tasks = seed.tasks
            pipeline = seed.pipeline
            schedules = seed.schedules
            activity = seed.activity
            persist()
        }
    }

    var activeTasksCount: Int {
        tasks.filter { $0.status == .inProgress }.count
    }

    var publishedCount: Int {
        pipeline.filter { $0.stage == .published }.count
    }

    func addTask(title: String, assignee: String, status: MissionTaskStatus) {
        let item = MissionTask(id: UUID(), title: title, assignee: assignee, status: status, updatedAt: .now)
        tasks.insert(item, at: 0)
        addActivity("\(assignee) added task: \(title)")
        persist()
    }

    func updateTask(_ task: MissionTask, assignee: String, status: MissionTaskStatus) {
        guard let index = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        tasks[index].assignee = assignee
        tasks[index].status = status
        tasks[index].updatedAt = .now
        persist()
    }

    func addPipelineItem(title: String, assignee: String, stage: PipelineStage, idea: String, script: String) {
        let item = PipelineItem(
            id: UUID(),
            title: title,
            assignee: assignee,
            stage: stage,
            idea: idea,
            script: script,
            updatedAt: .now
        )
        pipeline.insert(item, at: 0)
        addActivity("\(assignee) added content item: \(title)")
        persist()
    }

    func updatePipelineItem(_ item: PipelineItem, assignee: String, stage: PipelineStage) {
        guard let index = pipeline.firstIndex(where: { $0.id == item.id }) else { return }
        pipeline[index].assignee = assignee
        pipeline[index].stage = stage
        pipeline[index].updatedAt = .now
        persist()
    }

    func addSchedule(title: String, assignee: String, kind: ScheduleKind, status: ScheduleStatus, nextRunAt: Date, notes: String) {
        let item = ScheduleItem(
            id: UUID(),
            title: title,
            assignee: assignee,
            kind: kind,
            status: status,
            nextRunAt: nextRunAt,
            notes: notes,
        )
        schedules.insert(item, at: 0)
        addActivity("\(assignee) scheduled: \(title)")
        persist()
    }

    func updateSchedule(_ item: ScheduleItem, assignee: String, status: ScheduleStatus) {
        guard let index = schedules.firstIndex(where: { $0.id == item.id }) else { return }
        schedules[index].assignee = assignee
        schedules[index].status = status
        persist()
    }

    private func addActivity(_ message: String) {
        activity.insert(ActivityEntry(id: UUID(), message: message, createdAt: .now), at: 0)
        if activity.count > 120 {
            activity = Array(activity.prefix(120))
        }
    }

    private func persist() {
        let snapshot = MissionSnapshot(tasks: tasks, pipeline: pipeline, schedules: schedules, activity: activity)
        if let data = try? JSONEncoder().encode(snapshot) {
            UserDefaults.standard.set(data, forKey: Keys.snapshot)
        }
        objectWillChange.send()
    }

    private static func seedData() -> MissionSnapshot {
        let now = Date()
        let calendar = Calendar.current

        return MissionSnapshot(
            tasks: [
                MissionTask(id: UUID(), title: "Run mobile mission control", assignee: "Me", status: .inProgress, updatedAt: now),
                MissionTask(id: UUID(), title: "Review content queue", assignee: "Copilot", status: .todo, updatedAt: now),
                MissionTask(id: UUID(), title: "Close blocked publishing items", assignee: "Ops Agent", status: .blocked, updatedAt: now),
            ],
            pipeline: [
                PipelineItem(id: UUID(), title: "Weekly roadmap", assignee: "Me", stage: .outline, idea: "Mobile-first mission planning.", script: "Summarize priorities, owners, and ship dates.", updatedAt: now),
                PipelineItem(id: UUID(), title: "Launch update", assignee: "Copilot", stage: .scripting, idea: "Explain the new standalone iPhone app.", script: "Show dashboard, tasks, schedule, and activity on-device.", updatedAt: now),
            ],
            schedules: [
                ScheduleItem(id: UUID(), title: "Daily mission sync", assignee: "Copilot", kind: .scheduled, status: .planned, nextRunAt: calendar.date(byAdding: .hour, value: 2, to: now) ?? now, notes: "Review tasks and priorities."),
                ScheduleItem(id: UUID(), title: "Content review", assignee: "Me", kind: .scheduled, status: .planned, nextRunAt: calendar.date(byAdding: .day, value: 1, to: now) ?? now, notes: "Approve next publishing batch."),
            ],
            activity: [
                ActivityEntry(id: UUID(), message: "Mission Control is now available directly on iPhone.", createdAt: now),
                ActivityEntry(id: UUID(), message: "Local persistence is active for tasks, content, and schedules.", createdAt: now),
            ]
        )
    }
}