import Foundation
import AVFoundation

class VoiceAssistantAPI {
    static let shared = VoiceAssistantAPI()
    private let baseURL = URL(string: "http://your-backend-url")! // Replace with your backend URL

    // Upload audio for speech-to-text
    func uploadAudioForTranscription(audioURL: URL, completion: @escaping (Result<String, Error>) -> Void) {
        let endpoint = baseURL.appendingPathComponent("/api/speech-to-text")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        // Prepare multipart/form-data body
        var body = Data()
        let filename = audioURL.lastPathComponent
        let mimetype = "audio/m4a"
        if let audioData = try? Data(contentsOf: audioURL) {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
            body.append("Content-Type: \(mimetype)\r\n\r\n".data(using: .utf8)!)
            body.append(audioData)
            body.append("\r\n".data(using: .utf8)!)
            body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        }

        request.httpBody = body

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error { completion(.failure(error)); return }
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let transcript = json["transcript"] as? String else {
                completion(.failure(NSError(domain: "InvalidResponse", code: 0)))
                return
            }
            completion(.success(transcript))
        }.resume()
    }

    // Download and play TTS audio
    func playTTS(text: String, completion: ((Error?) -> Void)? = nil) {
        let endpoint = baseURL.appendingPathComponent("/api/tts")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = ["text": text]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error { completion?(error); return }
            guard let data = data else {
                completion?(NSError(domain: "NoData", code: 0))
                return
            }
            // Play audio
            do {
                let player = try AVAudioPlayer(data: data)
                player.play()
                completion?(nil)
            } catch {
                completion?(error)
            }
        }.resume()
    }
}

// Data extension for multipart
extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}
