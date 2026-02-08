import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Music, Heart, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import FallingPetals from './components/FallingPetals';
import confetti from 'canvas-confetti';

// --- KONFIGURASI PENGGUNA ---
const SONG_URL = "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/Jamrud%20-%20Selamat%20Ulang%20Tahun.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL0phbXJ1ZCAtIFNlbGFtYXQgVWxhbmcgVGFodW4ubXA0IiwiaWF0IjoxNzcwNDYzNzI0LCJleHAiOjE4MDE5OTk3MjR9.KdbjoAxJulZafAqitak0uJLAq74hmlNkblccrBP470I"; 

// SVG Heart untuk efek masking (Buka Pintu)
// Menggunakan encodeURI untuk kompatibilitas CSS
const HEART_MASK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

const PHOTOS = {
  // Foto Slide 1 (Pembuka)
  slide1: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-07%20at%2018.03.167.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDcgYXQgMTguMDMuMTY3LmpwZWciLCJpYXQiOjE3NzA0NjMwNjEsImV4cCI6MTgwMTk5OTA2MX0.QyhTrFx1zsmerCXhO5tnQ1GIzLEISn1N7a1pWPoF1L8",
  // Foto Slide 2 (Perjalanan)
  slide2: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-07%20at%2018.22.4332.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDcgYXQgMTguMjIuNDMzMi5qcGVnIiwiaWF0IjoxNzcwNDYzNDQ0LCJleHAiOjE4MDE5OTk0NDR9.G9C4dtafcTtH4eLtT9Jz9_7YZsL_q0_KpDNbhxYI8zg",
  // Foto Slide 3 (Terima Kasih)
  slide3: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-07%20at%2018.22.445.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDcgYXQgMTguMjIuNDQ1LmpwZWciLCJpYXQiOjE3NzA0NjM0NzAsImV4cCI6MTgwMTk5OTQ3MH0.j7UISzKa4jIRqTiRU_VfaclFmcsNLjKbUyDTOoiGkUM",
  // Foto Slide 4 (Doa)
  slide4: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-07%20at%2018.22.444.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDcgYXQgMTguMjIuNDQ0LmpwZWciLCJpYXQiOjE3NzA0NjM0ODUsImV4cCI6MTgwMTk5OTQ4NX0.8RXVcFJpWuPK-yYRazAKPwq-kU8ZKbxu0pCwbn-4HA8",
  // Foto Slide 5 (Penutup)
  slide5: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-07%20at%2018.22.44.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDcgYXQgMTguMjIuNDQuanBlZyIsImlhdCI6MTc3MDQ2MzUwNSwiZXhwIjoxODAxOTk5NTA1fQ.VTUyu0RlXL2BEv6vzDLSTvbgcOKySQ4Zej_ztEh9v5w",
  // Foto Slide 6 (Baru - Harapan Rumah Tangga)
  slide6: "https://bmcenhkcwuxnclmlcriy.supabase.co/storage/v1/object/sign/halimah/WhatsApp%20Image%202026-02-08%20at%2017.15.26.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iODZjZjM2NS1mNTBmLTQwMmQtYjUwMC00Mjg3YjVlYTgxYzkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoYWxpbWFoL1doYXRzQXBwIEltYWdlIDIwMjYtMDItMDggYXQgMTcuMTUuMjYuanBlZyIsImlhdCI6MTc3MDU0NTgxNywiZXhwIjoxODAyMDgxODE3fQ.xavPPcI_11bqDWDprA2KKp9jvC_B1SWPvOPYKNJAJ-I"
};

// Slide Data Structure
interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  bgImage: string;
}

