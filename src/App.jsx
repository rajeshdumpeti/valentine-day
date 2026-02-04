import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import {
  Upload,
  Sparkles,
  Heart,
  Zap,
  Ghost,
  Flame,
  Crown,
  Music,
  Gamepad2,
  Trophy,
  PartyPopper,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
};

const glitchAnim = {
  initial: { x: 0 },
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    transition: { duration: 0.3 }
  }
};

const CLOUDINARY_CLOUD_NAME = "decwtrskq";
const CLOUDINARY_UPLOAD_PRESET = "valentine";

const encodePayload = (payload) =>
  compressToEncodedURIComponent(JSON.stringify(payload));
const decodePayload = (payload) =>
  JSON.parse(decompressFromEncodedURIComponent(payload));

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const randomInRange = (min, max) => Math.random() * (max - min) + min;

const buildNoBounds = (buttonRef) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rect = buttonRef.current?.getBoundingClientRect();
  const buttonWidth = rect?.width ?? 120;
  const buttonHeight = rect?.height ?? 44;
  const padding = 16;
  const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
  const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);
  const minY = clamp(140, padding, maxY);

  return {
    minX: padding,
    maxX,
    minY,
    maxY,
  };
};

// New: Meme templates for image generation
const memeTemplates = [
  {
    id: "drake", emoji: "💆", label: "Drake Hotline", color: "#FF6B8B",
    description: "Hot vs Not"
  },
  {
    id: "spongebob", emoji: "🧽", label: "Spongebob", color: "#FFD166",
    description: "Fancy vs Regular"
  },
  {
    id: "disastergirl", emoji: "😏", label: "Smirk Girl", color: "#FF9AA2",
    description: "Sassy vibes"
  },
  {
    id: "grumpycat", emoji: "😾", label: "Grumpy Cat", color: "#B5EAD7",
    description: "Playful no"
  },
  {
    id: "wonka", emoji: "🎩", label: "Willy Wonka", color: "#C7CEEA",
    description: "Sarcastic"
  },
  {
    id: "yodawg", emoji: "🐶", label: "Yo Dawg", color: "#FFB347",
    description: "Meta meme"
  },
  {
    id: "fwp", emoji: "😭", label: "First World", color: "#FF9AA2",
    description: "Playful problems"
  },
  {
    id: "buzz", emoji: "👨‍🚀", label: "Astronaut", color: "#06D6A0",
    description: "Always has been"
  },
  {
    id: "pigeon", emoji: "🕊️", label: "Pigeon", color: "#118AB2",
    description: "Actually though"
  },
  {
    id: "sociallyawesomeawkwardpenguin", emoji: "🐧", label: "Awkward Penguin", color: "#FF6B8B",
    description: "Relatable"
  },
];

// New: Vibe playlists
const vibePlaylists = {
  softie: [
    { title: "Lover - Taylor Swift", color: "#FF9AA2" },
    { title: "Perfect - Ed Sheeran", color: "#FFB7B2" },
    { title: "Golden Hour - JVKE", color: "#FFDAC1" },
  ],
  chaos: [
    { title: "bad idea right? - Olivia Rodrigo", color: "#B5EAD7" },
    { title: "vampire - Olivia Rodrigo", color: "#C7CEEA" },
    { title: "Flowers - Miley Cyrus", color: "#E2F0CB" },
  ],
  main: [
    { title: "greedy - Tate McRae", color: "#FF9AA2" },
    { title: "Paint The Town Red - Doja Cat", color: "#FFB7B2" },
    { title: "yes, and? - Ariana Grande", color: "#FFDAC1" },
  ],
};

// New: Modern floating elements
const FloatingElements = () => {
  const elements = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${randomInRange(0, 100)}%`,
        top: `${randomInRange(0, 100)}%`,
        delay: randomInRange(0, 8),
        size: randomInRange(20, 40),
        type: ["💖", "✨", "🫶", "🌟", "🦋", "🍓", "🎀", "💫"][index % 8],
        floatSpeed: randomInRange(8, 20),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: el.left,
            top: el.top,
            fontSize: `${el.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: el.floatSpeed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type}
        </motion.div>
      ))}
    </div>
  );
};

// New: Glitch text component
const GlitchText = ({ children, intensity = 2 }) => {
  const [glitch, setGlitch] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setGlitch(true)}
      onAnimationComplete={() => setGlitch(false)}
      animate={glitch ? "animate" : "initial"}
      variants={glitchAnim}
      className="inline-block relative"
    >
      {children}
      <span className="absolute inset-0 text-pink-400 mix-blend-overlay opacity-0 hover:opacity-40 transition-opacity">
        {children}
      </span>
    </motion.span>
  );
};

