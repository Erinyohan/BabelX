from flask import Flask, request, jsonify
from pydub import AudioSegment
from google.cloud import speech
import io
import os

app = Flask(__name__)

# Ensure you set the GOOGLE_APPLICATION_CREDENTIALS in the environment
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "E:\\Mobile Computating\\BabelX\\backend\\credentials\\babelx-58dceff21947.json"

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        file = request.files['file']
        print("📥 Received file:", file.filename, file.content_type)

        # Convert to WAV
        try:
            m4a_audio = AudioSegment.from_file(file, format='m4a')
            m4a_audio = m4a_audio.set_channels(1)  # ✅ Make it mono
            print("✅ Audio loaded, duration:", len(m4a_audio) / 1000, "seconds")
        except Exception as e:
            print("❌ Error reading audio:", str(e))
            return jsonify({"error": f"Audio conversion failed: {str(e)}"}), 400


        wav_io = io.BytesIO()
        m4a_audio.export(wav_io, format='wav')
        wav_io.seek(0)

        # Google Cloud STT
        client = speech.SpeechClient()
        audio = speech.RecognitionAudio(content=wav_io.read())

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=m4a_audio.frame_rate,
            language_code="en-US"
        )

        response = client.recognize(config=config, audio=audio)
        print("🧠 Google response:", response)

        transcript = response.results[0].alternatives[0].transcript if response.results else "No transcription"
        return jsonify({'transcript': transcript})
    except Exception as e:
        print("❌ Error during transcription:", str(e))
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
