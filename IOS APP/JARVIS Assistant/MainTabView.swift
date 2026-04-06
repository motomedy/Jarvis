import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            VoiceChatView()
                .tabItem {
                    Image(systemName: "mic.fill")
                    Text("Voice Chat")
                }
            CalendarView()
                .tabItem {
                    Image(systemName: "calendar")
                    Text("Calendar")
                }
            NotesView()
                .tabItem {
                    Image(systemName: "note.text")
                    Text("Notes")
                }
            MailView()
                .tabItem {
                    Image(systemName: "envelope")
                    Text("Mail")
                }
            MemoryView()
                .tabItem {
                    Image(systemName: "archivebox")
                    Text("Memory")
                }
        }
    }
}

struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
    }
}
