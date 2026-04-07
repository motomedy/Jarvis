import SwiftUI


struct Note: Identifiable, Codable {
    let id = UUID()
    var text: String
}

struct NotesView: View {
    @State private var notes: [Note] = []
    @State private var newNoteText = ""
    @State private var editingNote: Note?
    @State private var editingText = ""

    var body: some View {
        NavigationView {
            VStack {
                if notes.isEmpty {
                    Text("No notes yet.")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    List {
                        ForEach(notes) { note in
                            HStack {
                                Text(note.text)
                                Spacer()
                                Button("Edit") {
                                    editingNote = note
                                    editingText = note.text
                                }
                                .buttonStyle(.bordered)
                                Button(role: .destructive) {
                                    notes.removeAll { $0.id == note.id }
                                } label: {
                                    Image(systemName: "trash")
                                }
                            }
                        }
                    }
                }
                HStack {
                    TextField("New note", text: $newNoteText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    Button("Add") {
                        guard !newNoteText.isEmpty else { return }
                        notes.append(Note(text: newNoteText))
                        newNoteText = ""
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
            .navigationTitle("Notes")
            .sheet(item: $editingNote) { note in
                VStack(spacing: 20) {
                    Text("Edit Note").font(.headline)
                    TextField("Note", text: $editingText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                    Button("Save") {
                        if let idx = notes.firstIndex(where: { $0.id == note.id }) {
                            notes[idx].text = editingText
                        }
                        editingNote = nil
                    }
                    .buttonStyle(.borderedProminent)
                    Button("Cancel") {
                        editingNote = nil
                    }
                }
                .padding()
            }
        }
    }
}

struct NotesView_Previews: PreviewProvider {
    static var previews: some View {
        NotesView()
    }
}
