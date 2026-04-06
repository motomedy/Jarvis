import SwiftUI

struct MemoryView: View {
    var body: some View {
        VStack {
            Text("Persistent memory coming soon.")
                .foregroundColor(.secondary)
                .padding()
            Spacer()
        }
        .navigationTitle("Memory")
    }
}

struct MemoryView_Previews: PreviewProvider {
    static var previews: some View {
        MemoryView()
    }
}
