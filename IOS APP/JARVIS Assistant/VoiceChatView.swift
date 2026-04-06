import SwiftUI

struct VoiceChatView: View {
    @StateObject private var recorder = AudioRecorder()
    @State private var messages: [String] = ["Welcome to JARVIS Assistant!"]
    @State private var inputText: String = ""
    @State private var isSending = false

    var body: some View {
        VStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    ForEach(messages, id: \ .self) { msg in
                        Text(msg)
                            .padding(10)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                }
            }
            .padding()
            Spacer()
            HStack {
                Button(action: {
                    if recorder.isRecording {
                        recorder.stopRecording { data in
                            guard let data = data else { return }
                            isSending = true
                            JarvisAPI.shared.sendAudioData(data) { response in
                                messages.append("JARVIS: " + response)
                                isSending = false
                            }
                        }
                    } else {
                        recorder.startRecording()
                    }
                }) {
                    Image(systemName: recorder.isRecording ? "mic.circle.fill" : "mic.circle")
                        .resizable()
                        .frame(width: 48, height: 48)
                        .foregroundColor(recorder.isRecording ? .red : .blue)
                }
                .padding()
                .disabled(isSending)
                TextField("Type a message...", text: $inputText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(minHeight: 44)
                Button("Send") {
                    let userMsg = inputText
                    messages.append("You: " + userMsg)
                    inputText = ""
                    isSending = true
                    JarvisAPI.shared.sendText(userMsg) { response in
                        messages.append("JARVIS: " + response)
                        isSending = false
                    }
                }
                .disabled(inputText.isEmpty || isSending)
            }
            .padding(.horizontal)
        }
        .navigationTitle("Voice Chat")
    }
}

struct VoiceChatView_Previews: PreviewProvider {
    static var previews: some View {
        VoiceChatView()
    }
}
