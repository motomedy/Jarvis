import SwiftUI

@main
struct MissionControliOSApp: App {
    @StateObject private var settings = AppSettings()
    @StateObject private var store = MissionControlStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(settings)
                .environmentObject(store)
        }
    }
}
