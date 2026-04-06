import SwiftUI

struct ConversationView: View {
    @ObservedObject var recorder = AudioRecorder()
    @State private var conversation: [String] = []
    @State private var isSpeaking = false
    @State private var error: String? = nil
    
    var body: some View {
        VStack(spacing: 20) {
            Text("JARVIS Voice Assistant")
                .font(.title)
                .padding(.top)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(conversation, id: \ .self) { msg in
                        Text(msg)
                            .padding(8)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                    }
                }
            }
            .frame(maxHeight: 300)
            
            if let error = error {
                Text(error)
                    .foregroundColor(.red)
            }
            
            Button(action: {
                if recorder.isRecording {
                    recorder.stopRecording()
                } else {
                    recorder.startRecording()
                }
            }) {
                HStack {
                    Image(systemName: recorder.isRecording ? "stop.circle" : "mic.circle")
                        .font(.system(size: 32))
                    Text(recorder.isRecording ? "Stop Recording" : "Start Talking")
                        .font(.headline)
                }
                .padding()
                .background(recorder.isRecording ? Color.red.opacity(0.2) : Color.blue.opacity(0.2))
                .cornerRadius(12)
            }
            .accessibilityLabel(recorder.isRecording ? "Stop Recording" : "Start Talking")
            .disabled(isSpeaking)
            
            Spacer()
        }
        .padding()
        .onChange(of: recorder.recordedData) { data in
            if let audioData = data {
                sendAudioToBackend(audioData)
            }
        }
    }
    
    func sendAudioToBackend(_ audioData: Data) {
        // Save audio to temp file for upload
        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("recording.m4a")
        do { try audioData.write(to: tempURL) } catch { error = "Failed to save audio"; return }
        VoiceAssistantAPI.shared.uploadAudioForTranscription(audioURL: tempURL) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let transcript):
                    conversation.append("You: \(transcript)")
                    // Play TTS for the transcript
                    isSpeaking = true
                    VoiceAssistantAPI.shared.playTTS(text: transcript) { ttsError in
                        DispatchQueue.main.async {
                            isSpeaking = false
                            if let ttsError = ttsError {
                                error = "TTS error: \(ttsError.localizedDescription)"
                            } else {
                                conversation.append("JARVIS: (Spoken reply)")
                            }
                        }
                    }
                case .failure(let err):
                    error = err.localizedDescription
                }
            }
        }
    }
}

struct ConversationView_Previews: PreviewProvider {
    static var previews: some View {
        ConversationView()
    }
}
