import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSpeechAnalysis } from '../hooks/useSpeechAnalysis';
import { initializeGemini, analyzeSpeech } from '../services/ai';
import SessionReport from './SessionReport';

const PracticeMode = () => {
    const { isRecording, startRecording, stopRecording, wpm, volume, fillerWordCount, transcript } = useSpeechAnalysis();
    const videoRef = useRef(null);

    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [apiKey, setApiKey] = useState(envApiKey || localStorage.getItem('gemini_api_key') || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [showApiKeyInput, setShowApiKeyInput] = useState(!envApiKey && !apiKey);

    // Drill State
    const [drillTopic, setDrillTopic] = useState(null);
    const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);

    // HUD State
    const [hudMessage, setHudMessage] = useState("");
    const [hudColor, setHudColor] = useState("rgba(55, 53, 47, 0.9)"); // Dark grey for light mode

    useEffect(() => {
        if (envApiKey) {
            initializeGemini(envApiKey);
        } else if (apiKey) {
            initializeGemini(apiKey);
        }
    }, [envApiKey, apiKey]);

    // Smart HUD Logic
    useEffect(() => {
        if (!isRecording) {
            setHudMessage("");
            return;
        }

        const checkMetrics = () => {
            // Pace Check
            if (wpm > 160) {
                setHudMessage("Slow Down");
                setHudColor("rgba(212, 76, 71, 0.95)"); // Red
            } else if (wpm < 100 && wpm > 0) {
                setHudMessage("Pick Up Pace");
                setHudColor("rgba(217, 115, 13, 0.95)"); // Orange
            }
            // Volume Check
            else if (volume < 30 && volume > 0) {
                setHudMessage("Speak Up");
                setHudColor("rgba(217, 115, 13, 0.95)"); // Orange
            }
            // Filler Word Check
            else if (fillerWordCount > 5) {
                setHudMessage("Too Many Fillers");
                setHudColor("rgba(212, 76, 71, 0.95)");
            }
            else {
                setHudMessage("");
            }
        };

        const interval = setInterval(checkMetrics, 1000); // Check every second
        return () => clearInterval(interval);
    }, [isRecording, wpm, volume, fillerWordCount]);

    const handleToggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            const stream = await startRecording();
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
        }
    };

    const handleSaveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            initializeGemini(apiKey);
            setShowApiKeyInput(false);
        }
    };

    const handleAnalyze = async () => {
        if (!transcript) return;

        setIsAnalyzing(true);
        try {
            initializeGemini(apiKey || envApiKey);
            const result = await analyzeSpeech(transcript);
            setReportData(result);

            // Save to History
            const newSession = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                score: result.score,
                wpm: wpm,
                duration: "1 min", // Placeholder
                tone: result.tone
            };

            const history = JSON.parse(localStorage.getItem('speech_history') || '[]');
            localStorage.setItem('speech_history', JSON.stringify([newSession, ...history]));

        } catch (error) {
            console.error(error);
            alert(`Analysis failed: ${error.message}. Check console for details.`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNewDrill = async () => {
        setIsGeneratingDrill(true);
        try {
            initializeGemini(apiKey || envApiKey);
            // Dynamic import to avoid circular dependency issues if any, or just direct import
            const { generateDrill } = await import('../services/ai');
            const topic = await generateDrill();
            setDrillTopic(topic);
        } catch (error) {
            console.error(error);
            alert("Failed to generate drill. Check API Key.");
        } finally {
            setIsGeneratingDrill(false);
        }
    };

    return (
        <div className="practice-mode container" style={{ padding: '2rem 0', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {reportData && <SessionReport data={reportData} onClose={() => setReportData(null)} />}

            {/* Header */}
            <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    &larr; Back to Dashboard
                </Link>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {!envApiKey && (
                        <button
                            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                            className="btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                        >
                            {showApiKeyInput ? 'Close Settings' : 'API Settings'}
                        </button>
                    )}
                    {isRecording && (
                        <div style={{ padding: '0.25rem 0.75rem', background: 'var(--accent-red-bg)', color: 'var(--accent-red)', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 1s infinite' }}></div>
                            Recording
                        </div>
                    )}
                </div>
            </header>

            {showApiKeyInput && (
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="password"
                        placeholder="Enter Google Gemini API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button onClick={handleSaveApiKey} className="btn-primary">Save Key</button>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Get Key</a>
                </div>
            )}

            <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Video Preview Area */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', background: 'black', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!isRecording && <p style={{ color: 'rgba(255,255,255,0.6)', position: 'absolute' }}>Camera Preview</p>}

                    {/* Drill Overlay */}
                    {drillTopic && !isRecording && (
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-lg)',
                            zIndex: 10
                        }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Topic</p>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{drillTopic}</h3>
                            <button onClick={() => setDrillTopic(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>Dismiss</button>
                        </div>
                    )}

                    {/* Smart HUD Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        width: '100%',
                        pointerEvents: 'none',
                        zIndex: 5
                    }}>
                        {hudMessage && (
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '600',
                                color: 'white',
                                background: hudColor,
                                padding: '0.75rem 2rem',
                                borderRadius: '2rem',
                                display: 'inline-block',
                                backdropFilter: 'blur(4px)',
                                animation: 'fadeIn 0.3s ease-out',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}>
                                {hudMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Drill Generator */}
                    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', border: 'none' }}>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', margin: 0 }}>Impromptu Topic</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Generate a random prompt</p>
                        </div>
                        <button
                            onClick={handleNewDrill}
                            disabled={isGeneratingDrill}
                            className="btn-secondary"
                            style={{ fontSize: '0.8rem', background: 'white' }}
                        >
                            {isGeneratingDrill ? '...' : 'Generate'}
                        </button>
                    </div>

                    {/* Metrics Panel */}
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Live Metrics</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Pace</span>
                                <span style={{ fontFamily: 'monospace' }}>{wpm} wpm</span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(wpm / 2, 100)}%`, height: '100%', background: wpm > 160 ? 'var(--accent-red)' : wpm < 100 ? 'var(--accent-orange)' : 'var(--accent-green)', transition: 'width 0.3s' }}></div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Volume</span>
                                <span style={{ fontFamily: 'monospace' }}>{Math.round(volume)} dB</span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${(volume / 255) * 100}%`, height: '100%', background: volume > 200 ? 'var(--accent-red)' : volume < 50 ? 'var(--accent-orange)' : 'var(--accent-green)', transition: 'width 0.1s' }}></div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Filler Words</span>
                                <span style={{ fontFamily: 'monospace', color: fillerWordCount > 5 ? 'var(--accent-red)' : 'inherit' }}>{fillerWordCount}</span>
                            </div>
                        </div>

                        {/* Transcript Preview */}
                        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                            {transcript || "Start speaking to see transcript..."}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', background: isRecording ? 'var(--accent-red)' : 'var(--text-primary)' }}
                            onClick={handleToggleRecording}
                        >
                            {isRecording ? 'Stop Session' : 'Start Recording'}
                        </button>

                        {!isRecording && transcript.length > 10 && (
                            <button
                                className="btn-secondary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PracticeMode;
