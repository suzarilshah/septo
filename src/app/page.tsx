"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Search,
  Network,
  Brain,
  Link2,
  Lock,
  Zap,
  ArrowRight,
  Check,
  Play,
  Star,
  Database,
  Activity,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Terminal,
  Globe,
  Eye,
  BarChart3,
} from "lucide-react";

// Infinite glitch typewriter effect with random retyping for "Threat Intelligence"
function InfiniteGlitchTypewriter({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [glitchIndices, setGlitchIndices] = useState<Set<number>>(new Set());
  const [glitchChars, setGlitchChars] = useState<Map<number, string>>(new Map());
  const [shouldRetype, setShouldRetype] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retypeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  const glitchCharSet = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`0123456789ABCDEF";
  
  // Main typing/deleting logic
  useEffect(() => {
    const type = () => {
      if (currentIndexRef.current < text.length) {
        currentIndexRef.current++;
        setDisplayText(text.slice(0, currentIndexRef.current));
        // Random speed variation for more organic feel
        setTypingSpeed(60 + Math.random() * 40);
      } else {
        setIsTyping(false);
        // After typing complete, wait random time before starting to delete
        const waitTime = 2000 + Math.random() * 3000; // 2-5 seconds
        retypeTimeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          setIsTyping(true);
        }, waitTime);
      }
    };

    const deleteChar = () => {
      if (currentIndexRef.current > 0) {
        currentIndexRef.current--;
        setDisplayText(text.slice(0, currentIndexRef.current));
        // Faster deletion
        setTypingSpeed(30 + Math.random() * 20);
      } else {
        setIsDeleting(false);
        setIsTyping(true);
        setDisplayText("");
        currentIndexRef.current = 0;
        // Random delay before retyping
        const retypeDelay = 500 + Math.random() * 1000;
        retypeTimeoutRef.current = setTimeout(() => {
          setShouldRetype(true);
        }, retypeDelay);
      }
    };

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (isDeleting) {
        deleteChar();
      } else if (isTyping) {
        type();
      }
    }, typingSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (retypeTimeoutRef.current) clearTimeout(retypeTimeoutRef.current);
    };
  }, [displayText, isTyping, isDeleting, text, typingSpeed]);

  // Reset for retyping
  useEffect(() => {
    if (shouldRetype) {
      setShouldRetype(false);
      setIsTyping(true);
      setIsDeleting(false);
      setDisplayText("");
      currentIndexRef.current = 0;
    }
  }, [shouldRetype]);

  // Continuous glitch effect - random characters glitch at random intervals
  useEffect(() => {
    const glitch = () => {
      if (displayText.length === 0) return;
      
      const newGlitchIndices = new Set<number>();
      const newGlitchChars = new Map<number, string>();
      
      // Random number of characters to glitch (1-3)
      const numGlitches = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numGlitches; i++) {
        // Only glitch non-space characters that exist
        let randomIndex;
        let attempts = 0;
        do {
          randomIndex = Math.floor(Math.random() * displayText.length);
          attempts++;
        } while ((displayText[randomIndex] === " " || displayText[randomIndex] === undefined) && attempts < 10);
        
        if (randomIndex >= 0 && randomIndex < displayText.length && displayText[randomIndex] !== " ") {
          newGlitchIndices.add(randomIndex);
          newGlitchChars.set(randomIndex, glitchCharSet[Math.floor(Math.random() * glitchCharSet.length)]);
        }
      }
      
      setGlitchIndices(newGlitchIndices);
      setGlitchChars(newGlitchChars);
      
      // Random glitch duration (50-200ms)
      const glitchDuration = 50 + Math.random() * 150;
      setTimeout(() => {
        setGlitchIndices(new Set());
        setGlitchChars(new Map());
      }, glitchDuration);
    };

    if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
    
    // Random glitch interval (200-800ms) - more frequent when text is complete
    const baseInterval = displayText.length === text.length ? 200 : 500;
    const glitchInterval = baseInterval + Math.random() * 400;
    
    glitchIntervalRef.current = setInterval(glitch, glitchInterval);

    return () => {
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
    };
  }, [displayText, text.length]);

  return (
    <span className={`${className} relative inline-block`}>
      {displayText.split("").map((char, i) => {
        const isGlitching = glitchIndices.has(i);
        const glitchChar = glitchChars.get(i);
        
        return (
          <motion.span
            key={`${i}-${displayText.length}-${Date.now()}`}
            className={`${char === " " ? "inline" : "inline-block"} relative`}
            style={{
              width: char === " " ? "0.3em" : undefined,
            }}
            animate={{
              x: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
              y: isGlitching ? [0, 1, -1, 0.5, -0.5, 0] : 0,
              scale: isGlitching ? [1, 1.1, 0.9, 1.05, 0.95, 1] : 1,
            }}
            transition={{
              duration: 0.15,
              ease: "easeInOut",
            }}
          >
            <span
              className={`relative ${
                isGlitching 
                  ? "text-electric" 
                  : "text-transparent bg-clip-text"
              }`}
              style={{
                backgroundImage: isGlitching 
                  ? "none"
                  : "linear-gradient(135deg, #00ff41 0%, #00ff88 25%, #00d4ff 50%, #00a8ff 75%, #a855f7 100%)",
                backgroundSize: "200% 200%",
                animation: isGlitching ? "none" : "gradient-shift 3s ease infinite",
                textShadow: isGlitching
                  ? "0 0 15px #00d4ff, 0 0 30px #00d4ff, 0 0 45px #00d4ff, 0 0 60px #00d4ff, 0 0 75px #00d4ff"
                  : "0 0 30px rgba(0, 255, 65, 0.8), 0 0 60px rgba(0, 255, 65, 0.6), 0 0 90px rgba(0, 255, 65, 0.4), 0 0 120px rgba(0, 212, 255, 0.3), 0 0 150px rgba(168, 85, 247, 0.2)",
                filter: isGlitching ? "blur(0.5px)" : "drop-shadow(0 0 20px rgba(0, 255, 65, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isGlitching ? glitchChar : char}
            </span>
            {/* Glitch overlay effect with premium RGB shift */}
            {isGlitching && (
              <>
                <span
                  className="absolute inset-0 text-electric opacity-60"
                  style={{
                    textShadow: "2px 0 #ff00ff, -2px 0 #00ffff, 0 2px #00ff41",
                    clipPath: "inset(0 50% 0 0)",
                    animation: "glitch-shift 0.1s infinite",
                    filter: "blur(0.5px)",
                  }}
                >
                  {glitchChar}
                </span>
                <span
                  className="absolute inset-0 text-primary opacity-40"
                  style={{
                    textShadow: "-2px 0 #00ffff, 2px 0 #ff00ff, 0 -2px #a855f7",
                    clipPath: "inset(0 0 0 50%)",
                    animation: "glitch-shift 0.1s infinite reverse",
                    filter: "blur(0.5px)",
                  }}
                >
                  {glitchChar}
                </span>
              </>
            )}
          </motion.span>
        );
      })}
      {/* Cursor */}
      {isTyping && (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            boxShadow: "0 0 10px #00ff41, 0 0 20px #00ff41",
          }}
        />
      )}
      
      {/* CSS for glitch animation and gradient */}
      <style jsx>{`
        @keyframes glitch-shift {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </span>
  );
}

// Line pattern background component
function LinePatternBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/5 rounded-full blur-[200px]" />
      
      {/* Line patterns - diagonal */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonal-lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" stroke="rgba(0, 255, 65, 0.5)" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>
      
      {/* Horizontal scan lines */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.1) 2px,
            rgba(0, 255, 65, 0.1) 4px
          )`,
        }}
      />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Mock Browser Component showing the Septo Dashboard
function MockBrowser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative w-full max-w-5xl mx-auto mt-8"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-cyan-500/20 to-purple-500/30 rounded-3xl blur-3xl opacity-60" />
      
      {/* Browser frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Browser header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 rounded-lg text-sm text-gray-400 border border-white/5">
              <Lock className="w-3 h-3 text-green-500" />
              <span className="font-mono text-xs">septo.app/dashboard</span>
            </div>
          </div>
          <div className="w-16" />
        </div>
        
        {/* Dashboard content */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#050505]">
          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-[#0a0a0a] border-r border-white/5 p-3">
            <div className="flex items-center gap-2 mb-6 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-white text-sm tracking-wider">SEPTO</span>
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: BarChart3, active: true },
                { name: "Entities", icon: Database },
                { name: "Graph", icon: Network },
                { name: "Reports", icon: Terminal },
                { name: "OSINT", icon: Search },
                { name: "Tracking", icon: Eye },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    item.active 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.name}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Main content */}
          <div className="absolute left-48 right-0 top-0 bottom-0 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-sm font-semibold">Welcome back, Operator</h3>
                <p className="text-gray-500 text-xs">Your threat intelligence overview</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-mono">LIVE</span>
              </div>
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: "Entities", value: "2,847", trend: "+12%", color: "text-primary" },
                { label: "Reports", value: "523", trend: "+8%", color: "text-cyan-400" },
                { label: "Threats", value: "17", trend: "-3%", color: "text-yellow-400" },
                { label: "Critical", value: "3", trend: "+1", color: "text-red-400" },
              ].map((stat) => (
                <div key={stat.label} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
                    <span className="text-[8px] text-green-400">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chart area */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-[10px] font-medium uppercase tracking-wider">Threat Analytics</span>
                  <Activity className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex items-end gap-0.5 h-20">
                  {[35, 55, 40, 70, 50, 65, 75, 55, 80, 65, 85, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                      className={`flex-1 rounded-t ${i === 11 ? "bg-primary" : "bg-white/10"}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Mini graph */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-[10px] font-medium uppercase tracking-wider">Network</span>
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="relative h-20 flex items-center justify-center">
                  {/* Simple node visualization */}
                  <div className="relative w-16 h-16">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                    />
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                        style={{
                          top: `${50 + 40 * Math.sin(angle * Math.PI / 180)}%`,
                          left: `${50 + 40 * Math.cos(angle * Math.PI / 180)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.line
                          key={i}
                          x1="50%"
                          y1="50%"
                          x2={`${50 + 40 * Math.cos(angle * Math.PI / 180)}%`}
                          y2={`${50 + 40 * Math.sin(angle * Math.PI / 180)}%`}
                          stroke="rgba(0, 212, 255, 0.3)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -right-4 top-24 px-3 py-2 rounded-xl bg-[#0a0a0a]/90 border border-primary/30 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,65,0.2)]"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs text-white font-medium">+23% detected</span>
        </div>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
        className="absolute -left-4 bottom-24 px-3 py-2 rounded-xl bg-[#0a0a0a]/90 border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(0,212,255,0.2)]"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-white font-medium">3 new alerts</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  accentColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/[0.04]"
    >
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accentColor} to-transparent`} />
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Stats Component
function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring" }}
      className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Search,
      title: "OSINT Intelligence",
      description: "Enumerate 200+ platforms instantly. Find usernames, emails, and digital footprints across the entire internet.",
      accentColor: "from-primary/10",
    },
    {
      icon: Network,
      title: "Relationship Graphs",
      description: "Visualize complex connections between entities with interactive node-based graphs powered by React Flow.",
      accentColor: "from-cyan-500/10",
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Query your intelligence database with natural language. Get instant insights powered by GPT-4 and Azure OpenAI.",
      accentColor: "from-purple-500/10",
    },
    {
      icon: Link2,
      title: "Tracking Links",
      description: "Generate stealth tracking URLs to gather IP, geolocation, device, and network intelligence from any target.",
      accentColor: "from-orange-500/10",
    },
    {
      icon: Database,
      title: "Vector Search",
      description: "Semantic search across your entire intelligence database using pgvector embeddings and cosine similarity.",
      accentColor: "from-pink-500/10",
    },
    {
      icon: Shield,
      title: "Threat Scoring",
      description: "Automated threat assessment with customizable scoring algorithms. Prioritize high-risk entities instantly.",
      accentColor: "from-red-500/10",
    },
  ];

  const testimonials = [
    {
      quote: "SEPTO transformed our security research workflow. We found threats 10x faster.",
      author: "Sarah Chen",
      role: "Security Lead, TechCorp",
      avatar: "SC",
    },
    {
      quote: "The OSINT tools are incredible. It's like having a whole team of researchers.",
      author: "Marcus Johnson",
      role: "CISO, FinanceHub",
      avatar: "MJ",
    },
    {
      quote: "The AI analysis feature alone is worth the investment. Game-changing.",
      author: "Elena Rodriguez",
      role: "Threat Analyst, SecureNet",
      avatar: "ER",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* Animated background with line patterns */}
      <LinePatternBackground />

      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#030303]/90 backdrop-blur-xl border-b border-white/5" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider">SEPTO</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-2 font-mono">v1.0</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="hidden sm:inline-flex px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Now with AI-Powered Analysis</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              The Future of
              <br />
              <span className="drop-shadow-[0_0_30px_rgba(0,255,65,0.5)]">
                <InfiniteGlitchTypewriter text="Threat Intelligence" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              SEPTO is the all-in-one OSINT platform for security researchers.
              Gather intelligence, visualize relationships, and analyze threats
              with the power of AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/auth/sign-up"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-primary text-black rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:shadow-[0_0_50px_rgba(0,255,65,0.6)]"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 mt-10"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-sm text-gray-400">Trusted by 1,000+ security researchers</span>
            </motion.div>
          </div>

          {/* Mock Browser */}
          <MockBrowser />
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider">Trusted by security teams at leading companies</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {["TechCorp", "SecureNet", "CyberGuard", "InfoSec Pro", "DataShield", "NetWatch"].map((name) => (
              <motion.div 
                key={name} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ opacity: 1 }}
                className="text-xl font-bold text-gray-600 transition-opacity cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem value="200+" label="Platforms Searched" delay={0} />
            <StatItem value="1M+" label="Entities Tracked" delay={0.1} />
            <StatItem value="99.9%" label="Uptime SLA" delay={0.2} />
            <StatItem value="<100ms" label="Search Latency" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for
              <br />
              <span className="text-primary">Threat Intelligence</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From OSINT collection to AI analysis, SEPTO provides all the tools
              you need in one powerful platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three steps to supercharge your security research</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Collect Intelligence",
                description: "Use OSINT tools to gather data from social media, domains, emails, and more.",
                icon: Search,
              },
              {
                step: "02",
                title: "Analyze & Connect",
                description: "AI automatically finds patterns and connections between entities in your data.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Take Action",
                description: "Generate reports, set up alerts, and track threats in real-time.",
                icon: Zap,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="text-6xl font-bold text-white/5 absolute top-4 right-4 font-mono">{item.step}</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Security Teams</h2>
            <p className="text-xl text-gray-400">See what researchers are saying about SEPTO</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary border border-primary/30">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cyan-500/10 to-purple-500/20" />
            <div className="absolute inset-0 bg-[#0a0a0a]/80" />
            <div className="absolute inset-0 border border-primary/20 rounded-3xl" />
            
            {/* Decorative lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-lines" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M0 30 L30 0" stroke="rgba(0, 255, 65, 0.5)" strokeWidth="0.5" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-lines)" />
            </svg>
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your
                <br />
                Security Research?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join 1,000+ security professionals using SEPTO
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-primary text-black rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,255,65,0.4)]"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold tracking-wider">SEPTO</span>
              </div>
              <p className="text-sm text-gray-500">
                The all-in-one platform for threat intelligence and OSINT research.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Features", "API", "Integrations"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-sm text-gray-500">© 2024 SEPTO. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
