import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--text-primary)', borderRadius: '4px' }}></div>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>SpeakEasy</span>
                </div>
                {/* Links removed as requested */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/dashboard" className="btn-secondary" style={{ border: 'none' }}>Log in</Link>
                    <Link to="/dashboard" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container animate-enter" style={{ textAlign: 'center', padding: '8rem 2rem 6rem' }}>
                <div className="animate-enter delay-100" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem' }}>
                    New: AI Coaching 2.0 &rarr;
                </div>
                <h1 className="animate-enter delay-200" style={{ fontSize: '4.5rem', letterSpacing: '-0.04em', marginBottom: '2rem', lineHeight: '1.1' }}>
                    Master the art of <br />
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>public speaking.</span>
                </h1>
                <p className="animate-enter delay-300" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                    Your personal AI coach for impromptu speaking, presentations, and communication skills. Real-time feedback, zero judgement.
                </p>
                <div className="animate-enter delay-400" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/dashboard" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Start Practicing Free</Link>
                    {/* View Demo button removed as requested */}
                </div>
            </header>

            {/* Feature Grid (Bento Style) */}
            <section className="container animate-enter delay-500" style={{ padding: '4rem 2rem' }}>
                <div className="grid-bento">
                    {/* Large Card */}
                    <div className="card col-span-8" style={{ background: 'var(--bg-secondary)', border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '350px' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Real-time Analysis</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '80%', fontSize: '1.1rem' }}>Get instant feedback on your pace, volume, and filler words while you speak. It's like having a coach in your ear.</p>
                        {/* Mock UI Element */}
                        <div style={{ marginTop: '2.5rem', background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: 'fit-content', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', animation: 'pulse-soft 2s infinite' }}></span>
                            <span style={{ fontWeight: '600', fontSize: '1rem' }}>Slow Down</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>165 wpm</span>
                        </div>
                    </div>

                    {/* Side Card */}
                    <div className="card col-span-4" style={{ background: 'var(--accent-orange-bg)', border: 'none' }}>
                        <h3 style={{ color: 'var(--accent-orange)' }}>AI Drills</h3>
                        <p style={{ fontSize: '1.1rem', marginTop: '0.75rem', color: '#B5600B' }}>Never run out of things to say. Generate unlimited impromptu topics.</p>
                        <div style={{ marginTop: '3rem', fontSize: '3rem' }}>🎯</div>
                    </div>

                    {/* Bottom Cards */}
                    <div className="card col-span-4">
                        <h4>Tone Analysis</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Understand how you sound to others.</p>
                    </div>
                    <div className="card col-span-4">
                        <h4>Progress Tracking</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Visualize your improvement over time.</p>
                    </div>
                    <div className="card col-span-4">
                        <h4>Private & Secure</h4>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Your data never leaves your device.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
