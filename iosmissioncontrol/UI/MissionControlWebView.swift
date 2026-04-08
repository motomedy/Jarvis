import SwiftUI
import WebKit

struct MissionControlWebView: UIViewRepresentable {
    let apiBaseURL: URL
    @Binding var isLoading: Bool
    @Binding var lastErrorMessage: String?
    @Binding var reloadToken: Int

    final class Coordinator: NSObject, WKNavigationDelegate {
        @Binding var isLoading: Bool
        @Binding var lastErrorMessage: String?
        var lastReloadToken = 0

        init(isLoading: Binding<Bool>, lastErrorMessage: Binding<String?>) {
            _isLoading = isLoading
            _lastErrorMessage = lastErrorMessage
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            isLoading = true
            lastErrorMessage = nil
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            isLoading = false
        }

        func webView(
            _ webView: WKWebView,
            didFailProvisionalNavigation navigation: WKNavigation!,
            withError error: Error
        ) {
            let nsError = error as NSError
            if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
                return
            }
            isLoading = false
            lastErrorMessage = error.localizedDescription
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            let nsError = error as NSError
            if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
                return
            }
            isLoading = false
            lastErrorMessage = error.localizedDescription
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(isLoading: $isLoading, lastErrorMessage: $lastErrorMessage)
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences.allowsContentJavaScript = true

        let injectedBase = apiBaseURL.absoluteString.replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
        let scriptSource = "window.__MISSION_CONTROL_API_BASE__ = \"\(injectedBase)\";"
        let userScript = WKUserScript(source: scriptSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        config.userContentController.addUserScript(userScript)

        let view = WKWebView(frame: .zero, configuration: config)
        view.navigationDelegate = context.coordinator
        view.scrollView.contentInsetAdjustmentBehavior = .never
        view.allowsBackForwardNavigationGestures = false
        view.isOpaque = false
        view.backgroundColor = .black

        loadMissionControl(in: view)
        return view
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if reloadToken > context.coordinator.lastReloadToken {
            context.coordinator.lastReloadToken = reloadToken
            loadMissionControl(in: webView)
            return
        }

        guard webView.url == nil else { return }
        loadMissionControl(in: webView)
    }

    private func loadMissionControl(in webView: WKWebView) {
        if let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebApp") {
            let directoryURL = indexURL.deletingLastPathComponent()
            webView.loadFileURL(indexURL, allowingReadAccessTo: directoryURL)
            return
        }

        let request = URLRequest(url: apiBaseURL, cachePolicy: .reloadIgnoringLocalCacheData)
        webView.load(request)
    }
}
