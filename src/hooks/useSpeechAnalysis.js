import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechAnalysis = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [wpm, setWpm] = useState(0);
    const [volume, setVolume] = useState(0);
    const [fillerWordCount, setFillerWordCount] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);

                // Simple WPM calculation
                const words = currentTranscript.trim().split(/\s+/);
                wordCountRef.current = words.length;
                const durationInMinutes = (Date.now() - startTimeRef.current) / 60000;
                if (durationInMinutes > 0) {
                    setWpm(Math.round(wordCountRef.current / durationInMinutes));
                }

                // Simple filler word detection (very basic)
                const fillerWords = ['um', 'uh', 'like', 'you know', 'actually'];
                let count = 0;
                words.forEach(word => {
                    if (fillerWords.includes(word.toLowerCase())) count++;
                });
                setFillerWordCount(count);
            };
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            streamRef.current = stream;

            // Audio Analysis Setup
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                setVolume(average); // 0-255
                if (isRecording) requestAnimationFrame(updateVolume);
            };

            // MediaRecorder Setup for Blob Capture
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };
            mediaRecorderRef.current.start();

            setIsRecording(true);
            startTimeRef.current = Date.now();
            wordCountRef.current = 0;
            setTranscript('');
            setWpm(0);
            setFillerWordCount(0);
            setAudioBlob(null);

            if (recognitionRef.current) recognitionRef.current.start();
            updateVolume();

            return stream; // Return stream for video preview
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        setIsRecording(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
        transcript,
        wpm,
        volume,
        fillerWordCount,
        stream: streamRef.current,
        audioBlob
    };
};
