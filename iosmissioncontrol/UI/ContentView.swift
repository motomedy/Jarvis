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
			hudBackground
				.ignoresSafeArea()

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

	private var hudBackground: some View {
		ZStack {
			LinearGradient(
				colors: [Color(red: 0.03, green: 0.06, blue: 0.1), Color(red: 0.01, green: 0.04, blue: 0.08)],
				startPoint: .top,
				endPoint: .bottom
			)

			RadialGradient(
				colors: [Color.cyan.opacity(0.22), .clear],
				center: .topTrailing,
				startRadius: 20,
				endRadius: 420
			)

			RadialGradient(
				colors: [Color.orange.opacity(0.14), .clear],
				center: .bottomLeading,
				startRadius: 20,
				endRadius: 420
			)
		}
	}

	private var topOverlay: some View {
		VStack(spacing: 10) {
			ViewThatFits(in: .horizontal) {
				HStack {
					VStack(alignment: .leading, spacing: 2) {
						Text("MISSION CONTROL")
							.font(.system(size: 17, weight: .bold, design: .rounded))
							.foregroundStyle(Color(red: 0.82, green: 0.96, blue: 1.0))
						Text("Tactical Mobile Interface")
							.font(.system(size: 11, weight: .medium, design: .monospaced))
							.foregroundStyle(.secondary)
					}

					Spacer()

					sectionBadge
				}

				VStack(alignment: .leading, spacing: 6) {
					VStack(alignment: .leading, spacing: 2) {
						Text("MISSION CONTROL")
							.font(.system(size: 16, weight: .bold, design: .rounded))
							.foregroundStyle(Color(red: 0.82, green: 0.96, blue: 1.0))
						Text("Tactical Mobile Interface")
							.font(.system(size: 10, weight: .medium, design: .monospaced))
							.foregroundStyle(.secondary)
					}
					sectionBadge
				}
			}

			ViewThatFits(in: .horizontal) {
				HStack(spacing: 8) {
					pageDots
					Spacer()
					telemetryRow
				}

				VStack(alignment: .leading, spacing: 8) {
					pageDots
					telemetryRow
				}
			}
			.frame(maxWidth: .infinity, alignment: .leading)
		}
		.padding(.horizontal, 16)
		.padding(.top, 8)
		.padding(.bottom, 12)
		.background(Color.black.opacity(0.5))
		.overlay(alignment: .bottom) {
			Rectangle()
				.fill(Color.cyan.opacity(0.28))
				.frame(height: 1)
		}
	}

	private func telemetryPill(_ title: String, _ value: String) -> some View {
		HStack(spacing: 4) {
			Text(title)
				.font(.system(size: 10, weight: .semibold, design: .monospaced))
				.foregroundStyle(.secondary)
			Text(value)
				.font(.system(size: 11, weight: .bold, design: .monospaced))
				.foregroundStyle(Color(red: 0.82, green: 0.96, blue: 1.0))
		}
		.padding(.horizontal, 8)
		.padding(.vertical, 5)
		.background(Color.cyan.opacity(0.1), in: Capsule())
		.overlay {
			Capsule().stroke(Color.cyan.opacity(0.35), lineWidth: 1)
		}
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
				.hudPanel()
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
		}
	}

	private var tasksPage: some View {
		ScrollView {
			LazyVStack(spacing: 10) {
				Color.clear.frame(height: 86)

				ForEach(store.tasks) { task in
					VStack(alignment: .leading, spacing: 6) {
						Text(task.title)
							.font(.headline)
							.foregroundStyle(Color(red: 0.86, green: 0.96, blue: 1.0))

						Text("\(task.assignee) • \(task.status.title)")
							.font(.subheadline)
							.foregroundStyle(.secondary)

						Text(task.updatedAt.formatted(date: .abbreviated, time: .shortened))
							.font(.caption2)
							.foregroundStyle(.secondary)
					}
					.padding(14)
					.hudPanel()
				}
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
		}
	}

	private var pipelinePage: some View {
		ScrollView {
			LazyVStack(spacing: 10) {
				Color.clear.frame(height: 86)

				ForEach(store.pipeline) { item in
					VStack(alignment: .leading, spacing: 6) {
						Text(item.title)
							.font(.headline)
							.foregroundStyle(Color(red: 0.86, green: 0.96, blue: 1.0))

						Text("\(item.assignee) • \(item.stage.title)")
							.font(.subheadline)
							.foregroundStyle(.secondary)

						if !item.idea.isEmpty {
							Text(item.idea)
								.font(.caption)
								.foregroundStyle(.secondary)
								.lineLimit(3)
						}
					}
					.padding(14)
					.hudPanel()
				}
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
		}
	}

	private var schedulePage: some View {
		ScrollView {
			LazyVStack(spacing: 10) {
				Color.clear.frame(height: 86)

				ForEach(store.schedules.sorted { $0.nextRunAt < $1.nextRunAt }) { item in
					VStack(alignment: .leading, spacing: 6) {
						Text(item.title)
							.font(.headline)
							.foregroundStyle(Color(red: 0.86, green: 0.96, blue: 1.0))

						Text(item.nextRunAt.formatted(date: .abbreviated, time: .shortened))
							.font(.subheadline)
							.foregroundStyle(.secondary)

						Text("\(item.assignee) • \(item.status.title)")
							.font(.caption)
							.foregroundStyle(.secondary)
					}
					.padding(14)
					.hudPanel()
				}
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
		}
	}

	private var activityPage: some View {
		ScrollView {
			LazyVStack(spacing: 10) {
				Color.clear.frame(height: 86)

				ForEach(store.activity) { entry in
					VStack(alignment: .leading, spacing: 6) {
						Text(entry.message)
							.foregroundStyle(Color(red: 0.86, green: 0.96, blue: 1.0))
						Text(entry.createdAt.formatted(date: .abbreviated, time: .shortened))
							.font(.caption)
							.foregroundStyle(.secondary)
					}
					.padding(14)
					.hudPanel()
				}
			}
			.padding(.horizontal, 16)
			.padding(.bottom, 24)
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
		.hudPanel()
	}

	private var sectionBadge: some View {
		Text(selectedPage.title)
			.font(.system(size: 12, weight: .bold, design: .monospaced))
			.padding(.horizontal, 10)
			.padding(.vertical, 6)
			.background(Color.cyan.opacity(0.18), in: Capsule())
			.overlay {
				Capsule().stroke(Color.cyan.opacity(0.45), lineWidth: 1)
			}
	}

	private var pageDots: some View {
		HStack(spacing: 8) {
			ForEach(MissionPage.allCases, id: \.rawValue) { page in
				Capsule()
					.fill(page == selectedPage ? Color.cyan : Color.cyan.opacity(0.18))
					.frame(width: page == selectedPage ? 24 : 8, height: 8)
			}
		}
	}

	private var telemetryRow: some View {
		HStack(spacing: 6) {
			telemetryPill("TASKS", "\(store.tasks.count)")
			telemetryPill("PIPE", "\(store.pipeline.count)")
			telemetryPill("LIVE", reachability.isReachable ? "ON" : "OFF")
		}
	}
}

private extension View {
	func hudPanel() -> some View {
		self
			.background(Color(red: 0.04, green: 0.1, blue: 0.16).opacity(0.8), in: RoundedRectangle(cornerRadius: 16))
			.overlay {
				RoundedRectangle(cornerRadius: 16)
					.stroke(Color.cyan.opacity(0.35), lineWidth: 1)
			}
			.overlay(alignment: .topTrailing) {
				RoundedRectangle(cornerRadius: 2)
					.fill(Color.orange.opacity(0.85))
					.frame(width: 24, height: 2)
					.padding(.top, 8)
					.padding(.trailing, 8)
			}
	}
}
