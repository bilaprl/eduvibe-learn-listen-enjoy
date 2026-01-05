"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export default function EduVibeApp() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<
    "desc" | "quesioner" | "about" | "help" | null
  >(null);
  null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordStatus, setRecordStatus] = useState(
    "Siap merekam cerita motivasimu..."
  );

  const [selectedSong, setSelectedSong] = useState(0);
  // const [sdView, setSdView] = useState("video");

  const [sdView, setSdView] = useState("video");
  const [sdTab, setSdTab] = useState("nasional");
  const [smpView, setSmpView] = useState("video");
  const [smaView, setSmaView] = useState("video");

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/ogg; codecs=opus",
      });
      setAudioURL(URL.createObjectURL(blob));
    };

    recorder.start();
    setIsRecording(true);
    setRecordStatus("Sedang Merekam...");
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setRecordStatus("Selesai Rekam");
  };

  const nextSlide = () => setActiveSlide((prev) => prev + 1);
  const resetApp = () => {
    setActiveSlide(1);
    setRating(0);
  };

  // Definisikan struktur tiap lagu
  interface Song {
    title: string;
    id: string;
    desc: string;
    history: string;
  }

  // Definisikan struktur objek songData
  interface SongCollection {
    [key: string]: Song[]; // Ini mengizinkan string sebagai index
    nasional: Song[];
    daerah: Song[];
  }

  const westernSongs = [
    { title: "Imagine", artist: "John Lennon", id: "YkgkThdzX-8" },
    { title: "Count on Me", artist: "Bruno Mars", id: "4JNtAtGGNRU" },
    { title: "Fix You", artist: "Coldplay", id: "k4V3Mo61fJM" },
  ];

  const popSongs = [
    { title: "Hati-Hati di Jalan", artist: "Tulus", id: "_N6vSc_mT6I" },
    { title: "Laskar Pelangi", artist: "Nidji", id: "fO1iJqBdXrc" },
    { title: "Monokrom", artist: "Tulus", id: "QqJ-Vp8mvbk" },
  ];

  const songData: SongCollection = {
    nasional: [
      {
        id: "5rX1EF_VzeE", // Indonesia Raya (Instrumental/Official)
        title: "Indonesia Raya",
        desc: "Lagu ini adalah simbol pemersatu bangsa. Maknanya adalah doa dan janji setia kepada tanah air, membangun jiwa dan raga untuk kejayaan Indonesia yang merdeka.",
        history:
          "Diciptakan oleh W.R. Supratman dan pertama kali dikumandangkan pada peristiwa Sumpah Pemuda, 28 Oktober 1928 di Jakarta. Lagu ini menandai kebangkitan semangat nasionalisme.",
      },
      {
        id: "JTZhCGbsCSI", // Garuda Pancasila
        title: "Garuda Pancasila",
        desc: "Menggambarkan keteguhan hati rakyat Indonesia untuk setia kepada Pancasila sebagai ideologi negara dan semangat berkorban demi nusa dan bangsa.",
        history:
          "Diciptakan oleh Sudharnoto pada tahun 1956. Lagu ini sering dinyanyikan untuk menanamkan nilai-nilai patriotisme sejak usia dini kepada siswa sekolah.",
      },
    ],
    daerah: [
      {
        id: "gtCS-eJF3kM", // Ampar Ampar Pisang
        title: "Ampar-Ampar Pisang",
        desc: "Lagu ini bercerita tentang kebiasaan masyarakat Kalimantan saat mengolah pisang menjadi makanan (rimpi). Memiliki nada yang ceria dan penuh semangat.",
        history:
          "Berasal dari Kalimantan Selatan. Awalnya merupakan lagu yang dinyanyikan saat bekerja bersama-sama, menunjukkan budaya gotong royong dan kebersamaan masyarakat lokal.",
      },
      {
        id: "ZJNFfTM1wP4", // Yamko Rambe Yamko
        title: "Yamko Rambe Yamko",
        desc: "Lagu ini memiliki irama yang sangat energetik dan sering digunakan untuk tarian perang atau penyambutan. Menggambarkan semangat perjuangan dan keberanian.",
        history:
          "Berasal dari Papua. Meskipun sering dikaitkan dengan perjuangan, lagu ini telah menjadi identitas budaya Papua yang sangat populer di tingkat nasional karena keunikan ritmenya.",
      },
    ],
  };

  return (

   <main className="h-screen w-screen bg-white overflow-hidden flex flex-col">
      <div className="w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex-grow flex flex-col">
        <nav
          className={`w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-[100] fixed top-0 transition-all duration-500 ${
            activeSlide === 1
              ? "bg-transparent border-b border-white/10"
              : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
          }`}
        >
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => setActiveSlide(1)}
          >
            {/* Perubahan: rounded-full membuat logo menjadi bulat sempurna */}
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Teks Brand tetap sama */}
            <h1 className="text-xl md:text-2xl font-black tracking-tighter">
              <span
                className={
                  activeSlide === 1 ? "text-blue-400" : "text-brand-blue"
                }
              >
                Edu
              </span>
              <span className="text-brand-yellow">Vibe</span>
            </h1>
          </div>

          {/* Navigasi Halaman (Desktop & Tablet - Tetap tersembunyi di mobile) */}
          <div
            className={`hidden md:flex items-center gap-1 p-1 rounded-2xl ${
              activeSlide === 1 ? "bg-white/10 backdrop-blur-md" : "bg-gray-100"
            }`}
          >
            {[
              { id: 1, label: "Home", icon: "home" },
              { id: 2, label: "Intro", icon: "explore" },
              { id: 3, label: "Level SD", icon: "child_care" },
              { id: 4, label: "Level SMP", icon: "face" },
              { id: 5, label: "Level SMA", icon: "mic" },
              { id: 6, label: "Rating", icon: "star" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSlide(item.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeSlide === item.id
                    ? "bg-brand-yellow text-blue-900 shadow-lg scale-105"
                    : activeSlide === 1
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-brand-blue hover:bg-white"
                }`}
              >
                <span className="material-icons text-sm">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Navigasi Mobile (Floating Style - Dioptimalkan) */}
          <div className="md:hidden flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                activeSlide === 1
                  ? "bg-white/10 border-white/20 backdrop-blur-lg"
                  : "bg-white border-brand-blue/10 shadow-sm"
              }`}
            >
              <div className="flex flex-col items-end leading-none">
                <span
                  className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                    activeSlide === 1 ? "text-white/70" : "text-brand-blue/50"
                  }`}
                >
                  Slide
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    activeSlide === 1 ? "text-white" : "text-brand-blue"
                  }`}
                >
                  {activeSlide} / 6
                </span>
              </div>
              <div className="w-[1px] h-4 bg-gray-300/30 mx-1" />
              <div className="bg-brand-yellow text-blue-900 w-7 h-7 flex items-center justify-center rounded-full font-black text-xs shadow-lg animate-pulse">
                <span className="material-icons text-sm">
                  {activeSlide === 6 ? "star" : "menu_book"}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* 1. Splash Screen & Main Menu */}
        {activeSlide === 1 && (
          <section className="min-h-screen w-full flex flex-col md:flex-row animate-fade-in bg-brand-blue text-white overflow-hidden relative">
            {/* Dekorasi Background */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[20%] w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {/* SISI KIRI: Branding & Identity */}
            {/* Penambahan pt-24 (Mobile) dan pt-0 (Desktop) agar tidak menempel Navbar */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 pt-28 md:pt-12 md:p-12 text-center z-10 relative">
              <div className="relative group">
                {/* Efek Cahaya */}
                <div className="absolute inset-0 bg-white rounded-full blur-xl group-hover:blur-2xl opacity-30 transition-all" />

                {/* Ukuran logo responsif: lebih kecil di mobile (w-32) agar muat layar */}
                <div className="w-40 h-40 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative transition-transform duration-500 group-hover:rotate-12 overflow-visible border-4 border-white/20">
                  <div className="relative w-35 h-35 md:w-56 md:h-56 rounded-full overflow-hidden">
                    <Image
                      src="/images/logo.jpeg"
                      alt="EduVibe Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Badge dekoratif */}
                  <div className="absolute -right-1 -bottom-1 md:-right-2 md:-bottom-2 bg-brand-yellow p-1 md:p-2 rounded-lg md:rounded-xl shadow-md border border-brand-blue animate-bounce z-20">
                    <span className="material-icons text-blue-900 text-[8px] md:text-xs font-bold">
                      auto_awesome
                    </span>
                  </div>
                </div>
              </div>

              {/* Judul Responsif */}
              <h1 className="text-5xl md:text-8xl font-black mb-3 tracking-tighter drop-shadow-2xl flex">
                <span className="text-blue-400">Edu</span>
                <span className="text-brand-yellow">Vibe</span>
              </h1>

              <div className="h-1.5 w-24 md:w-32 bg-white/20 rounded-full mb-4 mx-auto overflow-hidden">
                <div className="h-full bg-brand-yellow w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
              </div>

              <p className="text-sm md:text-2xl opacity-90 font-medium tracking-[0.2em] uppercase flex items-center gap-2">
                <span>Learn</span>
                <span className="text-brand-yellow text-xl">•</span>
                <span>Listen</span>
                <span className="text-brand-yellow text-xl">•</span>
                <span>Enjoy</span>
              </p>
            </div>

            {/* SISI KANAN: Menu Interaktif */}
            {/* Menggunakan p-6 (Mobile) agar tombol tidak terlalu mepet ke pinggir layar */}
            <div className="flex-1 bg-white/5 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-16 flex flex-col justify-center gap-4 md:gap-6 z-10 shadow-2xl h-full">
              <div className="mb-4 md:mb-8 hidden md:block">
                <h2 className="text-3xl font-bold mb-2 text-brand-yellow animate-pulse">
                  Selamat Datang!
                </h2>
                <p className="text-white/70 text-lg">
                  Pilih menu di bawah untuk memulai petualangan musikmu hari
                  ini.
                </p>
              </div>

              {/* Tombol-tombol Responsif */}
              <div className="w-full max-w-md mx-auto flex flex-col gap-4">
                <button
                  onClick={nextSlide}
                  className="group w-full bg-brand-yellow text-blue-900 font-black py-4 md:py-7 rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-white hover:scale-[1.03] transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-3 text-lg md:text-2xl uppercase tracking-wider"
                >
                  <span>Mulai Belajar</span>
                  <span className="material-icons group-hover:translate-x-2 transition-transform text-2xl md:text-3xl">
                    play_arrow
                  </span>
                </button>

                <button
                  onClick={() => setIsModalOpen("about")}
                  className="w-full bg-white/10 border-2 border-white/20 py-3 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] font-bold hover:bg-white/20 hover:border-white transition-all flex items-center justify-center gap-3 text-sm md:text-lg backdrop-blur-sm"
                >
                  <span className="material-icons text-brand-yellow">
                    info_outline
                  </span>
                  Tentang Aplikasi
                </button>

                <div className="mt-2 md:mt-4 flex flex-col items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen("help")}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] group"
                  >
                    <span className="material-icons text-xs md:text-sm group-hover:rotate-12 transition-transform">
                      help_outline
                    </span>
                    Pusat Bantuan
                  </button>

                  <div className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-4 md:mt-8">
                    &copy; 2026 EduVibe Interactive
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Pengenalan Singkat - Full Screen Layout */}
        {activeSlide === 2 && (
          <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-white overflow-x-hidden relative">
            {/* --- HEADER SECTION: NEW ARCH DESIGN --- */}
            <div className="relative w-full">
              {/* Background Utama */}
              <div className="bg-brand-blue pt-24 pb-32 md:pt-48 md:pb-56 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                {/* Dekorasi Cahaya Abstrak */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />

                {/* Floating Music Notes */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap gap-10 md:gap-20 p-10 justify-center">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-icons text-white text-6xl md:text-8xl rotate-12"
                    >
                      music_note
                    </span>
                  ))}
                </div>

                {/* Konten Teks Header */}
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 bg-brand-yellow text-blue-900 px-5 py-2 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        auto_awesome
                      </span>
                      Modul Teori Musik
                    </div>

                    {/* Judul */}
                    <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-8 tracking-tighter leading-[1.1] md:leading-[1.05]">
                      Eksplorasi <br className="hidden md:block" />
                      <span className="text-brand-yellow">EduVibe</span>
                    </h2>

                    {/* Paragraf: max-w-2xl memastikan teks tidak terlalu lebar saat di tengah */}
                    <p className="text-white/80 text-base md:text-2xl max-w-2xl font-light leading-relaxed px-4">
                      Pahami fondasi seni suara dan cara teknologi membantu kita
                      mengapresiasi setiap nada yang tercipta.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- CONTENT SECTION: FLOATING CARDS --- */}
            {/* Margin top disesuaikan agar kartu tidak menutupi teks header di mobile (-mt-16) */}
            <div className="w-full px-6 md:px-12 lg:px-24 -mt-16 md:-mt-32 relative z-20 pb-16">
              <div className="max-w-7xl mx-auto">
                {/* 3 Pilar Utama: Gap diperkecil di mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 mb-16 md:mb-20">
                  {[
                    {
                      title: "Education",
                      icon: "school",
                      desc: "Kurikulum musik terstruktur, dari tangga nada dasar hingga teori kompleks untuk mengasah kognitif.",
                      color: "text-brand-blue",
                      bg: "bg-white",
                      border: "border-gray-100",
                    },
                    {
                      title: "Music",
                      icon: "album",
                      desc: "Perpaduan ritme dan harmoni sebagai sarana komunikasi universal yang melampaui batas bahasa.",
                      color: "text-brand-yellow",
                      bg: "bg-white",
                      border: "border-gray-100",
                    },
                    {
                      title: "Podcast",
                      icon: "podcasts",
                      desc: "Media audio modern untuk mendalami sejarah instrumen dan cerita inspiratif di balik karya legendaris.",
                      color: "text-red-500",
                      bg: "bg-white",
                      border: "border-gray-100",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`${item.bg} p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border ${item.border} shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group relative`}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gray-50 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-brand-blue transition-colors duration-500">
                        <span
                          className={`material-icons ${item.color} group-hover:text-white text-4xl md:text-5xl transition-colors`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sejarah Musik: Layout Flex Column di Mobile */}
                <div className="bg-gray-50 rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col lg:flex-row mb-10">
                  <div className="lg:w-1/3 bg-brand-blue p-10 md:p-16 text-white relative overflow-hidden">
                    <span className="material-icons text-[10rem] md:text-[15rem] absolute -bottom-10 -right-10 opacity-10 rotate-12">
                      history_edu
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight relative z-10">
                      Timeline <br />
                      Musik
                    </h3>
                    <div className="w-12 md:w-16 h-1.5 md:h-2 bg-brand-yellow rounded-full relative z-10"></div>
                  </div>

                  <div className="lg:w-2/3 p-8 md:p-16 flex flex-col justify-center gap-8 md:gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                      <div className="space-y-3 md:space-y-4">
                        <h5 className="font-black text-brand-blue uppercase tracking-widest text-[10px] md:text-sm">
                          Era Prasejarah
                        </h5>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          Bermula dari tiruan suara alam dan detak jantung.
                          Instrumen tertua ditemukan berusia lebih dari 40.000
                          tahun.
                        </p>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <h5 className="font-black text-brand-blue uppercase tracking-widest text-[10px] md:text-sm">
                          Era Digital
                        </h5>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          Teknologi mengubah cara kita mencipta. Musik kini
                          hadir dalam genggaman dan dapat dibagikan secara
                          instan.
                        </p>
                      </div>
                    </div>
                    <blockquote className="border-l-4 border-brand-yellow pl-5 md:pl-6 py-1 md:py-2 italic text-gray-500 text-base md:text-lg font-medium">
                      "Musik bukan sekadar hiburan; ia adalah catatan sejarah
                      peradaban manusia yang paling jujur."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="mt-auto p-6 md:p-8 md:px-24 bg-white border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              <button
                onClick={() => setActiveSlide(1)}
                className="group text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 md:gap-3 font-bold text-base md:text-lg order-2 md:order-1"
              >
                <span className="material-icons group-hover:-translate-x-2 transition-transform">
                  arrow_back
                </span>
                Kembali
              </button>

              <button
                onClick={nextSlide}
                className="group w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-10 md:px-16 rounded-full flex items-center justify-center gap-3 md:gap-4 font-black text-lg md:text-xl hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all active:scale-95 order-1 md:order-2"
              >
                Lanjut ke Materi
                <span className="material-icons group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </section>
        )}

        {/* 3. Slide SD - Edukasi Lagu Nasional & Daerah */}
        {activeSlide === 3 && (
          <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
            {/* --- HEADER SECTION --- */}
            <div className="relative w-full">
              {/* Update: Lengkungan diperbaiki menjadi md:rounded-b-[10rem] agar lebih estetik dan konsisten */}
              <div className="bg-brand-blue pt-20 pb-32 md:pt-40 md:pb-56 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                {/* Dekorasi Cahaya */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                  {/* Update: items-center & text-center untuk laptop dan mobile */}
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 bg-brand-yellow text-blue-900 px-5 py-1.5 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        auto_awesome
                      </span>
                      Koleksi Edukasi SD
                    </div>

                    {/* Judul: Dipusatkan dengan text-center */}
                    <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight">
                      Eksplorasi <span className="text-brand-yellow">Lagu</span>
                    </h2>

                    {/* Update: Penambahan Deskripsi Singkat */}
                    <p className="text-white/80 text-base md:text-2xl max-w-2xl font-light leading-relaxed px-4 mb-8 md:mb-10">
                      Mari mengenal kekayaan budaya Indonesia melalui harmoni
                      lagu nasional dan daerah yang penuh makna dan cerita.
                    </p>

                    {/* Tab Switcher Responsif: Dipusatkan */}
                    <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
                      {["nasional", "daerah"].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setSdTab(type);
                            setSelectedSong(0);
                          }}
                          className={`px-8 md:px-12 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase ${
                            sdTab === type
                              ? "bg-white text-brand-blue shadow-lg"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          {type === "nasional"
                            ? "Lagu Nasional"
                            : "Lagu Daerah"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            {/* -mt disesuaikan agar tidak menabrak header di mobile */}
            <div className="w-full px-4 md:px-12 lg:px-24 -mt-12 md:-mt-24 relative z-20 pb-16 flex-grow">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                {/* SIDEBAR NAVIGATION: Berubah jadi bar horizontal di bawah header pada mobile */}
                <div className="lg:sticky lg:top-10 flex lg:flex-col gap-3 bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-white order-2 lg:order-1 w-full lg:w-auto justify-center">
                  <button
                    onClick={() => setSdView("video")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      sdView === "video"
                        ? "bg-red-500 text-white shadow-lg shadow-red-200"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      play_circle
                    </span>
                    <span className="lg:hidden ml-2 font-bold text-xs uppercase">
                      Video
                    </span>
                  </button>
                  <button
                    onClick={() => setSdView("buku")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      sdView === "buku"
                        ? "bg-brand-blue text-white shadow-lg shadow-blue-200"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      menu_book
                    </span>
                    <span className="lg:hidden ml-2 font-bold text-xs uppercase">
                      Materi
                    </span>
                  </button>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-grow w-full order-1 lg:order-2 flex flex-col gap-5 md:gap-6">
                  {/* PLAYLIST HORIZONTAL: no-scrollbar tetap aktif */}
                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {songData[sdTab as keyof SongCollection].map(
                      (song, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSong(index)}
                          className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all border-2 flex items-center gap-2 md:gap-3 ${
                            selectedSong === index
                              ? "bg-brand-blue text-white border-brand-blue shadow-md"
                              : "bg-white text-gray-400 border-transparent shadow-sm"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] md:text-[10px] ${
                              selectedSong === index
                                ? "bg-white/20"
                                : "bg-slate-100"
                            }`}
                          >
                            {index + 1}
                          </span>
                          {song.title}
                        </button>
                      )
                    )}
                  </div>

                  {sdView === "video" ? (
                    <div className="animate-slide-up bg-white p-2 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border-[6px] md:border-[12px] border-white">
                      <div className="relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-inner">
                        {songData[sdTab as keyof SongCollection][selectedSong]
                          ?.id ? (
                          <iframe
                            key={`${sdTab}-${selectedSong}`}
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${
                              songData[sdTab as keyof SongCollection][
                                selectedSong
                              ].id
                            }?autoplay=0&rel=0&modestbranding=1`}
                            title="Video Player"
                            frameBorder="0"
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                            <span className="material-icons text-4xl mb-2">
                              videocam_off
                            </span>
                            <p className="text-xs font-bold">Tidak Tersedia</p>
                          </div>
                        )}
                      </div>

                      {/* Label Lagu Responsif */}
                      <div className="mt-6 md:mt-8 px-2 md:px-4 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-3xl font-black text-brand-blue uppercase tracking-tighter italic leading-tight">
                            {
                              songData[sdTab as keyof SongCollection][
                                selectedSong
                              ].title
                            }
                          </h3>
                          <p className="text-brand-yellow font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mt-2 bg-brand-yellow/10 inline-block px-2 py-1 rounded">
                            Edukasi Musik SD
                          </p>
                        </div>
                        {/* Visualizer dihilangkan di mobile untuk menghemat ruang */}
                        <div className="hidden md:flex gap-1.5 items-end h-10">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-1 bg-brand-blue/20 rounded-full"
                              style={{ height: `${i * 20}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-slide-up bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-xl p-6 md:p-16 relative overflow-hidden border border-white">
                      <div className="absolute top-0 left-8 md:left-20 bottom-0 w-[1px] md:w-[2px] bg-slate-100" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                          <div className="w-14 h-14 md:w-20 md:h-20 bg-brand-yellow rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg rotate-3">
                            <span className="material-icons text-blue-900 text-2xl md:text-4xl">
                              history_edu
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-5xl font-black text-brand-blue tracking-tighter uppercase leading-none">
                              Detail <br className="md:hidden" /> Materi
                            </h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                          <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100">
                            <h4 className="font-black text-brand-blue text-base md:text-xl mb-3 uppercase italic">
                              Interpretasi
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-lg italic">
                              "
                              {
                                songData[sdTab as keyof SongCollection][
                                  selectedSong
                                ].desc
                              }
                              "
                            </p>
                          </div>
                          <div className="bg-blue-50/50 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-blue-100">
                            <h4 className="font-black text-brand-blue text-base md:text-xl mb-3 uppercase italic">
                              Latar Belakang
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                              {
                                songData[sdTab as keyof SongCollection][
                                  selectedSong
                                ].history
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="p-6 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
              <button
                onClick={() => setActiveSlide(2)}
                className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-bold text-base order-2 md:order-1"
              >
                <span className="material-icons">arrow_back</span> Kembali
              </button>

              <button
                onClick={nextSlide}
                className="w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-10 md:px-16 rounded-full flex items-center justify-center gap-3 font-black text-lg hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all order-1 md:order-2"
              >
                Materi SMP <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* 4. Slide SMP - Musik Pop & Kuesioner */}
        {activeSlide === 4 && (
          <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
            {/* --- HEADER SECTION --- */}
            <div className="relative w-full">
              {/* Update: Radius lengkungan diperbaiki menjadi md:rounded-b-[10rem] untuk konsistensi desain */}
              <div className="bg-brand-blue pt-20 pb-32 md:pt-40 md:pb-56 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                {/* Dekorasi Cahaya Abstrak */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                  {/* Update: items-center & text-center dipasang permanen untuk estetika simetris di laptop */}
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 bg-brand-yellow text-blue-900 px-5 py-1.5 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        trending_up
                      </span>
                      Level SMP - Musik Pop
                    </div>

                    {/* Judul: Rata tengah di semua ukuran layar */}
                    <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight">
                      Eksplorasi{" "}
                      <span className="text-brand-yellow">Musik Modern</span>
                    </h2>

                    {/* Update: Penambahan Deskripsi Singkat (Konsisten dengan slide lainnya) */}
                    <p className="text-white/80 text-base md:text-2xl max-w-2xl font-light leading-relaxed px-4 mb-8 md:mb-10">
                      Selami tren musik masa kini, pahami struktur lagu populer,
                      dan temukan bagaimana teknologi mengubah cara kita
                      berkarya.
                    </p>

                    {/* Tab Switcher: Dipusatkan dengan justify-center di container */}
                    <div className="flex justify-center w-full">
                      <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 w-full sm:w-auto max-w-md sm:max-w-none">
                        {["video", "quesioner"].map((view) => (
                          <button
                            key={view}
                            onClick={() => setSmpView(view)}
                            className={`flex-1 sm:flex-none px-6 md:px-12 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase ${
                              smpView === view
                                ? "bg-white text-brand-blue shadow-lg"
                                : "text-white hover:bg-white/10"
                            }`}
                          >
                            {view === "video" ? "Video Belajar" : "Kuesioner"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="w-full px-4 md:px-12 lg:px-24 -mt-12 md:-mt-24 relative z-20 pb-16 flex-grow">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                {/* SIDEBAR NAVIGATOR: Menjadi bar horizontal di mobile */}
                <div className="lg:sticky lg:top-10 flex lg:flex-col gap-3 bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-white order-2 lg:order-1 w-full lg:w-auto justify-center">
                  <button
                    onClick={() => setSmpView("video")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      smpView === "video"
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      videocam
                    </span>
                  </button>
                  <button
                    onClick={() => setSmpView("quesioner")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      smpView === "quesioner"
                        ? "bg-brand-blue text-white shadow-lg"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      edit
                    </span>
                  </button>
                </div>

                {/* CONTENT DISPLAY */}
                <div className="flex-grow w-full order-1 lg:order-2">
                  {smpView === "video" ? (
                    <div className="flex flex-col gap-5 md:gap-6">
                      {/* Playlist Horizontal */}
                      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {popSongs.map((song, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSong(index)}
                            className={`flex-shrink-0 px-5 py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all border-2 ${
                              selectedSong === index
                                ? "bg-brand-blue text-white border-brand-blue shadow-md"
                                : "bg-white text-gray-400 border-transparent hover:border-gray-200 shadow-sm"
                            }`}
                          >
                            {index + 1}. {song.title}
                          </button>
                        ))}
                      </div>

                      {/* Video Player Box: Padding dikurangi di mobile */}
                      <div className="animate-slide-up bg-white p-2 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border-[6px] md:border-[10px] border-white">
                        <div className="relative aspect-video rounded-xl md:rounded-[2rem] overflow-hidden bg-black shadow-inner">
                          <iframe
                            key={popSongs[selectedSong]?.id}
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${popSongs[selectedSong]?.id}?rel=0`}
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="mt-6 md:mt-8 px-2 md:px-4">
                          <h3 className="text-xl md:text-3xl font-black text-brand-blue tracking-tighter uppercase italic leading-tight">
                            {popSongs[selectedSong]?.title}
                          </h3>
                          <p className="text-gray-400 font-bold mt-1 md:mt-2 uppercase text-[8px] md:text-[10px] tracking-widest">
                            Penyanyi: {popSongs[selectedSong]?.artist}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- KUESIONER SECTION --- */
                    <div className="animate-slide-up bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-6 md:p-16 relative overflow-hidden border border-white">
                      {/* Garis buku disesuaikan jaraknya di mobile */}
                      <div className="absolute top-0 left-8 md:left-20 bottom-0 w-[1.5px] bg-red-100" />
                      <div className="relative z-10 w-full md:max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-5xl font-black text-brand-blue mb-2 md:mb-4 tracking-tighter uppercase">
                          Kuesioner
                        </h3>
                        <p className="text-slate-500 font-bold mb-8 md:mb-10 text-[10px] md:text-sm uppercase tracking-wider">
                          Ceritakan pengalaman belajarmu
                        </p>

                        <div className="space-y-6 md:space-y-8">
                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
                            <p className="font-black text-brand-blue text-[10px] md:text-xs uppercase mb-4 tracking-widest leading-relaxed">
                              1. Bagaimana Keseruan Belajar Hari ini?
                            </p>
                            <div className="flex gap-2 md:gap-4">
                              {["😞", "😐", "🙂", "🤩"].map((emoji, i) => (
                                <button
                                  key={i}
                                  className="flex-grow py-3 md:py-4 bg-white hover:bg-brand-yellow transition-all rounded-xl md:rounded-2xl text-xl md:text-2xl shadow-sm border border-slate-200 active:scale-90"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
                            <p className="font-black text-brand-blue text-[10px] md:text-xs uppercase mb-4 tracking-widest">
                              2. Apa pesan dan kesanmu?
                            </p>
                            <textarea
                              className="w-full bg-white border border-slate-200 p-4 rounded-xl md:rounded-2xl font-bold text-slate-700 h-28 md:h-32 outline-none focus:border-brand-blue text-sm"
                              placeholder="Tulis di sini..."
                            ></textarea>
                          </div>

                          <button className="w-full bg-brand-blue text-white py-4 md:py-5 rounded-full font-black text-base md:text-lg shadow-xl hover:bg-brand-yellow hover:text-blue-900 transition-all active:scale-95">
                            Kirim Jawaban
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="p-6 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
              <button
                onClick={() => setActiveSlide(3)}
                className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-bold text-base order-2 md:order-1"
              >
                <span className="material-icons">arrow_back</span> Kembali
              </button>

              <button
                onClick={nextSlide}
                className="w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-10 md:px-16 rounded-full flex items-center justify-center gap-3 font-black text-lg hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all active:scale-95 order-1 md:order-2"
              >
                Materi SMA
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>
          </section>
        )}

        {/* 5. Slide SMA - Podcast & Western Music */}
        {activeSlide === 5 && (
          <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
            {/* --- HEADER SECTION --- */}
            <div className="relative w-full">
              {/* Update: Bentuk lengkung diperbaiki (md:rounded-b-[10rem]) dan padding disesuaikan */}
              <div className="bg-brand-blue pt-20 pb-32 md:pt-40 md:pb-56 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                {/* Dekorasi Cahaya */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                  {/* Update: Diubah menjadi items-center & text-center untuk tampilan laptop yang simetris */}
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 bg-brand-yellow text-blue-900 px-5 py-1.5 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        podcasts
                      </span>
                      Level SMA/K - Podcast & Western
                    </div>

                    {/* Judul: Dipusatkan */}
                    <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight">
                      Suara{" "}
                      <span className="text-brand-yellow">Masa Depan</span>
                    </h2>

                    {/* Update: Penambahan Deskripsi Singkat */}
                    <p className="text-white/80 text-base md:text-2xl max-w-2xl font-light leading-relaxed px-4 mb-8 md:mb-10">
                      Eksplorasi pengaruh musik barat dalam budaya global dan
                      pelajari cara menyampaikan gagasan kreatif melalui media
                      podcast modern.
                    </p>

                    {/* Tab Switcher: Full width di mobile, tetap proporsional di laptop */}
                    <div className="flex justify-center w-full">
                      <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 w-full sm:w-auto max-w-md sm:max-w-none">
                        {["video", "podcast"].map((view) => (
                          <button
                            key={view}
                            onClick={() => {
                              setSmaView(view);
                              setSelectedSong(0);
                            }}
                            className={`flex-1 sm:flex-none px-6 md:px-12 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase ${
                              smaView === view
                                ? "bg-white text-brand-blue shadow-lg"
                                : "text-white hover:bg-white/10"
                            }`}
                          >
                            {view === "video" ? "Musik Barat" : "Podcast Mic"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="w-full px-4 md:px-12 lg:px-24 -mt-12 md:-mt-24 relative z-20 pb-16 flex-grow">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                {/* SIDEBAR NAVIGATION: Menjadi Horizontal Bar di Mobile */}
                <div className="lg:sticky lg:top-10 flex lg:flex-col gap-3 bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-white order-2 lg:order-1 w-full lg:w-auto justify-center">
                  <button
                    onClick={() => setSmaView("video")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      smaView === "video"
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      subscriptions
                    </span>
                  </button>
                  <button
                    onClick={() => setSmaView("podcast")}
                    className={`flex-1 lg:flex-none w-full lg:w-16 h-12 lg:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${
                      smaView === "podcast"
                        ? "bg-brand-blue text-white shadow-lg"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <span className="material-icons text-xl md:text-3xl">
                      mic
                    </span>
                  </button>
                </div>

                {/* CONTENT DISPLAY */}
                <div className="flex-grow w-full order-1 lg:order-2">
                  {smaView === "video" ? (
                    <div className="flex flex-col gap-5 md:gap-6">
                      {/* Playlist Horizontal */}
                      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {westernSongs.map((song, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSong(index)}
                            className={`flex-shrink-0 px-5 py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all border-2 ${
                              selectedSong === index
                                ? "bg-brand-blue text-white border-brand-blue shadow-md"
                                : "bg-white text-gray-400 border-transparent hover:border-gray-200 shadow-sm"
                            }`}
                          >
                            {index + 1}. {song.title}
                          </button>
                        ))}
                      </div>

                      {/* Video Player Box */}
                      <div className="animate-slide-up bg-white p-2 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border-[6px] md:border-[10px] border-white">
                        <div className="relative aspect-video rounded-xl md:rounded-[2rem] overflow-hidden bg-black shadow-inner">
                          <iframe
                            key={westernSongs[selectedSong]?.id}
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${westernSongs[selectedSong]?.id}?rel=0`}
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="mt-6 md:mt-8 px-2 md:px-4 text-center md:text-left">
                          <h3 className="text-xl md:text-3xl font-black text-brand-blue tracking-tighter uppercase italic leading-tight">
                            {westernSongs[selectedSong]?.title}
                          </h3>
                          <p className="text-gray-400 font-bold mt-1 md:mt-2 uppercase text-[8px] md:text-[10px] tracking-widest">
                            Artist: {westernSongs[selectedSong]?.artist}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- PODCAST RECORDER SECTION --- */
                    <div className="animate-slide-up bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl p-6 md:p-16 relative overflow-hidden border border-white text-center">
                      {/* DEKORASI BACKGROUND: Dot Matrix Pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(#000 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      />

                      {/* Garis Dekoratif Kiri dengan Gradient */}
                      <div className="absolute top-0 left-6 md:left-20 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

                      <div className="relative z-10 flex flex-col items-center w-full">
                        {/* HEADER SECTION DENGAN BADGE */}
                        <div className="mb-10 md:mb-14 text-center">
                          <div className="inline-flex items-center gap-2 bg-slate-900 text-brand-yellow px-4 py-1.5 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest mb-4 shadow-xl">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isRecording
                                  ? "bg-red-500 animate-pulse"
                                  : "bg-green-500"
                              }`}
                            />
                            {isRecording ? "Live Recording" : "Studio Ready"}
                          </div>
                          <h3 className="text-3xl md:text-6xl font-black text-brand-blue tracking-tighter uppercase leading-none mb-3">
                            Podcast{" "}
                            <span className="text-slate-300">Studio</span>
                          </h3>
                          <p className="text-slate-400 font-bold text-xs md:text-base max-w-xs md:max-w-md mx-auto leading-relaxed">
                            Suarakan inspirasimu. Rekam cerita motivasi atau
                            pencapaianmu di studio digital ini.
                          </p>
                        </div>

                        {/* AUDIO PLAYER (HASIL REKAMAN) */}
                        {audioURL && !isRecording && (
                          <div className="mb-10 w-full max-w-lg animate-bounce-in px-2">
                            <div className="bg-slate-900 p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border-4 border-white shadow-2xl flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center text-blue-900">
                                  <span className="material-icons">
                                    play_arrow
                                  </span>
                                </div>
                                <div className="flex-grow text-left">
                                  <p className="text-white font-black text-[10px] uppercase tracking-widest">
                                    Preview Mode
                                  </p>
                                  <audio
                                    src={audioURL}
                                    controls
                                    className="w-full h-8 mt-1 filter invert"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setAudioURL(null);
                                    setRecordStatus("Siap Merekam");
                                  }}
                                  className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                                >
                                  <span className="material-icons text-sm">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DYNAMIC VISUALIZER: Perbaikan untuk menghindari styling bugs */}
                        {!audioURL && (
                          <div className="flex items-end justify-center gap-1 md:gap-2 h-20 md:h-24 mb-10 w-full max-w-sm">
                            {[...Array(24)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 md:w-1.5 rounded-full transition-all duration-300 ${
                                  isRecording ? "bg-brand-blue" : "bg-slate-100"
                                }`}
                                style={{
                                  height: isRecording
                                    ? `${30 + Math.random() * 70}%`
                                    : "10%",
                                  opacity: isRecording
                                    ? i % 2 === 0
                                      ? 1
                                      : 0.5
                                    : 1,
                                  // PERBAIKAN: Gunakan properti spesifik, jangan pakai shorthand 'animation'
                                  animationName: isRecording ? "pulse" : "none",
                                  animationDuration: "1.5s",
                                  animationIterationCount: "infinite",
                                  animationTimingFunction: "ease-in-out",
                                  animationDelay: `${i * 0.05}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* MAIN ACTION: MIC BUTTON */}
                        <div className="flex flex-col items-center gap-8 w-full">
                          {!audioURL && (
                            <div className="relative group">
                              {/* Animated Ring Decor */}
                              <div
                                className={`absolute -inset-4 rounded-full border-2 border-dashed border-slate-200 ${
                                  isRecording
                                    ? "animate-spin-slow border-red-200"
                                    : "group-hover:rotate-45 transition-transform"
                                }`}
                              />

                              <button
                                onClick={
                                  isRecording ? stopRecording : startRecording
                                }
                                className={`w-28 h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all relative z-10 active:scale-95 ${
                                  isRecording
                                    ? "bg-slate-900"
                                    : "bg-gradient-to-tr from-red-600 to-red-400 hover:shadow-red-200"
                                }`}
                              >
                                {isRecording && (
                                  <>
                                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                                    <span className="absolute inset-[-10px] rounded-full border border-red-500/30 animate-pulse"></span>
                                  </>
                                )}
                                <div className="flex flex-col items-center">
                                  <span className="material-icons text-5xl md:text-7xl text-white">
                                    {isRecording ? "stop" : "mic"}
                                  </span>
                                  <span className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">
                                    {isRecording ? "Stop" : "Record"}
                                  </span>
                                </div>
                              </button>
                            </div>
                          )}

                          {/* STATUS & ACTIONS */}
                          <div className="space-y-8 w-full px-4">
                            <div className="flex flex-col items-center">
                              <p
                                className={`font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1 ${
                                  isRecording
                                    ? "text-red-500"
                                    : "text-brand-blue"
                                }`}
                              >
                                {recordStatus}
                              </p>
                              {isRecording && (
                                <span className="text-slate-400 font-mono text-[10px]">
                                  REC 00:00:00
                                </span>
                              )}
                            </div>

                            {audioURL && !isRecording && (
                              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up justify-center">
                                <button
                                  onClick={() => {
                                    alert("Podcast Berhasil Dipublikasikan!");
                                    setAudioURL(null);
                                  }}
                                  className="w-full sm:w-auto bg-brand-blue text-white px-10 md:px-14 py-4 rounded-2xl font-black text-sm md:text-base shadow-[0_15px_30px_rgba(0,102,255,0.3)] hover:bg-brand-yellow hover:text-blue-900 transition-all flex items-center justify-center gap-3 group"
                                >
                                  <span className="material-icons group-hover:-translate-y-1 transition-transform">
                                    cloud_upload
                                  </span>
                                  PUBLIKASIKAN
                                </button>
                                <button
                                  onClick={() => {
                                    setAudioURL(null);
                                    setRecordStatus("Siap Merekam");
                                  }}
                                  className="w-full sm:w-auto bg-slate-50 text-slate-500 px-10 py-4 rounded-2xl font-black text-sm border-2 border-slate-100 hover:bg-white hover:border-brand-blue/30 transition-all flex items-center justify-center gap-3"
                                >
                                  <span className="material-icons">
                                    refresh
                                  </span>
                                  ULANGI
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="p-6 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
              <button
                onClick={() => setActiveSlide(4)}
                className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-bold text-base order-2 md:order-1"
              >
                <span className="material-icons">arrow_back</span> Kembali ke
                SMP
              </button>

              <button
                onClick={nextSlide}
                className="w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-10 md:px-16 rounded-full flex items-center justify-center gap-3 font-black text-lg hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all active:scale-95 order-1 md:order-2"
              >
                Selesaikan Sesi
                <span className="material-icons">check_circle</span>
              </button>
            </div>
          </section>
        )}

        {/* 6. Slide Penilaian - Final Feedback */}
        {activeSlide === 6 && (
          <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
            {/* --- HEADER SECTION --- */}
            <div className="relative w-full">
              {/* Penyesuaian padding mobile */}
              <div className="bg-brand-blue pt-20 pb-28 md:pt-32 md:pb-48 px-6 md:px-12 rounded-b-[2.5rem] md:rounded-b-[8rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-yellow text-blue-900 px-5 py-2 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        auto_awesome
                      </span>
                      Satu Langkah Terakhir
                    </div>
                    <h2 className="text-3xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-tight">
                      Beri Kami <span className="text-brand-yellow">Nilai</span>
                    </h2>
                    <p className="text-white/60 font-medium max-w-xl text-xs md:text-base px-4">
                      Terima kasih telah menjelajahi EduVibe. Pendapatmu sangat
                      berarti untuk masa depan aplikasi ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="w-full px-4 md:px-12 lg:px-24 -mt-12 md:-mt-24 relative z-20 pb-16 flex-grow">
              <div className="max-w-2xl mx-auto">
                {/* Penyesuaian padding kartu untuk mobile (p-6) */}
                <div className="animate-slide-up bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl p-6 md:p-20 relative overflow-hidden border border-white text-center">
                  <div className="absolute top-0 left-6 md:left-20 bottom-0 w-[1.5px] bg-slate-100" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-brand-yellow/10 text-brand-yellow rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                      <span className="material-icons text-3xl md:text-5xl">
                        grade
                      </span>
                    </div>

                    <h3 className="text-xl md:text-3xl font-black text-brand-blue tracking-tighter uppercase mb-2">
                      Rating EduVibe
                    </h3>
                    <p className="text-slate-400 font-bold mb-8 md:mb-10 text-[10px] md:text-sm tracking-wide">
                      SENTUH BINTANG UNTUK MEMBERI RATING
                    </p>

                    {/* INTERAKTIF: BINTANG - Ukuran responsif (text-4xl vs text-7xl) */}
                    <div className="flex gap-1 md:gap-4 mb-8 md:mb-12">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-all duration-300 transform active:scale-90"
                        >
                          <span
                            className={`material-icons text-4xl md:text-7xl ${
                              star <= (hoverRating || rating)
                                ? "text-brand-yellow drop-shadow-md"
                                : "text-slate-200"
                            }`}
                          >
                            {star <= (hoverRating || rating)
                              ? "star"
                              : "star_border"}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Dinamis Feedback Message */}
                    {rating > 0 && (
                      <div className="animate-fade-in bg-slate-50 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 mb-8 w-full max-w-xs md:max-w-none">
                        <p className="text-brand-blue font-black uppercase text-[10px] md:text-xs tracking-widest leading-relaxed">
                          {rating === 5
                            ? "Sempurna! Kami sangat senang! 😍"
                            : rating >= 3
                            ? "Terima kasih atas dukungannya! 😊"
                            : "Kami akan berusaha lebih baik lagi! 🫡"}
                        </p>
                      </div>
                    )}

                    <textarea
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] focus:border-brand-blue outline-none mb-6 md:mb-8 font-bold text-slate-600 text-sm md:text-base placeholder:opacity-30"
                      rows={3}
                      placeholder="Tambahkan pesan atau saran lainnya..."
                    ></textarea>

                    <button
                      onClick={() => alert("Terima kasih atas penilaiannya!")}
                      className={`w-full py-4 md:py-5 rounded-full font-black text-base md:text-xl shadow-xl transition-all active:scale-95 ${
                        rating > 0
                          ? "bg-brand-blue text-white hover:bg-brand-yellow hover:text-blue-900"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }`}
                      disabled={rating === 0}
                    >
                      KIRIM PENILAIAN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FOOTER NAVIGATION --- */}
            <div className="p-6 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
              <button
                onClick={() => setActiveSlide(5)}
                className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-bold text-sm md:text-lg order-2 md:order-1"
              >
                <span className="material-icons">arrow_back</span> Kembali ke
                Podcast
              </button>

              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 bg-slate-900 text-white py-1.5 px-5 md:py-2 md:px-6 rounded-full">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-yellow">
                    Finish
                  </span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* MODAL TENTANG APLIKASI */}
      {isModalOpen === "about" && (
        <div className="fixed inset-0 bg-brand-blue/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative border-4 border-brand-yellow/20">
            <button
              onClick={() => setIsModalOpen(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="material-icons text-3xl">cancel</span>
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-4xl text-brand-blue">
                  auto_awesome
                </span>
              </div>
              <h4 className="text-3xl font-black text-brand-blue mb-2">
                EduVibe
              </h4>
              <p className="text-gray-500 mb-8 font-medium italic">
                <span>Learn</span>
                <span className="text-brand-yellow"> • </span>
                <span>Listen</span>
                <span className="text-brand-yellow"> • </span>
                <span>Enjoy</span>
              </p>

              <div className="text-left space-y-4 text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm leading-relaxed">
                  EduVibe adalah platform media pembelajaran musik interaktif
                  yang dirancang untuk membantu siswa mengenal dunia seni suara
                  dengan cara yang menyenangkan.
                </p>
                <p className="text-sm leading-relaxed">
                  Dikembangkan untuk mempermudah saat proses KBM berjalan di
                  masa yang akan datang, sehingga dapat menjadi solusi bagi para
                  pelajar untuk menyelesaikan mata pelajaran yang membutuhkan
                  fitur apk seperti ini.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(null)}
                className="mt-8 w-full bg-brand-blue text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
              >
                Oke, Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BANTUAN */}
      {isModalOpen === "help" && (
        <div className="fixed inset-0 bg-brand-blue/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <span className="material-icons">close</span>
            </button>

            <h4 className="text-2xl font-bold text-brand-blue mb-6 flex items-center gap-2">
              <span className="material-icons">help</span> Pusat Bantuan
            </h4>

            <div className="space-y-4">
              {[
                {
                  q: "Bagaimana cara memulai?",
                  a: "Klik tombol 'Mulai Belajar' untuk masuk ke materi SD.",
                },
                {
                  q: "Materi apa saja yang tersedia?",
                  a: "Tersedia materi lagu nasional (SD), musik pop (SMP), dan podcast (SMA).",
                },
                {
                  q: "Apakah saya bisa merekam suara?",
                  a: "Ya, fitur rekaman tersedia di level SMA pada Slide 5.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-yellow transition-colors"
                >
                  <h5 className="font-bold text-brand-blue text-sm mb-1">
                    {item.q}
                  </h5>
                  <p className="text-xs text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(null)}
              className="mt-8 w-full border-2 border-brand-blue text-brand-blue py-4 rounded-2xl font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {/* --- FOOTER DI DALAM SCROLLABLE DIV --- */}
        {/* Footer hanya muncul jika BUKAN slide 1 (Splash Screen) */}
        {activeSlide !== 1 && (
          <footer className="w-full py-12 flex flex-col items-center justify-center flex-shrink-0 animate-fade-in">
            <div className="w-20 h-[1px] bg-slate-100 mb-6" />

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-slate-400">
              <div className="flex items-center gap-2">
                <span>2026</span>
                <span className="text-brand-blue font-black">EduVibe</span>
              </div>
              <span className="hidden md:block text-slate-300 opacity-50">
                |
              </span>
              <span className="text-slate-500">Learn • Listen • Enjoy</span>
            </div>

            <div className="flex gap-1.5 mt-4">
              {[1, 2, 3].map((dot) => (
                <div key={dot} className="w-1 h-1 rounded-full bg-slate-200" />
              ))}
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
