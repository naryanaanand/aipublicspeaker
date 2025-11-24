import React from 'react';

const SessionReport = ({ data, onClose }) => {
    if (!data) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
            zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
                padding: '2rem', position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem'
                    }}
                >
                    &times;
                </button>

                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Session Analysis</h2>
                    <div style={{
                        display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '2rem',
                        background: data.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : data.score >= 60 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: data.score >= 80 ? '#10b981' : data.score >= 60 ? '#eab308' : '#ef4444',
                        fontWeight: '700', fontSize: '1.2rem'
                    }}>
                        Score: {data.score}/100
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tone</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{data.tone}</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Summary</h3>
                        <p>{data.summary}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)' }}>
                        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Strengths</h3>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {data.strengths.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Improvements</h3>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            {data.improvements.map((item, i) => (
                                <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {data.rephrasing && data.rephrasing.length > 0 && (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Smart Rephrasing</h3>
                        {data.rephrasing.map((item, i) => (
                            <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', textDecoration: 'line-through' }}>"{item.original}"</p>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>&rarr; "{item.better}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionReport;
