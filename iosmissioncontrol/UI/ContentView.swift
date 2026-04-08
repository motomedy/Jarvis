import SwiftUI

private enum MissionPage: Int, CaseIterable {
	case home
	case tasks
	case pipeline
	case schedule
	case activity

	var title: String {
		switch self {
		case .home: return "Home"
		case .tasks: return "Tasks"
		case .pipeline: return "Pipeline"
		case .schedule: return "Schedule"
		case .activity: return "Activity"
		}
	}
}

struct ContentView: View {
	@EnvironmentObject private var store: MissionControlStore
	@StateObject private var reachability = MissionControlReachability()

	@State private var selectedPage: MissionPage = .home

	var body: some View {
		ZStack(alignment: .top) {
			TabView(selection: $selectedPage) {
				homePage.tag(MissionPage.home)
				tasksPage.tag(MissionPage.tasks)
				pipelinePage.tag(MissionPage.pipeline)
				schedulePage.tag(MissionPage.schedule)
				activityPage.tag(MissionPage.activity)
			}
			.tabViewStyle(.page(indexDisplayMode: .never))
			.ignoresSafeArea()

			topOverlay
		}
	}

	private var topOverlay: some View {
		VStack(spacing: 8) {
			HStack {
				Text("Mission Control")
					.font(.headline)
				Spacer()
				Text(selectedPage.title)
					.font(.subheadline.weight(.semibold))
					.foregroundStyle(.secondary)
			}

			HStack(spacing: 8) {
				ForEach(MissionPage.allCases, id: \.rawValue) { page in
					Capsule()
						.fill(page == selectedPage ? Color.accentColor : Color.secondary.opacity(0.22))
						.frame(width: page == selectedPage ? 24 : 8, height: 8)
				}
			}
			.frame(maxWidth: .infinity, alignment: .leading)
		}
		.padding(.horizontal, 16)
		.padding(.top, 10)
		.padding(.bottom, 12)
		.background(.ultraThinMaterial)
	}

	private var homePage: some View {
		ScrollView {
			VStack(alignment: .leading, spacing: 14) {
				Color.clear.frame(height: 84)

				statCard("Tasks", "\(store.tasks.count)", .blue)
				statCard("In Progress", "\(store.activeTasksCount)", .orange)
				statCard("Pipeline", "\(store.pipeline.count)", .purple)
				statCard("Published", "\(store.publishedCount)", .green)

				VStack(alignment: .leading, spacing: 8) {
					Text("Connectivity")
						.font(.headline)
					Label(reachability.statusText, systemImage: reachability.isReachable ? "wifi" : "wifi.slash")
						.foregroundStyle(reachability.isReachable ? .green : .orange)
					Text("Swipe left and right for full-screen pages")
						.font(.caption)
						.foregroundStyle(.secondary)
				}
				.padding(14)
				.background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 16))
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
		}
	}

	private var tasksPage: some View {
		NavigationStack {
			List {
				ForEach(store.tasks) { task in
					VStack(alignment: .leading, spacing: 6) {
						Text(task.title).font(.headline)
						Text("\(task.assignee) • \(task.status.title)")
							.font(.subheadline)
							.foregroundStyle(.secondary)
					}
					.padding(.vertical, 4)
				}
			}
			.listStyle(.plain)
			.safeAreaInset(edge: .top) { Color.clear.frame(height: 72) }
		}
	}

	private var pipelinePage: some View {
		NavigationStack {
			List {
				ForEach(store.pipeline) { item in
					VStack(alignment: .leading, spacing: 6) {
						Text(item.title).font(.headline)
						Text("\(item.assignee) • \(item.stage.title)")
							.font(.subheadline)
							.foregroundStyle(.secondary)
						if !item.idea.isEmpty {
							Text(item.idea)
								.font(.caption)
								.foregroundStyle(.secondary)
								.lineLimit(2)
						}
					}
					.padding(.vertical, 4)
				}
			}
			.listStyle(.plain)
			.safeAreaInset(edge: .top) { Color.clear.frame(height: 72) }
		}
	}

	private var schedulePage: some View {
		NavigationStack {
			List {
				ForEach(store.schedules.sorted { $0.nextRunAt < $1.nextRunAt }) { item in
					VStack(alignment: .leading, spacing: 6) {
						Text(item.title).font(.headline)
						Text(item.nextRunAt.formatted(date: .abbreviated, time: .shortened))
							.font(.subheadline)
							.foregroundStyle(.secondary)
						Text("\(item.assignee) • \(item.status.title)")
							.font(.caption)
							.foregroundStyle(.secondary)
					}
					.padding(.vertical, 4)
				}
			}
			.listStyle(.plain)
			.safeAreaInset(edge: .top) { Color.clear.frame(height: 72) }
		}
	}

	private var activityPage: some View {
		NavigationStack {
			List {
				ForEach(store.activity) { entry in
					VStack(alignment: .leading, spacing: 6) {
						Text(entry.message)
						Text(entry.createdAt.formatted(date: .abbreviated, time: .shortened))
							.font(.caption)
							.foregroundStyle(.secondary)
					}
					.padding(.vertical, 3)
				}
			}
			.listStyle(.plain)
			.safeAreaInset(edge: .top) { Color.clear.frame(height: 72) }
		}
	}

	private func statCard(_ title: String, _ value: String, _ color: Color) -> some View {
		VStack(alignment: .leading, spacing: 6) {
			Text(title)
				.font(.caption)
				.foregroundStyle(.secondary)
			Text(value)
				.font(.system(size: 28, weight: .bold, design: .rounded))
				.foregroundStyle(color)
		}
		.frame(maxWidth: .infinity, alignment: .leading)
		.padding(14)
		.background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 16))
	}
}
