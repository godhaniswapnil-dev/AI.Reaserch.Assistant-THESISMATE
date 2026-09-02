import React, { useState, useEffect, useRef } from "react";

export default function ResearchWalkthroughVideo({ onFeatureClick, t }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const videoRef = useRef(null);

  const guideSteps = [
    {
      id: 0,
      stepNum: "01",
      title: t.vidStep1Title,
      time: "00:00 - 02:45",
      icon: "fa-pen-nib",
      badge: "STEP 1: PROMPT",
      instruction: t.vidStep1Desc,
      narration: t.vidStep1Desc,
      demoVisual: "typing",
    },
    {
      id: 1,
      stepNum: "02",
      title: t.vidStep2Title,
      time: "02:45 - 05:30",
      icon: "fa-book-bookmark",
      badge: "STEP 2: SOURCES",
      instruction: t.vidStep2Desc,
      narration: t.vidStep2Desc,
      demoVisual: "sources",
    },
    {
      id: 2,
      stepNum: "03",
      title: t.vidStep3Title,
      time: "05:30 - 08:15",
      icon: "fa-sliders",
      badge: "STEP 3: CONFIG",
      instruction: t.vidStep3Desc,
      narration: t.vidStep3Desc,
      demoVisual: "config",
    },
    {
      id: 3,
      stepNum: "04",
      title: t.vidStep4Title,
      time: "08:15 - 11:00",
      icon: "fa-shield-halved",
      badge: "STEP 4: SYNTHESIS",
      instruction: t.vidStep4Desc,
      narration: t.vidStep4Desc,
      demoVisual: "synthesis",
    },
    {
      id: 4,
      stepNum: "05",
      title: t.vidStep5Title,
      time: "11:00 - 13:00",
      icon: "fa-file-arrow-down",
      badge: "STEP 5: EXPORT",
      instruction: t.vidStep5Desc,
      narration: t.vidStep5Desc,
      demoVisual: "export",
    },
  ];

  // Auto-advance demo steps when video plays
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % guideSteps.length);
      }, 3600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, guideSteps.length]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(true));
    }
  };

  const selectStep = (stepIdx) => {
    setActiveStep(stepIdx);
    if (!isPlaying) {
      togglePlay();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 780;
    setProgress((current / duration) * 100);

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    setCurrentTimeStr(
      `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
    );
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const currentStepData = guideSteps[activeStep];

  return (
    <div className="walkthrough-guide-container">
      {/* Interactive Video Player */}
      <div className="walkthrough-video-wrapper" onClick={togglePlay}>
        <video
          ref={videoRef}
          className="walkthrough-video-element"
          src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1738-large.mp4"
          poster="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop"
          playsInline
          muted={isMuted}
          loop
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Video Overlay when Paused */}
        {!isPlaying && (
          <div className="video-poster-overlay">
            <div className="video-poster-badge">
              <span className="live-pulse-dot"></span> HD Walkthrough &bull; 13:00
            </div>
            <div className="play-btn-large">
              <i className="fa-solid fa-play"></i>
            </div>
            <div className="video-poster-text">
              <h3>{t.walkthroughDemoTitle}</h3>
              <p>{t.walkthroughDemoDesc}</p>
            </div>
          </div>
        )}

        {/* Live HUD & Interactive Step Demo Overlay when Playing */}
        {isPlaying && (
          <div className="video-hud-overlay" onClick={(e) => e.stopPropagation()}>
            {/* Live Instruction Banner */}
            <div className="video-instruction-card">
              <div className="instruction-header">
                <span className="instruction-step-pill">
                  <i className={`fa-solid ${currentStepData.icon}`}></i> {currentStepData.badge}
                </span>
                <span className="instruction-time-tag">{currentStepData.time}</span>
              </div>
              <p className="instruction-text">{currentStepData.narration}</p>
            </div>

            {/* Live Animated UI Simulation Box */}
            <div className="video-simulation-tag">
              {currentStepData.demoVisual === "typing" && (
                <span><i className="fa-solid fa-keyboard"></i> Prompt: "Comparative Analysis of Deep Q-Networks in 6G..."</span>
              )}
              {currentStepData.demoVisual === "sources" && (
                <span><i className="fa-solid fa-database"></i> Scanning 240+ Papers via Semantic Scholar &amp; Zotero...</span>
              )}
              {currentStepData.demoVisual === "config" && (
                <span><i className="fa-solid fa-sliders"></i> Target: 45 Pages &bull; Style: APA 7th &bull; Density: Sentence-level</span>
              )}
              {currentStepData.demoVisual === "synthesis" && (
                <span><i className="fa-solid fa-check-double text-green"></i> 100% Citations Verified against DOI Registries</span>
              )}
              {currentStepData.demoVisual === "export" && (
                <span><i className="fa-solid fa-file-pdf"></i> Compiled: PDF, LaTeX (Overleaf), and BibTeX Ready</span>
              )}
            </div>

            {/* Custom Video Controls Bar */}
            <div className="video-custom-controls">
              <button className="hud-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
              </button>

              <span className="hud-time">{currentTimeStr} / 13:00</span>

              <div
                className="hud-progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current && videoRef.current.duration) {
                    videoRef.current.currentTime = pos * videoRef.current.duration;
                  }
                }}
              >
                <div className="hud-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>

              <button className="hud-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                <i className={`fa-solid ${isMuted ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
              </button>

              <button className="hud-btn" onClick={handleFullscreen} title="Fullscreen">
                <i className="fa-solid fa-expand"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- CLICKABLE STEP-BY-STEP INSTRUCTION CHAPTERS --- */}
      <div className="guide-steps-grid">
        {guideSteps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              className={`guide-step-card ${isActive ? "active" : ""}`}
              onClick={() => selectStep(step.id)}
            >
              <div className="guide-step-top">
                <span className="guide-num">{step.stepNum}</span>
                <span className="guide-icon-box">
                  <i className={`fa-solid ${step.icon}`}></i>
                </span>
              </div>
              <h4 className="guide-step-title">{step.title}</h4>
              <p className="guide-step-desc">{step.instruction}</p>
              <div className="guide-step-footer">
                <span className="guide-time-pill">{step.time}</span>
                <span className="guide-watch-action">
                  {isActive && isPlaying ? "Demo ▶" : "Watch →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
