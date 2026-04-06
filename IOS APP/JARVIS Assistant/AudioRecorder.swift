import AVFoundation
import Foundation

class AudioRecorder: NSObject, ObservableObject {
    @Published var isRecording = false
    private var audioRecorder: AVAudioRecorder?
    private var audioSession: AVAudioSession { AVAudioSession.sharedInstance() }
    private var audioFilename: URL {
        let paths = FileManager.default.temporaryDirectory
        return paths.appendingPathComponent("recording.m4a")
    }
    
    func startRecording() {
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 12000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        do {
            try audioSession.setCategory(.playAndRecord, mode: .default)
            try audioSession.setActive(true)
            audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
            audioRecorder?.record()
            isRecording = true
        } catch {
            print("Failed to start recording: \(error)")
            isRecording = false
        }
    }
    
    func stopRecording(completion: @escaping (Data?) -> Void) {
        audioRecorder?.stop()
        isRecording = false
        do {
            let data = try Data(contentsOf: audioFilename)
            completion(data)
        } catch {
            print("Failed to get audio data: \(error)")
            completion(nil)
        }
    }
}
