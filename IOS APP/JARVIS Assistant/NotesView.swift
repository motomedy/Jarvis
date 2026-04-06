import SwiftUI

struct NotesView: View {
    var body: some View {
        VStack {
            Text("Notes feature coming soon.")
                .foregroundColor(.secondary)
                .padding()
            Spacer()
        }
        .navigationTitle("Notes")
    }
}

struct NotesView_Previews: PreviewProvider {
    static var previews: some View {
        NotesView()
    }
}
