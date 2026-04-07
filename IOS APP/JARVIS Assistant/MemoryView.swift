import SwiftUI


struct MemoryItem: Identifiable, Codable {
    let id = UUID()
    var content: String
}

struct MemoryView: View {
    @State private var memories: [MemoryItem] = []
    @State private var newMemory = ""

    var body: some View {
        NavigationView {
            VStack {
                if memories.isEmpty {
                    Text("No memories yet.")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    List {
                        ForEach(memories) { memory in
                            HStack {
                                Text(memory.content)
                                Spacer()
                                Button(role: .destructive) {
                                    memories.removeAll { $0.id == memory.id }
                                } label: {
                                    Image(systemName: "trash")
                                }
                            }
                        }
                    }
                }
                HStack {
                    TextField("New memory", text: $newMemory)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    Button("Add") {
                        guard !newMemory.isEmpty else { return }
                        memories.append(MemoryItem(content: newMemory))
                        newMemory = ""
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
            .navigationTitle("Memory")
        }
    }
}

struct MemoryView_Previews: PreviewProvider {
    static var previews: some View {
        MemoryView()
    }
}
