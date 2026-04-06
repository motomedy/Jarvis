// Placeholder for backend API communication
// Replace with actual WebSocket or HTTP API integration

import Foundation

class JarvisAPI {
    static let shared = JarvisAPI()
    
    func sendAudioData(_ data: Data, completion: @escaping (String) -> Void) {
        // TODO: Implement audio data upload to backend and handle response
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion("[Backend response placeholder]")
        }
    }
    
    func sendText(_ text: String, completion: @escaping (String) -> Void) {
        // TODO: Implement text message send to backend and handle response
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion("[Backend response placeholder]")
        }
    }
}
