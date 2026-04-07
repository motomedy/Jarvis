import SwiftUI


struct MailMessage: Identifiable {
    let id = UUID()
    let sender: String
    let subject: String
    let date: Date
    let body: String
}

let sampleMails: [MailMessage] = [
    MailMessage(sender: "ceo@company.com", subject: "Welcome to JARVIS!", date: Date(), body: "Thank you for trying the JARVIS Assistant app."),
    MailMessage(sender: "team@company.com", subject: "Meeting Reminder", date: Date().addingTimeInterval(-86400), body: "Don't forget our meeting tomorrow at 10am."),
    MailMessage(sender: "noreply@service.com", subject: "Your Subscription", date: Date().addingTimeInterval(-172800), body: "Your subscription is active.")
]

struct MailView: View {
    @State private var selectedMail: MailMessage?

    var body: some View {
        NavigationView {
            List(sampleMails) { mail in
                Button(action: { selectedMail = mail }) {
                    VStack(alignment: .leading) {
                        Text(mail.subject).font(.headline)
                        Text(mail.sender).font(.subheadline).foregroundColor(.secondary)
                        Text(mail.date, style: .date).font(.caption).foregroundColor(.gray)
                    }
                }
            }
            .navigationTitle("Mail")
            .sheet(item: $selectedMail) { mail in
                VStack(alignment: .leading, spacing: 16) {
                    Text(mail.subject).font(.title2).bold()
                    Text("From: \(mail.sender)").font(.subheadline)
                    Text(mail.date, style: .date).font(.caption)
                    Divider()
                    Text(mail.body)
                    Spacer()
                    Button("Close") { selectedMail = nil }
                        .buttonStyle(.borderedProminent)
                }
                .padding()
            }
        }
    }
}

struct MailView_Previews: PreviewProvider {
    static var previews: some View {
        MailView()
    }
}
