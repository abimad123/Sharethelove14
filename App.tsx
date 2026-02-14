
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Frown, Sparkles, Flower2, CheckCircle2, Star, Coffee, Utensils, Zap, Clock } from 'lucide-react';

// Use local references with casting to any to resolve TypeScript errors
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionSpan = motion.span as any;

/**
 * TypewriterText Component
 * Animates text character by character for a "typing" effect.
 */
const TypewriterText = ({ text, className, speed = 0.03, delay = 0 }: { text: string, className?: string, speed?: number, delay?: number }) => {
  const characters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <MotionDiv
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <MotionSpan
          variants={child}
          key={index}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </MotionSpan>
      ))}
    </MotionDiv>
  );
};

// Confetti particle component for celebration
const ConfettiParticle = ({ index }: { index: number }) => {
  const colors = ['#f472b6', '#fb7185', '#fbbf24', '#38bdf8', '#c084fc', '#4ade80'];
  const shapes = ['circle', 'square', 'heart'];
  
  const color = colors[index % colors.length];
  const shape = shapes[index % shapes.length];
  const size = 8 + Math.random() * 12;
  const left = Math.random() * 100;
  const duration = 3 + Math.random() * 4;
  const delay = Math.random() * 2;
  const drift = (Math.random() - 0.5) * 150;

  return (
    <MotionDiv
      initial={{ y: -50, x: `${left}vw`, rotate: 0, opacity: 1 }}
      animate={{ 
        y: '110vh', 
        x: `${left}vw`, 
        translateX: drift,
        rotate: 720,
        opacity: [1, 1, 0] 
      }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: "linear",
        repeat: Infinity 
      }}
      className="absolute pointer-events-none z-50"
      style={{
        width: size,
        height: size,
        backgroundColor: shape !== 'heart' ? color : 'transparent',
        borderRadius: shape === 'circle' ? '50%' : '2px',
      }}
    >
      {shape === 'heart' && <Heart size={size} fill={color} color={color} />}
    </MotionDiv>
  );
};

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [maybeLevel, setMaybeLevel] = useState(0); 
  const [noButtonState, setNoButtonState] = useState({ x: 0, y: 0, rotate: 0, scale: 1 });
  
  // Robust Countdown Logic
  const getTargetDate = () => {
    const now = new Date();
    let target = new Date('2025-02-15T00:00:00');
    if (now > target) {
      target = new Date('2026-02-15T00:00:00');
    }
    return target;
  };

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = getTargetDate();
    const difference = target.getTime() - now.getTime();
    if (difference <= 0) return "00:00:00";
    const hours = Math.floor((difference / (1000 * 60 * 60)));
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Memoize decorative floating elements for the background
  const decorElements = useMemo(() => [...Array(45)].map((_, i) => ({
    id: i,
    type: i % 4 === 0 ? 1 : i % 4 === 1 ? 2 : 0, 
    size: 10 + Math.random() * 35,
    color: [
      'text-rose-200/40', 
      'text-pink-300/30', 
      'text-lavender-200/40', 
      'text-orange-200/30', 
      'text-rose-400/20'
    ][i % 5],
    initialX: Math.random() * 100,
    duration: 25 + Math.random() * 35,
    delay: -Math.random() * 50,
    sway: 5 + Math.random() * 15,
  })), []);

  const moveNoButton = useCallback(() => {
    const padding = 80;
    const btnWidth = noBtnRef.current?.offsetWidth || 120;
    const btnHeight = noBtnRef.current?.offsetHeight || 60;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    const newX = Math.max(padding, Math.random() * maxX);
    const newY = Math.max(padding, Math.random() * maxY);
    const newRotate = (Math.random() - 0.5) * 60; 
    const newScale = 0.7 + Math.random() * 0.5;
    setNoButtonState({ x: newX, y: newY, rotate: newRotate, scale: newScale });
  }, []);

  useEffect(() => {
    if (isAccepted || isDeclined) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!noBtnRef.current) return;
      const rect = noBtnRef.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) + 
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );
      if (distance < 140) moveNoButton();
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [moveNoButton, isAccepted, isDeclined]);

  const handleYes = () => setIsAccepted(true);
  const handleMaybe = () => {
    setTimeout(() => {
      setMaybeLevel(prev => Math.min(prev + 1, 2));
      moveNoButton();
    }, 150);
  };
  const handleNo = () => setIsDeclined(true);
  const handleStartOver = () => {
    setIsAccepted(false);
    setIsDeclined(false);
    setMaybeLevel(0);
    setNoButtonState({ x: 0, y: 0, rotate: 0, scale: 1 });
  };

  const checklistItems = [
    { text: "Unlimited Chocolates", icon: "🍫" },
    { text: "Endless Forehead Kisses", icon: "😘" },
    { text: "Movie Nights & Popcorn", icon: "🍿" },
    { text: "My Undivided Attention", icon: "💝" },
  ];

  const bribeItems = [
    { text: "I'll share my fries", icon: <Utensils size={14} />, color: "bg-orange-100 text-orange-600" },
    { text: "Coffee in bed", icon: <Coffee size={14} />, color: "bg-amber-100 text-amber-700" },
    { text: "Control of the remote", icon: <Zap size={14} />, color: "bg-purple-100 text-purple-600" },
    { text: "Best listener award", icon: <Star size={14} />, color: "bg-yellow-100 text-yellow-700" },
  ];

  return (
    <div className="relative flex items-center justify-center pt-10 min-h-screen overflow-x-hidden overflow-y-auto p-4 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 text-rose-900">
      
      {/* Background Floating Elements Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {decorElements.map((el) => (
          <MotionDiv
            key={el.id}
            initial={{ y: '110vh', x: `${el.initialX}vw`, rotate: 0, opacity: 0.1 }}
            animate={{ 
              y: '-20vh', 
              rotate: 360, 
              x: [`${el.initialX}vw`, `${el.initialX + el.sway}vw`, `${el.initialX}vw`],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ 
              y: { duration: el.duration, repeat: Infinity, ease: 'linear', delay: el.delay },
              x: { duration: el.duration / 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: el.duration / 2, repeat: Infinity, ease: 'linear' },
              opacity: { duration: el.duration, repeat: Infinity, ease: 'easeInOut' }
            }}
            className={`absolute ${el.color}`}
          >
            {el.type === 0 && <Heart size={el.size} fill="currentColor" />}
            {el.type === 1 && <Sparkles size={el.size} />}
            {el.type === 2 && <Flower2 size={el.size} />}
          </MotionDiv>
        ))}
      </div>

      <AnimatePresence>
        {isAccepted && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, i) => <ConfettiParticle key={i} index={i} />)}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isAccepted && !isDeclined ? (
          <MotionDiv 
            key={`maybe-level-${maybeLevel}`}
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            className="clay-card p-8 md:p-14 max-w-2xl w-full text-center z-10 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6 text-rose-400 font-bold text-xs uppercase tracking-tighter opacity-60">
              <span className="flex items-center gap-1"><Heart size={12} fill="currentColor"/> Special Invitation</span>
              <span>{maybeLevel > 0 ? `Urgent Request` : `Feb 14`}</span>
            </div>

            <MotionDiv 
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-4 inline-block"
            >
              <Heart size={72} className="text-rose-500 fill-rose-400 mx-auto" />
            </MotionDiv>
            
            <div className="min-h-[4rem] mb-2 flex items-center justify-center pt-10">
              <TypewriterText 
                key={`heading-${maybeLevel}`}
                text={
                  maybeLevel === 0 ? "Will you be my Valentine Anjuu? 💕"  :
                  maybeLevel === 1 ? "Wait, don't leave me hanging! 🙈" :
                  "Okay, I'm pulling out all the stops! 🍭"
                }
                className="text-3xl md:text-4xl font-bold text-rose-600 leading-tight"
                speed={0.05}
              />
            </div>

            <div className="flex justify-center mb-6 w-full">
              <MotionDiv 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-rose-100/60 px-5 py-2.5 rounded-full border border-rose-200/50 shadow-inner"
              >
                <Clock size={16} className="text-rose-500 animate-pulse" />
                <span className="text-[11px] md:text-sm font-bold text-rose-600 tracking-wider">
                  Valentine’s Day ends in: <span className="font-mono text-rose-700 bg-white/70 px-2 py-0.5 rounded-lg shadow-sm border border-rose-100">{timeLeft}</span> ⏰
                </span>
              </MotionDiv>
            </div>

            <div className="min-h-[5rem] mb-8 max-w-md mx-auto">
              <TypewriterText 
                key={`desc-${maybeLevel}`}
                text={
                  maybeLevel === 0 ? "I've been thinking about this all year. You make my world so much brighter, and I'd be the luckiest person to have you by my side." :
                  maybeLevel === 1 ? "I know that 'No' button is jumping around, but my heart is staying right here with you! Still thinking? Look at these perks..." :
                  "Are you really, really sure? This is my final offer! I'll even pretend to like your favorite reality TV show without complaining!"
                }
                className="text-rose-500 font-medium leading-relaxed"
                speed={0.02}
                delay={0.5}
              />
            </div>

            <AnimatePresence mode="wait">
              {maybeLevel === 0 && (
                <MotionDiv key="checklist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 mb-10 text-left max-w-sm mx-auto">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/40 p-2 rounded-xl border border-rose-100">
                      <CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" />
                      <span className="text-rose-600 text-xs font-bold leading-none">{item.text} {item.icon}</span>
                    </div>
                  ))}
                </MotionDiv>
              )}
              {maybeLevel === 1 && (
                <MotionDiv key="bribes" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap justify-center gap-2 mb-10 max-w-md mx-auto">
                  {bribeItems.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm border border-white/50 ${item.color}`}>
                      {item.icon} {item.text}
                    </div>
                  ))}
                </MotionDiv>
              )}
              {maybeLevel === 2 && (
                <MotionDiv key="emergency" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-4 bg-rose-50 rounded-2xl border-2 border-dashed border-rose-200">
                  <p className="text-rose-600 text-sm font-bold animate-pulse">🚨 EMERGENCY VALENTINE PROTOCOL ACTIVATED 🚨</p>
                  <p className="text-rose-400 text-xs mt-1">Acceptance grants you a 100% discount on all sadness today.</p>
                </MotionDiv>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center min-h-[100px] relative mt-4">
              <MotionButton whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={handleYes} className="clay-btn-yes w-full sm:w-auto px-10 py-5 text-white text-xl font-bold rounded-[30px] flex items-center justify-center gap-2">
                {maybeLevel === 2 ? "Fine, YES! ❤️" : "Yes 💕"}
              </MotionButton>
              {maybeLevel < 2 && (
                <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ rotate: [0, -10, 10, -10, 10, 0], scale: 0.85, transition: { duration: 0.3 } }} onClick={handleMaybe} className="clay-btn-maybe w-full sm:w-auto px-10 py-5 text-white text-xl font-bold rounded-[30px] flex items-center justify-center gap-2">
                  {maybeLevel === 0 ? "Maybe? 🤔" : "Still Maybe? 💭"}
                </MotionButton>
              )}
              <MotionButton ref={noBtnRef} style={{ position: noButtonState.x === 0 ? 'relative' : 'fixed', left: noButtonState.x !== 0 ? noButtonState.x : 'auto', top: noButtonState.y !== 0 ? noButtonState.y : 'auto', zIndex: 100 }} animate={noButtonState.x !== 0 ? { x: 0, y: 0, rotate: noButtonState.rotate, scale: noButtonState.scale } : {}} transition={{ type: 'spring', stiffness: 400, damping: 25 }} onClick={handleNo} className="clay-btn-no w-full sm:w-auto px-10 py-5 text-white text-xl font-bold rounded-[30px] whitespace-nowrap">
                No 😜
              </MotionButton>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-100 flex justify-center gap-8 text-[10px] font-bold text-rose-300 uppercase">
               <div className="flex flex-col"><span>To:</span><span className="text-rose-500 text-xs">My Favorite Person</span></div>
               <div className="flex flex-col"><span>From:</span><span className="text-rose-500 text-xs">Yours Truly</span></div>
            </div>
          </MotionDiv>
        ) : isAccepted ? (
          <MotionDiv key="success-screen" initial={{ scale: 0.6, opacity: 0, rotate: -5 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} className="clay-card p-12 md:p-20 max-w-lg w-full text-center z-10">
            <MotionDiv animate={{ scale: [1, 1.3, 1], filter: ['drop-shadow(0 0 0px #f472b6)', 'drop-shadow(0 0 30px #f472b6)', 'drop-shadow(0 0 0px #f472b6)'] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-10">
              <Heart size={120} className="text-rose-500 fill-rose-500 mx-auto" />
            </MotionDiv>
            <TypewriterText text="Yayyy!" className="text-4xl md:text-5xl font-bold text-rose-600 mb-8 italic" speed={0.1} />
            <div className="min-h-[5rem] mb-10 px-4">
              <TypewriterText 
                text="You just made me the happiest person 💖 I love you forever!" 
                className="text-xl md:text-2xl text-rose-500 font-semibold leading-relaxed" 
                speed={0.04}
                delay={0.8}
              /><span>Send the screenshot Abi</span>

            </div>
            <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStartOver} className="clay-btn-reset px-8 py-4 text-white rounded-[25px] font-bold flex items-center justify-center gap-2 mx-auto shadow-lg"><RefreshCw size={20} /> Start Over</MotionButton>
            <div className="flex justify-center gap-5 mt-12">
              {[...Array(6)].map((_, i) => <MotionSpan key={i} animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 2.5 }} className="text-3xl">{i % 2 === 0 ? "🌸" : "💖"}</MotionSpan>)}
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv key="declined-screen" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="clay-card p-12 md:p-16 max-w-lg w-full text-center z-10">
            <MotionDiv animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-10"><Frown size={100} className="text-slate-400 mx-auto" /></MotionDiv>
            <TypewriterText text="Wait... how? 😢" className="text-3xl md:text-4xl font-bold text-slate-600 mb-8" speed={0.1} />
            <div className="min-h-[4rem] mb-10">
              <TypewriterText 
                text="You're too fast! My heart is broken... Can we try that again? I'll be faster next time!" 
                className="text-lg md:text-xl text-slate-500 font-semibold leading-relaxed" 
                speed={0.03}
                delay={1}
              />
            </div>
            <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStartOver} className="clay-btn-reset px-8 py-4 text-white rounded-[25px] font-bold flex items-center justify-center gap-2 mx-auto shadow-md"><RefreshCw size={20} /> Let's restart!</MotionButton>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 text-rose-400 font-bold opacity-60 flex items-center gap-2 text-sm tracking-widest uppercase z-10">
        <Heart size={14} fill="currentColor" /> Built with Love <Heart size={14} fill="currentColor" />
      </div>
    </div>
  );
};

export default App;