const App: React.FC = () => {
  const [started, setStarted] = useState(false); // Controls music/confetti
  const [showStartScreen, setShowStartScreen] = useState(true); // Controls DOM removal of start screen
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Content for Siti Halimah
  const slides: SlideData[] = [
    {
      id: 1,
      title: "Happy Birthday",
      subtitle: "Siti Halimah",
      text: "Selamat ulang tahun yang ke-31, Istriku tercinta.",
      bgImage: PHOTOS.slide1
    },
    {
      id: 2,
      title: "The Journey",
      subtitle: "Sejak 1995",
      text: "31 tahun perjalanan hidupmu telah membawa begitu banyak kebahagiaan bagi orang-orang di sekitarmu, terutama aku.",
      bgImage: PHOTOS.slide2
    },
    {
      id: 3,
      title: "Terima Kasih",
      subtitle: "My Everything",
      text: "Terima kasih sudah menjadi istri yang sabar, penyayang, dan luar biasa. Senyummu adalah rumah bagiku.",
      bgImage: PHOTOS.slide3
    },
    {
      id: 4,
      title: "Doaku Untukmu",
      subtitle: "Harapan Terbaik",
      text: "Semoga di usiamu yang baru ini, Allah melimpahkan kesehatan, kebahagiaan, dan keberkahan yang tak terputus. Tetaplah bersinar, Sayang.",
      bgImage: PHOTOS.slide4
    },
    {
      id: 5,
      title: "Harapan Kita",
      subtitle: "Till Jannah",
      text: "Semoga rumah tangga kita senantiasa langgeng, sakinah, mawaddah, warahmah. Bersamamu adalah anugerah terindah dalam hidupku.",
      bgImage: PHOTOS.slide6
    },
    {
      id: 6,
      title: "I Love You",
      subtitle: "Selamanya",
      text: "Tidak ada kata yang cukup untuk menggambarkan betapa berartinya dirimu. Happy Birthday, Sayangku!",
      bgImage: PHOTOS.slide5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const triggerConfetti = () => {
    const duration = 4 * 6000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#f43f5e', '#ec4899', '#ffffff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#f43f5e', '#ec4899', '#ffffff'] });
    }, 250);
  };

  const handleStart = () => {
    setStarted(true);
    triggerConfetti();
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch(e => {
        console.log("Audio play failed:", e);
      });
    }

    // Wait for the heart animation to finish (2s) before removing the start screen from DOM
    // This isn't strictly necessary visually since the heart covers it, but good for cleanup
    setTimeout(() => {
      setShowStartScreen(false);
    }, 2500);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (started && isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [started, isPlaying, currentSlide]);

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center items-center">
      {/* Mobile Container */}
      <div className="relative w-full max-w-[430px] h-[100dvh] overflow-hidden bg-black text-white shadow-2xl ring-1 ring-white/10">
        
        <audio ref={audioRef} loop>
          <source src={SONG_URL} type="audio/mpeg" />
        </audio>

        {/* --- START SCREEN (LAYER BAWAH) --- */}
        {showStartScreen && (
          <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center p-8 text-center space-y-8">
            <FallingPetals />
            <div className="relative">
              <div className="absolute -inset-4 bg-rose-500/20 blur-xl rounded-full animate-pulse"></div>
              <Heart className="w-20 h-20 text-rose-500 animate-bounce relative z-10" fill="#f43f5e" />
            </div>
            <div>
              <h1 className="text-lg serif-font text-white mb-2">Untuk Istriku</h1>
              <h2 className="text-4xl cursive-font wedding-font text-white mb-2">Siti Halimah</h2>
              <p className="text-sm text-rose-300 italic">Selamat Ulang Tahun ke-31</p>
            </div>
            <button 
              onClick={handleStart}
              className="group relative px-8 py-3 bg-white text-black rounded-full font-bold tracking-wider hover:bg-rose-50 transition-all transform hover:scale-105 active:scale-95 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] z-50 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2 text-sm">
                BUKA <Sparkles className="w-4 h-4 text-rose-500" />
              </span>
            </button>
          </div>
        )}

        {/* --- MAIN SLIDESHOW (LAYER ATAS DENGAN MASKING) --- */}
        {/* 
            Container ini berada di atas Start Screen (z-20).
            Awalnya, mask-size adalah 0%, sehingga container ini TIDAK TERLIHAT (tembus pandang ke Start Screen).
            Saat 'started' true, mask-size membesar, membuat slideshow terlihat dari tengah (bentuk hati).
            pointer-events diatur agar kita bisa klik tombol di Start Screen saat slideshow belum muncul.
        */}
        <div 
          className={`absolute inset-0 z-20 transition-all duration-1000 ${started ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{
            maskImage: `url('${HEART_MASK_SVG}')`,
            WebkitMaskImage: `url('${HEART_MASK_SVG}')`,
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            // Saat belum mulai: 0% (tidak terlihat). Saat mulai: 300% (membesar memenuhi layar)
            maskSize: started ? '300vmax' : '0%',
            WebkitMaskSize: started ? '300vmax' : '0%',
            transition: 'mask-size 2.5s ease-in-out, -webkit-mask-size 2.5s ease-in-out'
          }}
        >
          <FallingPetals />

          {/* Slides Loop */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10"></div>
              
              <img 
                src={slide.bgImage} 
                alt="Slide Background" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1000&auto=format&fit=crop";
                }}
                className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"}`}
              />
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center mt-12">
                <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <h3 className="text-rose-300 tracking-[0.3em] uppercase text-[10px] mb-3 font-bold animate-pulse">
                    {slide.subtitle}
                  </h3>
                  <h1 className="text-3xl font-bold serif-font mb-4 text-white leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <div className="w-12 h-0.5 bg-rose-500 mx-auto mb-6 rounded-full"></div>
                  <p className="text-sm text-gray-100 font-light leading-relaxed serif-font italic px-2 drop-shadow-md">
                    "{slide.text}"
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full z-30 flex gap-1 p-2 pt-4 safe-area-top">
            {slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-rose-500 transition-all duration-300 ${
                    idx < currentSlide ? "w-full" : 
                    idx === currentSlide ? "w-full animate-progress" : "w-0"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Invisible Click Areas */}
          <div className="absolute inset-0 z-20 flex">
            <div className="w-1/3 h-full" onClick={() => { setIsPlaying(false); prevSlide(); }}></div>
            <div className="w-1/3 h-full" onClick={() => setIsPlaying(!isPlaying)}></div>
            <div className="w-1/3 h-full" onClick={() => { setIsPlaying(false); nextSlide(); }}></div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-12 left-0 w-full z-30 px-6 flex justify-between items-end pb-safe">
            <div className="flex flex-col">
               <button onClick={() => setIsPlaying(!isPlaying)} className="text-left group">
                 <span className="text-[10px] text-rose-300 uppercase tracking-widest font-bold block mb-1">Status</span>
                 <div className="flex items-center gap-2 text-white/90 group-hover:text-white">
                   {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                   <span className="text-xs">{isPlaying ? "Memutar..." : "Jeda"}</span>
                 </div>
               </button>
            </div>
            <button 
              onClick={toggleAudio}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isAudioPlaying ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-white/50'}`}
            >
              {isAudioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .safe-area-top {
          padding-top: env(safe-area-inset-top, 16px);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
};

export default App;