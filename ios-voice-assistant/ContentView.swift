import SwiftUI
import AVFoundation

struct ContentView: View {
    @State private var isRecording = false
    @State private var transcript = ""
    @State private var isSpeaking = false
    @State private var conversation: [String] = []
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
                if isRecording {
                    stopRecording()
                } else {
                    startRecording()
                }
            }) {
                HStack {
                    Image(systemName: isRecording ? "stop.circle" : "mic.circle")
                        .font(.system(size: 32))
                    Text(isRecording ? "Stop Recording" : "Start Talking")
                        .font(.headline)
                }
                .padding()
                .background(isRecording ? Color.red.opacity(0.2) : Color.blue.opacity(0.2))
                .cornerRadius(12)
            }
            .accessibilityLabel(isRecording ? "Stop Recording" : "Start Talking")
            .disabled(isSpeaking)
            
            Spacer()
        }
        .padding()
    }
    
    func startRecording() {
        // TODO: Implement audio recording and send to backend
        isRecording = true
        error = nil
    }
    
    func stopRecording() {
        // TODO: Stop recording, upload audio, get transcript, update conversation
        isRecording = false
        // Example: simulate backend response
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            let fakeTranscript = "Hello, how can I help you?"
            transcript = fakeTranscript
            conversation.append("You: \(fakeTranscript)")
            // TODO: Send transcript to backend, get TTS/audio reply
            conversation.append("JARVIS: This is a sample response.")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
