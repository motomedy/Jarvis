import SwiftUI
import AVFoundation


struct ContentView: View {
    @StateObject private var recorder = AudioRecorder()
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
                    ForEach(conversation, id: \.self) { msg in
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
        .onChange(of: recorder.recordedData) { newData in
            struct ContentView: View {
                @StateObject private var recorder = AudioRecorder()
                @State private var isRecording = false
                @State private var transcript = ""
                @State private var isSpeaking = false
                @State private var conversation: [String] = []
                @State private var error: String? = nil
                @State private var selectedTab = 0

                var body: some View {
                    TabView(selection: $selectedTab) {
                        // Voice Assistant Tab
                        VStack(spacing: 20) {
                            Text("JARVIS Voice Assistant")
                                .font(.title)
                                .padding(.top)

                            ScrollView {
                                VStack(alignment: .leading, spacing: 8) {
                                    ForEach(conversation, id: \.self) { msg in
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
                        .onChange(of: recorder.recordedData) { newData in
                            if let data = newData {
                                // ...existing code...
                            }
                        }
                        .tabItem {
                            Image(systemName: "mic")
                            Text("Assistant")
                        }
                        .tag(0)

                        // Web Dashboard Tab
                        WebDashboardView(urlString: "http://YOUR_MAC_IP:5181")
                            .tabItem {
                                Image(systemName: "calendar")
                                Text("Dashboard")
                            }
                            .tag(1)
                    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
