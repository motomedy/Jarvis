import SwiftUI


struct CalendarEvent: Identifiable, Codable {
    let id = UUID()
    var title: String
    var date: Date
}

struct CalendarView: View {
    @State private var events: [CalendarEvent] = []
    @State private var showingAddEvent = false
    @State private var newEventTitle = ""
    @State private var newEventDate = Date()

    var body: some View {
        NavigationView {
            VStack {
                if events.isEmpty {
                    Text("No events yet.")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    List(events) { event in
                        VStack(alignment: .leading) {
                            Text(event.title)
                                .font(.headline)
                            Text(event.date, style: .date)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                Spacer()
                Button(action: { showingAddEvent = true }) {
                    Label("Add Event", systemImage: "plus")
                        .padding()
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(8)
                }
                .padding(.bottom)
            }
            .navigationTitle("Calendar")
            .sheet(isPresented: $showingAddEvent) {
                VStack(spacing: 20) {
                    Text("New Event").font(.headline)
                    TextField("Event Title", text: $newEventTitle)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                    DatePicker("Date", selection: $newEventDate, displayedComponents: .date)
                        .datePickerStyle(GraphicalDatePickerStyle())
                        .padding()
                    Button("Add") {
                        guard !newEventTitle.isEmpty else { return }
                        events.append(CalendarEvent(title: newEventTitle, date: newEventDate))
                        newEventTitle = ""
                        newEventDate = Date()
                        showingAddEvent = false
                    }
                    .buttonStyle(.borderedProminent)
                    Button("Cancel") {
                        showingAddEvent = false
                    }
                }
                .padding()
            }
        }
    }
}

struct CalendarView_Previews: PreviewProvider {
    static var previews: some View {
        CalendarView()
    }
}
