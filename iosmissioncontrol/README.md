# iOS Mission Control App

This folder contains a native SwiftUI iPhone app wrapper for the Mission Control web UI.

## App Features

- Full-screen Mission Control via WKWebView.
- Connection badge (online/offline).
- Loading indicator while the page is opening.
- Error banner when the page cannot be reached.
- URL settings sheet with persistent storage.
- Manual reload button from the top bar.

## Files

- App/MissionControliOSApp.swift: App entry point.
- Core/AppSettings.swift: Persistent URL settings using UserDefaults.
- Core/MissionControlReachability.swift: Basic network reachability state.
- UI/ContentView.swift: Main screen, settings sheet, and connection status UI.
- UI/MissionControlWebView.swift: WKWebView bridge for rendering Mission Control.
- Info.plist: iOS app settings including local HTTP allowance.
- project.yml: XcodeGen manifest to generate an Xcode project.
- Makefile: Convenience commands for project generation/open.

## Generate And Run

1. Install XcodeGen (one-time): `brew install xcodegen`
2. From this folder: `make generate`
3. Open the project: `make open`
4. Select an iPhone simulator or your connected iPhone.
5. Run Mission Control web app in this repo on port 5182.
6. Launch the iOS app from Xcode.

If you prefer manual setup, you can still create a blank SwiftUI iOS app in Xcode and drag in the `App`, `Core`, and `UI` folders.

## URL Setup

- iOS simulator: `http://localhost:5182`
- Physical iPhone: `http://<your-mac-lan-ip>:5182`

If your iPhone and Mac are on different networks, the app cannot connect.
