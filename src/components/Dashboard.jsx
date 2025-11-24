import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('speech_history') || '[]');
        setHistory(saved);
    }, []);

    const averageScore = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length)
        : 0;

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this session?")) {
            const updatedHistory = history.filter(session => session.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('speech_history', JSON.stringify(updatedHistory));
        }
    };

    return (
        <div className="dashboard container" style={{ padding: '4rem 2rem' }}>
            {/* Header */}
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👤</div>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>Welcome back</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginLeft: '3rem' }}>Here is your progress overview.</p>
                </div>
                <Link to="/practice" className="btn-primary">
                    <span>+ New Session</span>
                </Link>
            </header>

            {/* Bento Grid */}
            <div className="grid-bento">
                {/* Main Stats */}
                <div className="card col-span-4 animate-enter delay-100">
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Avg Score</h3>
                    <div style={{ fontSize: '4rem', fontWeight: '700', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                        {averageScore}
                        <span style={{ fontSize: '1.25rem', color: 'var(--text-tertiary)', fontWeight: '400', marginLeft: '0.5rem' }}>/ 100</span>
                    </div>
                </div>

                <div className="card col-span-4 animate-enter delay-200">
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Sessions</h3>
                    <div style={{ fontSize: '4rem', fontWeight: '700', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                        {history.length}
                    </div>
                </div>

                <div className="card col-span-4 animate-enter delay-300" style={{ background: 'var(--accent-green-bg)', borderColor: 'transparent' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Trend</h3>
                    <div style={{ fontSize: '4rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--accent-green)', letterSpacing: '-0.02em' }}>
                        ↗ 12%
                    </div>
                </div>

                {/* Recent History List */}
                <div className="card col-span-8 animate-enter delay-400" style={{ minHeight: '400px' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Recent Sessions</h3>

                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>
                            No sessions yet. Start practicing to see data here.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {history.map((session, index) => (
                                <div key={session.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    border: '1px solid transparent'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.transform = 'scale(1.01)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            📄
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{session.tone || "Untitled Session"}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{session.date} • {session.duration || "1 min"}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>WPM</div>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{session.wpm}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
                                            <div style={{ fontWeight: '700', fontSize: '1.25rem', color: session.score > 80 ? 'var(--accent-green)' : 'var(--text-primary)' }}>{session.score}</div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(session.id, e)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-tertiary)',
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--accent-red)';
                                                e.currentTarget.style.background = 'var(--accent-red-bg)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'var(--text-tertiary)';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                            title="Delete Session"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions / Tips */}
                <div className="col-span-4 animate-enter delay-500" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Weekly Challenge</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            Record a 2-minute pitch about your favorite book without using "um" or "uh".
                        </p>
                        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Accept Challenge</button>
                    </div>

                    <div className="card" style={{ flex: 1, background: 'var(--bg-secondary)', border: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Pro Tips</h3>
                        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>Pause instead of using filler words.</li>
                            <li>Vary your tone to keep engagement.</li>
                            <li>Make eye contact with the camera.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
