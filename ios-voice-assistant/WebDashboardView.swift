// WebDashboardView.swift
// JARVIS iOS Voice Assistant
//
// This SwiftUI view embeds the web dashboard (React frontend) in the iOS app using WKWebView.
// Replace YOUR_MAC_IP and PORT with your actual Mac's IP and the running port (e.g., 5181).

import SwiftUI
import WebKit

struct WebDashboardView: UIViewRepresentable {
    let urlString: String

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            webView.load(request)
        }
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        // No-op
    }
}

// Usage Example in ContentView.swift:
// struct ContentView: View {
//     var body: some View {
//         WebDashboardView(urlString: "http://YOUR_MAC_IP:5181")
//     }
// }