// New: Audio player component
const VibePlayer = ({ vibe }) => {
  const [playing, setPlaying] = useState(false);
  const playlist = vibePlaylists[vibe] || vibePlaylists.softie;

  return (
    <div className="glass-card rounded-3xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <Music size={20} className="text-rose" />
        <span className="text-sm font-bold uppercase tracking-wider text-rose">
          Mood Playlist
        </span>
        <div className="flex-1 h-px bg-rose/20"></div>
      </div>
      <div className="space-y-2">
        {playlist.map((track, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all cursor-pointer"
            style={{ backgroundColor: `${track.color}20` }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: track.color }}>
              <span className="text-xs font-bold">♪</span>
            </div>
            <span className="text-sm font-medium text-wine/90">{track.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// New: Pixel rain effect for celebration
const PixelRain = ({ active }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const pixels = Array.from({ length: 50 }, (_, i) => {
      const pixel = document.createElement('div');
      pixel.className = 'absolute w-1 h-1 bg-gradient-to-b from-rose to-pink-300 rounded-full';
      pixel.style.left = `${Math.random() * 100}%`;
      pixel.style.top = `-10px`;
      pixel.style.animation = `pixel-fall ${1 + Math.random() * 2}s linear forwards`;
      pixel.style.animationDelay = `${Math.random() * 1}s`;
      container.appendChild(pixel);
      return pixel;
    });

    return () => pixels.forEach(p => p.remove());
  }, [active]);

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" />;
};

const CreatorView = ({ onCopyLink }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageMode, setImageMode] = useState("url");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [step, setStep] = useState(0);
  const [stickerTheme, setStickerTheme] = useState("kawaii");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [memeTemplate, setMemeTemplate] = useState("");
  const [showPixelRain, setShowPixelRain] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [linkName, setLinkName] = useState("");
  const [copiedAnim, setCopiedAnim] = useState(false);
  const [chatgptStatus, setChatgptStatus] = useState("");
  const [chatgptAnim, setChatgptAnim] = useState(false);

  const messageSuggestions = [
    "You make ordinary days feel special.",
    "I’m grateful for you—today and always.",
    "You’re my favorite hello and sweetest goodbye.",
    "Life feels lighter with you in it.",
    "You make my heart smile.",
    "Thank you for being you.",
    "Every day with you is a gift.",
    "You’re my safe place.",
  ];

  const steps = [
    { id: "name", label: "Recipient", rune: "👀", icon: Zap },
    { id: "message", label: "Message", rune: "💬", icon: Flame },
    { id: "image", label: "Photo", rune: "🖼️", icon: Sparkles },
    { id: "preview", label: "Preview", rune: "✈️", icon: PartyPopper },
  ];

  const stickerThemes = [
    { id: "kawaii", label: "Kawaii Core", emojis: ["🌸", "💖", "✨", "🍓"], color: "#FF9AA2" },
    { id: "y2k", label: "Y2K Baddie", emojis: ["💿", "🫧", "🦋", "⚡️"], color: "#B5EAD7" },
    { id: "minimal", label: "Clean Girl", emojis: ["✦", "♡", "✶", "◌"], color: "#C7CEEA" },
    { id: "meme", label: "Meme Lord", emojis: ["😂", "🔥", "🫶", "😈"], color: "#FFD166" },
    { id: "gamer", label: "Gamer Mode", emojis: ["🎮", "👾", "⭐", "🏆"], color: "#FFB347" },
  ];

  const vibeKeywords = {
    softie: ["sweet", "love", "forever", "heart", "cute", "darling", "soft"],
    chaos: ["playful", "silly", "wild", "bold", "funny", "adventure", "spark"],
    main: ["icon", "star", "queen", "king", "legend", "vibe", "glow"],
  };

  const getVibe = (text) => {
    const value = text.toLowerCase();
    let score = clamp(value.length * 3, 0, 70);
    let label = "Sweet & Soft";
    let tag = "Warm and tender energy 💗";
    let icon = "😊";

    const hasSoftie = vibeKeywords.softie.some((word) => value.includes(word));
    const hasChaos = vibeKeywords.chaos.some((word) => value.includes(word));
    const hasMain = vibeKeywords.main.some((word) => value.includes(word));

    if (hasSoftie) score += 15;
    if (hasChaos) score += 25;
    if (hasMain) score += 25;
    score = clamp(score, 0, 100);

    if (hasChaos || score > 85) {
      label = "Playful Spark";
      tag = "Light, fun, and a little bold ✨";
      icon = "😈";
    } else if (hasMain || score > 65) {
      label = "Star Energy";
      tag = "Confident and glowing ✨";
      icon = "👑";
    } else if (score > 35) {
      label = "Sweet & Soft";
      tag = "Warm and fuzzy 🥰";
      icon = "🌸";
    } else {
      label = "Simple & Sweet";
      tag = "Short, sweet, and sincere ✨";
      icon = "😌";
    }

    return { score, label, tag, icon };
  };

  const vibe = getVibe(message.trim());
  const lastStep = steps.length - 1;
  const previewName = name.trim() || "Valentine";
  const previewMessage = message.trim() || "You make my heart smile.";
  const previewImage = imageMode === "url" ? imageUrl.trim() : imagePreview;
  const activeSticker =
    stickerThemes.find((theme) => theme.id === stickerTheme) ||
    stickerThemes[0];

  const goNext = () => {
    if (step === steps.length - 2) {
      setShowPixelRain(true);
      setTimeout(() => setShowPixelRain(false), 1000);
    }
    setStep((current) => Math.min(current + 1, lastStep));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (imageMode === "upload" && uploading) {
      setImageError("Please wait for the upload to finish. ⏳");
      return;
    }

    // Trigger celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF6B8B", "#FFD166", "#06D6A0", "#118AB2"],
    });

    const finalImage = imageUrl.trim();
    const payload = {
      name: name.trim() || "Valentine",
      message: message.trim() || "You make my heart smile.",
      imageUrl: finalImage,
      vibe: vibe.label,
      theme: stickerTheme,
    };
    const encoded = encodePayload(payload);
    const basePath = import.meta.env.BASE_URL || "/";
    const normalizedBase = basePath.endsWith("/")
      ? basePath
      : `${basePath}/`;
    const safeSlug = linkName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slugPart = safeSlug ? `${safeSlug}/` : "";
    const link = `${window.location.origin}${normalizedBase}foryou/${slugPart}#d=${encoded}`;

    let copied = false;
    try {
      await navigator.clipboard.writeText(link);
      copied = true;
    } catch (error) {
      copied = false;
    }

    setShareLink(link);
    setCopyStatus(copied ? "Link copied to clipboard." : "Copy the link below.");
    if (copied) {
      setCopiedAnim(true);
      window.setTimeout(() => setCopiedAnim(false), 1200);
    }
    setShareModalOpen(true);
    onCopyLink?.(link);
  };

  const uploadToCloudinary = (file) =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } catch (error) {
            reject(new Error("Upload worked but parsing failed 😅"));
          }
        } else {
          reject(new Error("Upload failed. Try again? 🔄"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error. Check your wifi! 📶"));
      xhr.send(formData);
    });

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-8">
      <PixelRain active={showPixelRain} />
      <FloatingElements />

      <motion.div {...fadeInUp}>
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose/20 to-pink-400/20 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-rose">
          Valentine Surprise ✨
          <span className="text-base">🔮</span>
        </div>
        <h1 className="mt-5 font-display text-4xl sm:text-7xl text-wine">
          Create a <GlitchText>Surprise Love Card</GlitchText>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-wine/70 sm:text-lg">
          Make a sweet surprise link for your wife, partner, best friend, or anyone you love.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6">
        <div className="glass-card rounded-[2rem] p-6 shadow-glow border border-white/30 backdrop-blur-sm">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all ${index === step
                        ? "border-rose bg-gradient-to-r from-rose to-pink-400 text-white shadow-lg"
                        : "border-rose/20 bg-white/60 text-wine hover:border-rose/40"
                        }`}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose bg-white/60 px-3 py-1 rounded-full">
                Step {step + 1}/{steps.length}
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose to-pink-400"
                initial={false}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              />
            </div>
          </div>

          <div className="mt-8">
            {step === 0 && (
              <motion.div {...fadeInUp} className="grid gap-5">
                <h2 className="font-display text-3xl text-wine">
                  Who is this <span className="text-rose">for</span>?
                </h2>
                <label className="grid gap-2 text-sm font-bold text-wine/80">
                  Their Name
                  <input
                    className="rounded-2xl border-2 border-rose/20 bg-white/80 px-4 py-3 text-base text-wine outline-none transition-all focus:border-rose focus:ring-4 focus:ring-rose/20"
                    placeholder="Their name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
                <div className="grid gap-3 rounded-2xl border-2 border-dashed border-rose/20 bg-gradient-to-br from-white/50 to-rose/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                    Quick Picks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Wife", "Husband", "Partner", "Best Friend", "Mom", "Dad", "Sister", "Brother", "Friend"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setName(tag)}
                        className="rounded-full border border-rose/30 bg-white/80 px-3 py-1.5 text-sm font-medium text-wine hover:bg-rose/10 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div {...fadeInUp} className="grid gap-6">
                <div>
                  <h2 className="font-display text-3xl text-wine">
                    Write a <span className="text-rose">sweet message</span>
                  </h2>
                  <p className="text-sm text-wine/70">
                    Keep it heartfelt, funny, or simple—whatever feels right.
                  </p>
                </div>

                <label className="grid gap-2 text-sm font-bold text-wine/80">
                  Your Message
                  <textarea
                    rows={3}
                    className="rounded-2xl border-2 border-rose/20 bg-white/80 px-4 py-3 text-base text-wine outline-none transition-all focus:border-rose focus:ring-4 focus:ring-rose/20 resize-none"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setSelectedSuggestion("");
                    }}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      const recipient = name.trim()
                        ? `for ${name.trim()}`
                        : "for someone you love";
                      const prompt = `Write 5 short Valentine surprise messages ${recipient}. Keep them warm, respectful, and inclusive for spouse, partner, best friend, or family. Each message should be 1-2 sentences.`;
                      try {
                        await navigator.clipboard.writeText(prompt);
                        setChatgptStatus("Prompt copied. Paste it into ChatGPT.");
                      } catch (error) {
                        setChatgptStatus(
                          "Open ChatGPT and paste this prompt: " + prompt
                        );
                      }
                      setChatgptAnim(true);
                      window.setTimeout(() => setChatgptAnim(false), 900);
                      window.open("https://chatgpt.com/", "_blank", "noopener");
                    }}
                    className={`rounded-full border-2 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-wine transition-all ${chatgptAnim
                      ? "border-green-400 shadow-lg scale-[1.02]"
                      : "border-rose/30 hover:border-rose/60"
                      }`}
                  >
                    {chatgptAnim ? "Opening ChatGPT..." : "Get Message Ideas (ChatGPT)"}
                  </button>
                  {chatgptStatus && (
                    <span className="text-xs text-wine/60">{chatgptStatus} </span>
                  )}
                </div>

                <div className="grid gap-3 rounded-2xl border-2 border-rose/10 bg-gradient-to-br from-white/60 to-rose/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                    Message Ideas
                  </p>
                  <div className="grid gap-2">
                    {messageSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setMessage(suggestion);
                        }}
                        className={`text-left rounded-xl border-2 p-3 transition-all hover:-translate-y-0.5 ${selectedSuggestion === suggestion
                          ? "border-rose bg-rose/10"
                          : "border-rose/10 bg-white/60 hover:border-rose/30"
                          }`}
                      >
                        <span className="text-sm text-wine/80">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                        Mood Check
                      </span>
                      <span className="text-2xl">{vibe.icon}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-wine/70 mb-1">
                          <span>{vibe.label}</span>
                          <span>{vibe.score}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-rose/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose to-pink-400 transition-all"
                            style={{ width: `${vibe.score}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-wine/60">{vibe.tag}</p>
                    </div>
                  </div>

                  <VibePlayer vibe={vibe.label.toLowerCase().includes("chaos") ? "chaos" :
                    vibe.label.toLowerCase().includes("main") ? "main" : "softie"} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div {...fadeInUp} className="grid gap-6">
                <div>
                  <h2 className="font-display text-3xl text-wine">
                    Add a <span className="text-rose">photo</span> (optional)
                  </h2>
                  <p className="text-sm text-wine/70">
                    Upload a photo or choose a playful template.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode("url");
                        setImageError("");
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${imageMode === "url"
                        ? "border-rose bg-gradient-to-r from-rose to-pink-400 text-white"
                        : "border-rose/30 bg-white/80 text-wine hover:border-rose/60"
                        }`}
                    >
                      🔗 URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode("upload");
                        setImageError("");
                      }}
                      className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all ${imageMode === "upload"
                        ? "border-rose bg-gradient-to-r from-rose to-pink-400 text-white"
                        : "border-rose/30 bg-white/80 text-wine hover:border-rose/60"
                        }`}
                    >
                      📤 Upload
                    </button>
                  </div>

                  {imageMode === "url" ? (
                    <label className="grid gap-2 text-sm font-bold text-wine/80">
                      Image URL
                      <input
                        className="rounded-2xl border-2 border-rose/20 bg-white/80 px-4 py-3 text-base text-wine outline-none transition-all focus:border-rose focus:ring-4 focus:ring-rose/20"
                        placeholder="https://"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                      />
                    </label>
                  ) : (
                    <label className="grid gap-2 text-sm font-bold text-wine/80">
                      Upload Image
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full rounded-2xl border-2 border-dashed border-rose/40 bg-white/80 px-4 py-6 text-base text-wine outline-none transition-all hover:border-rose focus:border-rose focus:ring-4 focus:ring-rose/20 cursor-pointer"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            setImageError("");
                            if (!file) {
                              setImagePreview("");
                              setImageUrl("");
                              return;
                            }
                            const localPreview = URL.createObjectURL(file);
                            setImagePreview(localPreview);
                            setUploading(true);
                            setUploadProgress(0);
                            uploadToCloudinary(file)
                              .then((url) => {
                                setImageUrl(url);
                              })
                              .catch((error) => {
                                setImageError(error.message);
                                setImageUrl("");
                              })
                              .finally(() => {
                                setUploading(false);
                              });
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Upload className="text-rose/40" size={32} />
                        </div>
                      </div>
                    </label>
                  )}

                  {imageMode === "upload" && uploading && (
                    <div className="grid gap-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose to-pink-400 transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-medium text-wine/70">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div className="rounded-xl bg-red-50 border-2 border-red-200 p-3">
                      <p className="text-xs font-bold text-red-600">{imageError}</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                    Playful Templates
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {memeTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setMemeTemplate(template.id);
                          // Use meme generator API
                          const memeText =
                            message || "I made something special for you.";
                          const encodedText = encodeURIComponent(memeText);
                          setImageUrl(`https://api.memegen.link/images/${template.id}/${encodedText}.png?watermark=none`);
                        }}
                        className={`rounded-xl border-2 p-3 flex flex-col items-center justify-center transition-all hover:-translate-y-0.5 hover:scale-105 ${memeTemplate === template.id
                          ? "border-rose bg-gradient-to-br from-rose/20 to-pink-400/20"
                          : "border-rose/10 bg-white/60 hover:border-rose/30"
                          }`}
                        style={{
                          borderColor: memeTemplate === template.id ? template.color : undefined,
                          background: memeTemplate === template.id ? `linear-gradient(135deg, ${template.color}20, ${template.color}40)` : undefined
                        }}
                      >
                        <span className="text-2xl mb-1 animate-pulse">{template.emoji}</span>
                        <span className="text-xs font-medium text-wine/70">{template.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-wine/50 text-center">
                    Templates auto-fill with your message 📝
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div {...fadeInUp} className="grid gap-8">
                <div>
                  <h2 className="font-display text-3xl text-wine">
                    Preview & <span className="text-rose">send</span>
                  </h2>
                  <p className="text-sm text-wine/70">
                    Last look before you share the surprise
                  </p>
                </div>

                <div className="grid gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                    Pick your sticker pack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stickerThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setStickerTheme(theme.id)}
                        className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${stickerTheme === theme.id
                          ? "border-rose bg-gradient-to-r from-rose to-pink-400 text-white"
                          : "border-rose/30 bg-white/80 text-wine hover:border-rose/60"
                          }`}
                      >
                        {theme.label}
                        <span>{theme.emojis[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>


                <div className="relative rounded-3xl border-2 border-rose/25 bg-gradient-to-br from-white/90 to-rose/5 p-6 sm:p-8 text-center shadow-xl">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/10 to-transparent" />

                  {stickerThemes.map((theme, idx) => (
                    stickerTheme === theme.id && (
                      <div key={theme.id} className="absolute inset-0 rounded-3xl opacity-10"
                        style={{ background: `radial-gradient(circle at 30% 20%, ${theme.color}40, transparent 50%)` }} />
                    )
                  ))}

                  <span className="absolute -left-3 -top-3 text-3xl animate-bounce">
                    {activeSticker.emojis[0]}
                  </span>
                  <span className="absolute -right-3 -top-3 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                    {activeSticker.emojis[1]}
                  </span>
                  <span className="absolute -left-3 -bottom-3 text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>
                    {activeSticker.emojis[2]}
                  </span>
                  <span className="absolute -right-3 -bottom-3 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>
                    {activeSticker.emojis[3]}
                  </span>

                  <h3 className="font-display text-2xl sm:text-3xl text-wine relative z-10">
                    Hey <GlitchText>{previewName}</GlitchText>, will you be my Valentine?
                  </h3>
                  <p className="mt-2 text-sm text-wine/60 relative z-10">
                    This is exactly how they'll see your love card
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:items-center relative z-10">
                    <div className="overflow-hidden rounded-2xl border-2 border-rose/20 bg-gradient-to-br from-white to-rose/5">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-48 w-full object-cover sm:h-56"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center text-5xl sm:h-56">
                          🖼️
                        </div>
                      )}
                    </div>
                    <div className="text-left space-y-4">
                      <div className="rounded-xl bg-white/70 p-4">
                        <p className="font-display text-lg text-wine">
                          "{previewMessage}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose to-pink-400 flex items-center justify-center">
                          <span className="text-white font-bold">❤️</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose">
                            Mood: {vibe.label}
                          </p>
                          <p className="text-xs text-wine/60">Sent with 💖</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative rounded-full bg-gradient-to-r from-rose to-pink-400 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-[0_0_40px_rgba(255,107,139,0.4)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    Create Surprise Link
                    <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </span>
                  <span className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                    ✨
                  </span>
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-3xl mb-2">📱</div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose mb-1">Share the Link</p>
                    <p className="text-xs text-wine/60">Copy and send anywhere</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-3xl mb-2">🎮</div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose mb-1">Play the Game</p>
                    <p className="text-xs text-wine/60">"No" button tries to flee</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-3xl mb-2">💝</div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose mb-1">Get Response</p>
                    <p className="text-xs text-wine/60">Confetti if they say yes!</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-full border-2 border-rose/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-wine hover:border-rose/60 transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-rose/30 flex items-center gap-2"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back
            </button>

            <div className="flex items-center gap-3">
              {step < lastStep && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={(imageMode === "upload" && uploading) || step === lastStep}
                  className="rounded-full bg-gradient-to-r from-wine to-purple-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {step === lastStep && (
                <button
                  type="button"
                  onClick={() => {
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
                    audio.play().catch(() => { });
                    setStep(0);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-full border-2 border-rose bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose hover:bg-rose/10 transition-all"
                >
                  Edit Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full max-w-lg rounded-3xl border border-rose/20 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-wine">
                    Your surprise link is ready
                  </h3>
                  <p className="mt-1 text-sm text-wine/70">
                    Share it with your loved one or save it for later.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShareModalOpen(false);
                    setCopiedAnim(false);
                    setCopyStatus("");
                  }}
                  className="rounded-full border border-rose/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-wine hover:bg-rose/10"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-rose/20 bg-rose/5 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose">
                  Share Link
                </p>
                <input
                  value={shareLink}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-rose/20 bg-white px-3 py-2 text-xs text-wine"
                />
                {copyStatus && (
                  <p className="mt-2 text-xs text-wine/70">{copyStatus}</p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareLink);
                      setCopyStatus("Link copied to clipboard.");
                      setCopiedAnim(true);
                      window.setTimeout(() => setCopiedAnim(false), 1200);
                    } catch (error) {
                      setCopyStatus("Copy failed. Please copy manually.");
                    }
                  }}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all ${copiedAnim
                    ? "bg-green-500 scale-105 shadow-lg"
                    : "bg-wine"
                    }`}
                >
                  {copiedAnim ? "Copied!" : "Copy Link"}
                </button>
                <button
                  type="button"
                  onClick={() => window.open(shareLink, "_blank")}
                  className="rounded-full border border-rose/30 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-wine"
                >
                  Open Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const message =
                      "I made a small Valentine surprise for you 💌 ";
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                      `${message}${shareLink}`
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="rounded-full bg-gradient-to-r from-rose to-pink-400 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white"
                >
                  Share on WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReceiverView = ({ payload, error }) => {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [insults, setInsults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const noButtonRef = useRef(null);
  const yesWrapRef = useRef(null);
  const cardRef = useRef(null);

  const fleeInsults = [
    "Nice try! 😅",
    "Can't catch me! 🏃‍♂️",
    "Almost! Try again 💫",
    "Too slow! 🐢",
    "I'm shy! 👉👈",
    "Nope, try again 🔄",
    "You're gonna have to do better than that",
    "✨ Manifesting your miss ✨",
    "This button has commitment issues",
    "Error 404: Will not comply",
    "Access denied ⛔",
    "Are you even trying?",
    "My wifi is lagging ✨",
    "I have plans... to not be caught",
    "Not today 👿",
    "Read the room 😌",
    "You have to earn this W",
    "My social battery is low 🔋",
    "I'm in my sleepy era",
    "Catch these hands instead 👏",
    "I'm not like other buttons",
    "Star energy ✨"
  ];

  const moveNoButton = () => {
    const bounds = buildNoBounds(noButtonRef);
    const left = randomInRange(bounds.minX, bounds.maxX);
    const top = randomInRange(bounds.minY, bounds.maxY);
    setNoPosition({ x: left, y: top });

    // Add insult every 3 clicks
    setButtonClickCount(prev => {
      const newCount = prev + 1;
      if (newCount % 3 === 0) {
        setInsults(prevInsults => [
          ...prevInsults.slice(-2), // Keep only last 2
          fleeInsults[Math.floor(Math.random() * fleeInsults.length)]
        ]);

        // Special effects at certain counts
        if (newCount === 5) {
          confetti({
            particleCount: 30,
            spread: 40,
            origin: { x: left / window.innerWidth, y: top / window.innerHeight },
            colors: ["#FFD166", "#118AB2"],
          });
        } else if (newCount === 10) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: left / window.innerWidth, y: top / window.innerHeight },
            colors: ["#FF6B8B", "#06D6A0", "#118AB2"],
          });
        }
      }
      return newCount;
    });
  };

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    if (!accepted) {
      const id = window.requestAnimationFrame(() => {
        if (!hasMoved && yesWrapRef.current) {
          const rect = yesWrapRef.current.getBoundingClientRect();
          const left = clamp(rect.right + 16, 16, window.innerWidth - 140);
          const top = clamp(rect.top, 16, window.innerHeight - 60);
          setNoPosition({ x: left, y: top });
          return;
        }
        moveNoButton();
      });
      return () => window.cancelAnimationFrame(id);
    }
    const handleResize = () => moveNoButton();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [accepted, hasMoved]);

  const handleYes = () => {
    setAccepted(true);
    setShowHearts(true);

    // Epic confetti celebration
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#FF6B8B", "#FFD166", "#06D6A0", "#118AB2", "#FF9AA2"],
      shapes: ['circle', 'square']
    });

    // Additional bursts
    setTimeout(() => confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FF6B8B", "#FF9AA2"]
    }), 250);

    setTimeout(() => confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#06D6A0", "#118AB2"]
    }), 500);

    // Play celebration sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => { });
  };

  const handleSaveMemory = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "valentine-memory.png";
      link.click();
    } catch (error) {
      setSaveError("Couldn't save the image. Try a screenshot instead.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border-2 border-rose/20 bg-white/90 p-8 text-center shadow-2xl">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="font-display text-3xl text-wine">Link Not Found</h2>
          <p className="mt-3 text-wine/70">
            This love card expired or the link is invalid.
          </p>
          <a
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose to-pink-400 px-6 py-3 text-sm font-bold text-white hover:shadow-lg transition-all"
          >
            Create Your Own Love Card
            <Sparkles className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8">
      <FloatingElements />
      <div className="absolute inset-0 bg-gradient-to-br from-soft via-white to-pink-50" />
      <div className="noise-layer absolute inset-0 opacity-5" />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose/20 via-pink-400/20 to-purple-400/20 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-rose shadow-lg"
            >
              <Sparkles className="h-3 w-3" />
              Love Note Incoming
              <Zap className="h-3 w-3" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">💌</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose">
                  Incoming Message
                </p>
                <p className="text-sm text-wine/70">From someone who cares about you</p>
              </div>
            </motion.div>

            <motion.h2
              {...fadeInUp}
              className="text-wine"
            >
              <span className="block text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-wine/70">
                Hey
              </span>
              <span className="block font-display text-4xl sm:text-7xl">
                <GlitchText>{payload.name}</GlitchText>
              </span>
              <span className="mt-3 block font-display text-xl sm:text-2xl text-rose">
                I made something for you. 🎁
              </span>
            </motion.h2>

            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-2xl text-base text-wine/70 sm:text-lg px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-sm"
            >
              <span className="font-medium text-rose">💌 A small surprise:</span>{" "}
              Tap to open it. The “Not now” button is a little shy and may move.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex flex-wrap gap-2 justify-center"
            >
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-rose/10 text-rose">
                <Heart className="h-3 w-3" /> Surprise Mode: ON
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600">
                <Gamepad2 className="h-3 w-3" /> Friendly Challenge
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600">
                <Trophy className="h-3 w-3" /> Catch Streak: 0
              </span>
            </motion.div>

            <motion.p
              {...fadeInUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-2xl text-base text-wine/70 sm:text-lg"
            >
              Choose a button to open your surprise.
            </motion.p>

            {insults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-2"
              >
                {insults.map((insult, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-wine/70 backdrop-blur-sm"
                  >
                    {insult}
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mt-10 flex flex-col items-center gap-6 sm:flex-row"
              ref={yesWrapRef}
            >
              <motion.button
                type="button"
                onClick={handleYes}
                whileHover={{ scale: 1.15, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 20px rgba(255, 107, 139, 0.3)",
                    "0 0 40px rgba(255, 107, 139, 0.6)",
                    "0 0 20px rgba(255, 107, 139, 0.3)"
                  ]
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
                className="group relative rounded-full bg-gradient-to-r from-rose to-pink-400 px-12 py-5 text-xl font-bold text-white shadow-2xl"
              >
                <span className="flex items-center justify-center gap-3">
                  Open the Surprise
                  <Heart className="h-6 w-6 group-hover:fill-white transition-colors" />
                </span>
                <span className="absolute -inset-1 rounded-full bg-rose/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {!hasMoved && (
                <button
                  type="button"
                  onMouseEnter={() => {
                    setHasMoved(true);
                    moveNoButton();
                  }}
                  onPointerDown={() => {
                    setHasMoved(true);
                    moveNoButton();
                  }}
                  onClick={(event) => event.preventDefault()}
                  className="rounded-full border-2 border-rose/50 bg-white/90 px-10 py-4 text-lg font-bold text-wine shadow-lg hover:shadow-xl transition-all cursor-not-allowed"
                  aria-disabled="true"
                >
                  <span className="flex items-center gap-2">
                    Not now
                    <Ghost className="h-5 w-5" />
                  </span>
                </button>
              )}
            </motion.div>

            {hasMoved && (
              <motion.button
                ref={noButtonRef}
                type="button"
                onMouseEnter={moveNoButton}
                onPointerDown={(event) => {
                  event.preventDefault();
                  moveNoButton();
                }}
                onTouchStart={(event) => {
                  event.preventDefault();
                  moveNoButton();
                }}
                onClick={(event) => event.preventDefault()}
                animate={{ left: noPosition.x, top: noPosition.y }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="fixed rounded-full border-2 border-rose/50 bg-white/90 backdrop-blur-sm px-10 py-4 text-lg font-bold text-wine shadow-2xl hover:shadow-3xl transition-shadow"
                style={{ touchAction: "none" }}
                data-touch={isTouch ? "true" : "false"}
                aria-disabled="true"
              >
                <span className="flex items-center gap-2">
                  Not now
                  <Ghost className="h-5 w-5 animate-pulse" />
                </span>
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 rounded-2xl bg-white/30 backdrop-blur-sm max-w-md"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-rose">{buttonClickCount}</p>
                  <p className="text-xs text-wine/60">Clicks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{Math.floor(buttonClickCount / 3)}</p>
                  <p className="text-xs text-wine/60">Insults</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{Math.floor(buttonClickCount * 1.5)}</p>
                  <p className="text-xs text-wine/60">Love Points</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-wine/40 text-center">
                Keep going! The "No" button gets slower after 10 clicks 😉
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center gap-10 text-center px-4"
          >
            <PixelRain active={showHearts} />

            <div
              ref={cardRef}
              className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block text-5xl mb-4"
              >
                🎉
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl sm:text-6xl text-wine"
              >
                <GlitchText>Surprise opened!</GlitchText> 💌
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-3 text-wine/70 sm:text-lg"
              >
                Your message landed—here’s the love card.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-6 flex flex-wrap justify-center gap-3"
              >
                {["Enchanted", "Mood: Locked", "Message: Sent", "Hearts: Full"].map((badge, i) => (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-rose/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose"
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>

              <div className="mt-8 grid gap-8 sm:grid-cols-[1.1fr_1fr] sm:items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="overflow-hidden rounded-3xl border-2 border-rose/20 bg-gradient-to-br from-white to-rose/5"
                >
                  {payload.imageUrl ? (
                    <img
                      src={payload.imageUrl}
                      alt="Love Card"
                      crossOrigin="anonymous"
                      className="h-72 w-full object-cover sm:h-80"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-7xl bg-gradient-to-br from-rose/10 to-pink-400/10 sm:h-80">
                      💝
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="text-left space-y-6"
                >
                  <div className="rounded-2xl bg-white/70 p-5">
                    <p className="font-display text-2xl text-wine leading-relaxed">
                      "{payload.message}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose to-pink-400 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" fill="white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose">
                          From Your Secret Admirer
                        </p>
                        <p className="text-xs text-wine/60">Sealed with digital love</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-wine/70">
                      <span className="inline-flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        Mood: {payload.vibe || "Perfect"}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        Theme: {payload.theme || "Kawaii Core"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-rose/10">
                    <p className="text-sm text-wine/60">
                      Save this moment and share the love.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-wine/70"
              >
                <button
                  type="button"
                  onClick={handleSaveMemory}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 hover:bg-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {saving ? "Saving..." : "Save This Memory"}
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "A Valentine surprise for you!",
                        text: `${payload.name} just received a sweet Valentine surprise!`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose/20 to-pink-400/20 px-4 py-2 hover:from-rose/30 hover:to-pink-400/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Flex on Socials
                </button>
              </motion.div>
              {saveError && (
                <p className="mt-2 text-xs font-semibold text-rose">
                  {saveError}
                </p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-sm text-wine/40">
                Made with 💖 for a Valentine surprise
              </p>
              <a
                href="/"
                className="inline-block mt-4 text-sm font-medium text-rose hover:text-wine transition-colors"
              >
                Create your own love card →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect");

    let searchToUse = window.location.search;
    if (redirectParam) {
      try {
        const redirectUrl = new URL(redirectParam, window.location.origin);
        const basePath = import.meta.env.BASE_URL || "/";
        const normalizedBase = basePath.endsWith("/")
          ? basePath
          : `${basePath}/`;
        const normalizedPath = redirectUrl.pathname.startsWith("/")
          ? redirectUrl.pathname
          : `${normalizedBase}${redirectUrl.pathname}`;

        window.history.replaceState(
          {},
          "",
          `${normalizedPath}${redirectUrl.search}${redirectUrl.hash}`
        );
        searchToUse = redirectUrl.search || "";
      } catch (error) {
        searchToUse = window.location.search;
      }
    }

    const paramsForData = new URLSearchParams(searchToUse);
    let dataParam = paramsForData.get("data") || paramsForData.get("d");

    if (!dataParam && window.location.hash) {
      const hash = window.location.hash.replace(/^#/, "");
      const hashParams = new URLSearchParams(hash);
      dataParam = hashParams.get("d") || hashParams.get("data");
      if (!dataParam && hash.startsWith("d=")) {
        dataParam = hash.slice(2);
      }
    }

    if (!dataParam) return;

    try {
      const decoded = decodePayload(dataParam);
      setPayload(decoded);
    } catch (decodeError) {
      setError("Invalid love card data");
    }
  }, []);

  const showReceiver = Boolean(payload) || Boolean(error);

  return (
    <main className="relative min-h-screen text-wine">
      <style>{`
        @keyframes pixel-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 107, 139, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 107, 139, 0.6);
          }
        }
        
        .heart-float {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }
        
        .sticker-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .pulse-ring {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
        
        .glass-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF6B8B 0%, #FFD166 50%, #06D6A0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,107,139,0.25),_transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(255,159,138,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-soft via-white to-pink-50" />
      <div className="noise-layer absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -left-16 top-24 -z-10 h-64 w-64 rounded-full bg-rose/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-pink-300/30 blur-[120px]" />
      {showReceiver ? (
        <ReceiverView
          payload={
            payload ?? {
              name: "Valentine",
              message: "You make my heart smile.",
              vibe: "Perfect Match",
            }
          }
          error={error}
        />
      ) : (
        <CreatorView />
      )}
    </main>
  );
}
