import Foundation

final class AppSettings: ObservableObject {
    private enum Keys {
        static let missionControlURL = "missionControlURL"
    }

    private static let fallbackURL = "http://192.168.178.31:5182"

    @Published var missionControlURL: String {
        didSet {
            UserDefaults.standard.set(missionControlURL, forKey: Keys.missionControlURL)
        }
    }

    init() {
        let bundledDefaultURL = Bundle.main.object(forInfoDictionaryKey: "MissionControlDefaultURL") as? String
        let defaultURL = bundledDefaultURL ?? Self.fallbackURL
        let storedURL = UserDefaults.standard.string(forKey: Keys.missionControlURL)

#if targetEnvironment(simulator)
        missionControlURL = storedURL ?? "http://localhost:5182"
#else
        if let storedURL, !Self.isLoopbackURL(storedURL) {
            missionControlURL = storedURL
        } else {
            missionControlURL = defaultURL
            UserDefaults.standard.set(defaultURL, forKey: Keys.missionControlURL)
        }
#endif
    }

    var url: URL? {
        let trimmed = missionControlURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }

        if trimmed.hasPrefix("http://") || trimmed.hasPrefix("https://") {
            return URL(string: trimmed)
        }

        return URL(string: "http://\(trimmed)")
    }

    private static func isLoopbackURL(_ value: String) -> Bool {
        let normalized: String
        if value.hasPrefix("http://") || value.hasPrefix("https://") {
            normalized = value
        } else {
            normalized = "http://\(value)"
        }

        guard let host = URL(string: normalized)?.host?.lowercased() else { return false }
        return host == "localhost" || host == "127.0.0.1"
    }
}
