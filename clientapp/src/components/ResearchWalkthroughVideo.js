import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * ResearchWalkthroughVideo
 * - Original Book thumbnail & video background (photo-1456513080510-7bf3a84b82f8)
 * - Complete AI Voiceover Narration ("bolva valo") speaking aloud via Web Speech API
 * - Continuous looping playback without stopping (onEnded loops immediately)
 * - Clean HUD controls with Mute/Unmute toggle, scrub bar & 5 chapter cards
 */
export default function ResearchWalkthroughVideo({ onFeatureClick, t = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const videoRef = useRef(null);

  const guideSteps = useMemo(() => [
    {
      id: 0,
      stepNum: "01",
      title: t.vidStep1Title || "Enter Topic / Prompt",
      time: "00:00 - 00:25",
      icon: "fa-pen-nib",
      badge: "STEP 1: PROMPT",
      instruction: t.vidStep1Desc || "Enter your thesis statement, research question, or literature survey topic in the prompt box.",
      narration: "Step 1: Enter your thesis statement or research topic in the prompt box, or use the in-box microphone for voice input.",
      demoVisual: "typing",
    },
    {
      id: 1,
      stepNum: "02",
      title: t.vidStep2Title || "Connect Academic Sources",
      time: "00:25 - 00:50",
      icon: "fa-book-bookmark",
      badge: "STEP 2: SOURCES",
      instruction: t.vidStep2Desc || "Connect Semantic Scholar (200M+ papers), PubMed, or sync your Zotero & Mendeley libraries.",
      narration: "Step 2: Connect to over 200 million peer-reviewed papers across PubMed, arXiv, IEEE Xplore, and Semantic Scholar.",
      demoVisual: "sources",
    },
    {
      id: 2,
      stepNum: "03",
      title: t.vidStep3Title || "Set Pages & Citation Style",
      time: "00:50 - 01:15",
      icon: "fa-sliders",
      badge: "STEP 3: CONFIG",
      instruction: t.vidStep3Desc || "Select target pages (8 to 80 pgs), citation style (APA 7th, IEEE, Harvard), and language.",
      narration: "Step 3: Choose your target page count from 8 to 80 pages, pick your citation style like APA 7th or IEEE, and language.",
      demoVisual: "config",
    },
    {
      id: 3,
      stepNum: "04",
      title: t.vidStep4Title || "AI Synthesis & Verification",
      time: "01:15 - 01:40",
      icon: "fa-shield-halved",
      badge: "STEP 4: SYNTHESIS",
      instruction: t.vidStep4Desc || "Watch the AI draft full sections with green sentence-level citation verification tags.",
      narration: "Step 4: Watch the AI draft full sections with mathematical equations, Turnitin plagiarism clearance, and verified DOIs.",
      demoVisual: "synthesis",
    },
    {
      id: 4,
      stepNum: "05",
      title: t.vidStep5Title || "Export to PDF & Overleaf",
      time: "01:40 - 02:00",
      icon: "fa-file-arrow-down",
      badge: "STEP 5: EXPORT",
      instruction: t.vidStep5Desc || "Download as print-ready PDF, export directly to Overleaf / LaTeX, or download BibTeX references.",
      narration: "Step 5: Export directly to print-ready PDF, Overleaf LaTeX, defense presentation slides, and interactive citation knowledge graphs.",
      demoVisual: "export",
    },
  ], [t]);

  // AI Voiceover Narration via Browser Web Speech API ("bolva valo")
  const speakStepNarration = useCallback((stepIdx) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isMuted) return;

    const step = guideSteps[stepIdx];
    if (!step || !step.narration) return;

    const utterance = new SpeechSynthesisUtterance(step.narration);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
    );
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  }, [isMuted, guideSteps]);

  // Advance demo steps continuously when playing and speak narration
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % guideSteps.length;
          speakStepNarration(next);
          return next;
        });
      }, 5500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, guideSteps.length, speakStepNarration]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          speakStepNarration(activeStep);
        })
        .catch(() => {
          setIsPlaying(true);
          speakStepNarration(activeStep);
        });
    }
  };

  const selectStep = (stepIdx) => {
    setActiveStep(stepIdx);
    speakStepNarration(stepIdx);
    if (!isPlaying && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 120;
    setProgress((current / duration) * 100);

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    setCurrentTimeStr(
      `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
    );
  };

  // Continuous loop: seamlessly restarts and keeps playing without stopping
  const handleVideoLoop = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      speakStepNarration(activeStep);
    }
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
      {/* Interactive Video Player with Book Thumbnail and Continuous Video */}
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
          onEnded={handleVideoLoop}
        />

        {/* Video Overlay when Paused (Book Thumbnail + Play Button) */}
        {!isPlaying && (
          <div className="video-poster-overlay">
            <div className="video-poster-badge">
              <span className="live-pulse-dot"></span> HD Walkthrough &bull; 02:00
            </div>
            <div className="play-btn-large" title="Click to Play Video with Voiceover">
              <i className="fa-solid fa-play"></i>
            </div>
            <div className="video-poster-text">
              <h3>{t.walkthroughDemoTitle || "How ThesisMate Works (Live Walkthrough)"}</h3>
              <p>{t.walkthroughDemoDesc || "Click Play to watch step-by-step instructions from prompt to verified 80-page PDF with voiceover"}</p>
            </div>
          </div>
        )}

        {/* Live HUD & Voice Narration Overlay when Playing */}
        {isPlaying && (
          <div className="video-hud-overlay" onClick={(e) => e.stopPropagation()}>
            {/* Live Instruction & Voice Narration Banner */}
            <div className="video-instruction-card">
              <div className="instruction-header">
                <span className="instruction-step-pill">
                  <i className={`fa-solid ${currentStepData.icon}`}></i> {currentStepData.badge}
                </span>
                <span className="instruction-time-tag">{currentStepData.time}</span>
              </div>
              <p className="instruction-text">
                <i className="fa-solid fa-volume-high text-green" style={{ marginRight: "6px" }}></i>
                {currentStepData.narration}
              </p>
            </div>

            {/* Live Animated Simulation Tag */}
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

              <span className="hud-time">{currentTimeStr} / 02:00</span>

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

              <button
                className="hud-btn"
                onClick={toggleMute}
                title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
              >
                <i className={`fa-solid ${isMuted ? "fa-volume-xmark" : "fa-volume-high"}`} style={{ color: isMuted ? "#d96b75" : "#1b8a5a" }}></i>
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
                  {isActive && isPlaying ? "Live ▶" : "Watch →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
