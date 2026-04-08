import Foundation

final class AppSettings: ObservableObject {
    private enum Keys {
        static let missionControlURL = "missionControlURL"
    }

    @Published var missionControlURL: String {
        didSet {
            UserDefaults.standard.set(missionControlURL, forKey: Keys.missionControlURL)
        }
    }

    init() {
        missionControlURL = UserDefaults.standard.string(forKey: Keys.missionControlURL)
            ?? "http://localhost:5182"
    }

    var url: URL? {
        URL(string: missionControlURL)
    }
}
