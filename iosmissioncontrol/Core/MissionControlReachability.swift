import Network
import SwiftUI

final class MissionControlReachability: ObservableObject {
    @Published var isReachable = false
    @Published var statusText = "Checking connection"

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "mission.control.reachability")

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isReachable = path.status == .satisfied
                self?.statusText = path.status == .satisfied ? "Online" : "Offline"
            }
        }
        monitor.start(queue: queue)
    }

    deinit {
        monitor.cancel()
    }
}
