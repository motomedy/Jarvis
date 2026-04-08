import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var settings: AppSettings
    @StateObject private var reachability = MissionControlReachability()

    @State private var showSettings = false
    @State private var draftURL = ""

    var body: some View {
        NavigationStack {
            Group {
                if let targetURL = settings.url {
                    MissionControlWebView(url: targetURL)
                        .ignoresSafeArea()
                } else {
                    invalidURLView
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Label(reachability.statusText, systemImage: reachability.isReachable ? "wifi" : "wifi.slash")
                        .font(.caption)
                        .foregroundStyle(reachability.isReachable ? .green : .orange)
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        draftURL = settings.missionControlURL
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape.fill")
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                NavigationStack {
                    Form {
                        Section("Mission Control URL") {
                            TextField("http://192.168.x.x:5182", text: $draftURL)
                                .keyboardType(.URL)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled(true)
                        }

                        Section("Tips") {
                            Text("Use http://localhost:5182 in the iOS simulator.")
                            Text("On a physical iPhone, use your Mac local IP, for example http://192.168.1.45:5182.")
                        }
                    }
                    .navigationTitle("Connection")
                    .toolbar {
                        ToolbarItem(placement: .cancellationAction) {
                            Button("Cancel") { showSettings = false }
                        }
                        ToolbarItem(placement: .confirmationAction) {
                            Button("Save") {
                                settings.missionControlURL = draftURL.trimmingCharacters(in: .whitespacesAndNewlines)
                                showSettings = false
                            }
                            .disabled(draftURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        }
                    }
                }
                .presentationDetents([.medium])
            }
        }
    }

    private var invalidURLView: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.largeTitle)
                .foregroundStyle(.orange)
            Text("Invalid Mission Control URL")
                .font(.headline)
            Text("Open settings and enter a valid URL.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Button("Open Settings") {
                draftURL = settings.missionControlURL
                showSettings = true
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(24)
    }
}
