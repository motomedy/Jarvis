import Foundation
import AVFoundation

class AudioRecorder: NSObject, ObservableObject {
    private var audioRecorder: AVAudioRecorder?
    private var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    @Published var isRecording = false
    @Published var recordedData: Data? = nil
    
    func startRecording() {
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 12000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        let url = FileManager.default.temporaryDirectory.appendingPathComponent("recording.m4a")
        do {
            try audioSession.setCategory(.playAndRecord, mode: .default)
            try audioSession.setActive(true)
            audioRecorder = try AVAudioRecorder(url: url, settings: settings)
            audioRecorder?.delegate = self
            audioRecorder?.record()
            isRecording = true
        } catch {
            print("Failed to start recording: \(error)")
            isRecording = false
        }
    }
    
    func stopRecording() {
        audioRecorder?.stop()
        isRecording = false
    }
}

extension AudioRecorder: AVAudioRecorderDelegate {
    func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        if flag {
            let url = recorder.url
            if let data = try? Data(contentsOf: url) {
                recordedData = data
            }
        }
    }
}
