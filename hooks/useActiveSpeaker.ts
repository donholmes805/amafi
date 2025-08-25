import { useState, useEffect, useRef } from 'react';

const SPEAKING_THRESHOLD = 10; // Sensitivity for speaking detection (0-255). Higher is less sensitive.
const SILENCE_DELAY = 1500; // ms to wait before declaring silence

export const useActiveSpeaker = (stream: MediaStream | null): boolean => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!stream || stream.getAudioTracks().length === 0) {
            setIsSpeaking(false);
            return;
        }

        if (!audioContextRef.current) audioContextRef.current = new window.AudioContext();
        const audioContext = audioContextRef.current;
        
        if (!analyserRef.current) {
            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 512;
            analyserRef.current.smoothingTimeConstant = 0.1;
        }
        const analyser = analyserRef.current;

        if (!sourceRef.current || sourceRef.current.mediaStream.id !== stream.id) {
            sourceRef.current = audioContext.createMediaStreamSource(stream);
            sourceRef.current.connect(analyser);
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkSpeaking = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

            if (average > SPEAKING_THRESHOLD) {
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }
                if (!isSpeaking) setIsSpeaking(true);
            } else {
                if (isSpeaking && !silenceTimerRef.current) {
                    silenceTimerRef.current = window.setTimeout(() => {
                        setIsSpeaking(false);
                        silenceTimerRef.current = null;
                    }, SILENCE_DELAY);
                }
            }
            animationFrameIdRef.current = requestAnimationFrame(checkSpeaking);
        };

        checkSpeaking();

        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            
            // Do not close the audio context, as it can be reused.
            sourceRef.current = null;
            setIsSpeaking(false); // Reset on stream change
        };
    }, [stream, isSpeaking]);

    return isSpeaking;
};
