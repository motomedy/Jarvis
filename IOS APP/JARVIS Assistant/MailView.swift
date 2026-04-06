import SwiftUI

struct MailView: View {
    var body: some View {
        VStack {
            Text("Mail (read-only) coming soon.")
                .foregroundColor(.secondary)
                .padding()
            Spacer()
        }
        .navigationTitle("Mail")
    }
}

struct MailView_Previews: PreviewProvider {
    static var previews: some View {
        MailView()
    }
}
