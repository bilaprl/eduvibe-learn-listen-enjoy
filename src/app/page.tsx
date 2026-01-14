"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// 1. DEFINISI INTERFACE (Hanya satu tempat di sini)
interface SongItem {
  title: string;
  id: string;
}

interface SongCollection {
  nasional: SongItem[];
  daerah: SongItem[];
}

export default function EduVibeApp() {
  // --- STATES ---
  const [activeSlide, setActiveSlide] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<
    "desc" | "quesioner" | "about" | "help" | null
  >(null);

  // TAMBAHKAN BARIS INI
  const topRef = useRef<HTMLDivElement>(null);

  // Agar otomatis scroll saat slide berubah, tambahkan useEffect ini juga:
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSlide]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordStatus, setRecordStatus] = useState(
    "Siap merekam cerita motivasimu..."
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const videoPlayerRef = React.useRef<HTMLDivElement>(null);

  const handleSongSelection = (index: number) => {
    setSelectedSong(index);
    // Mencari elemen video player dan melakukan scroll halus ke sana
    const playerElement = document.getElementById("video-player-section");
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const [activeMateri, setActiveMateri] = useState<number | null>(null);

  // Tambahkan ini di bawah baris-baris useState kamu
  useEffect(() => {
    // Fungsi ini akan berjalan otomatis setiap kali slide berpindah
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Efek scroll halus
    });
  }, [activeSlide]); // '[activeSlide]' artinya: jalankan kode ini setiap kali variabel ini berubah

  const [sdView, setSdView] = useState("video");
  const [smpView, setSmpView] = useState("video");
  const [smaView, setSmaView] = useState("video");
  const [sdStep, setSdStep] = useState(1);

  // State untuk tab lagu menggunakan keyof agar aman secara tipe
  const [sdTab, setSdTab] = useState<keyof SongCollection>("nasional");
  const [selectedSong, setSelectedSong] = useState(0);

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- DATA LAGU ---
  const songData: SongCollection = {
    nasional: [
      { title: "Indonesia Raya", id: "UuPaS81n0xg?si" },
      { title: "Ibu Kita Kartini", id: "R1-2M34Tq4M?si" },
      { title: "Halo-Halo Bandung", id: "EfACVChwxnI?si" },
      { title: "17 Agustus", id: "di7fRJA-A-E?si" },
      { title: "Bagimu Negeri", id: "5uDjVyawLPA?si" },
      { title: "Indonesia Pusaka", id: "8KQwWBAq8JQ?si" },
      { title: "Maju Tak Gentar", id: "0YoGZ8i2-eY?si" },
      { title: "Ibu Pertiwi", id: "PzX11GskYO8?si" },
    ],
    daerah: [
      { title: "Soleram", id: "5DmT6N2_uE4?si" },
      { title: "Tokecang", id: "atFo0JEblzo?si" },
      { title: "Paturay Tineung", id: "munNVfG0CSk?si=" },
    ],
  };

  const traditionalSongs = [
    {
      id: "bAcB_R5gDMI?si",
      title: "Gundhul Pacul",
      artist: "Jawa Tengah",
      desc: "Tembang dolanan ini merupakan sindiran bagi para pemimpin. 'Gundhul' melambangkan kepala tanpa mahkota (rakyat), sedangkan 'Pacul' (Papat Kang Cucul) melambangkan empat indera yang harus dijaga agar tidak sombong. Pesan moralnya: Jika pemimpin kehilangan kehormatannya, amanah rakyat (bakul) akan jatuh dan tumpah (segane dadi sak latar).",
    },
    {
      id: "h29iD5r6-vE?si",
      title: "Gambang Suling",
      artist: "Jawa Tengah",
      desc: "Diciptakan oleh Ki Nartosabdo, lagu ini adalah bentuk apresiasi terhadap estetika instrumen tradisional. Liriknya menggambarkan kekaguman pada suara seruling yang merdu (kebat kliwat) dan mampu menghadirkan harmoni yang menyentuh jiwa, mengingatkan kita akan kekayaan seni karawitan.",
    },
    {
      id: "GuWc1-447pY?si=",
      title: "Lir Ilir",
      artist: "Jawa Tengah",
      desc: "Karya Sunan Kalijaga dari abad ke-16. Menggunakan metafora 'tanaman yang bersemi' (cah angon) untuk mengajak manusia bangun dari kemalasan dan membenahi diri. 'Menek belimbing' melambangkan usaha menjalankan rukun Islam yang tajam sisinya (sulit), namun harus dilakukan untuk mencuci pakaian rohani (mumpung padhang rembulane).",
    },
    {
      id: "9WYEtwagQqY?si",
      title: "Oray-Orayan",
      artist: "Jawa Barat",
      desc: "Lagu 'kaulinan' (permainan) Sunda yang menggunakan simbol ular (oray-orayan) yang berkelok-kelok melewati sawah dan ladang. Secara mendalam, lagu ini mengajarkan tentang kolektivitas, kegembiraan bersama, dan harmoni antara manusia dengan alam lingkungan sekitarnya.",
    },
  ];

  const popSongs2 = [
    {
      id: "oaFj0lRi3gw?si",
      title: "Pesan Terakhir",
      artist: "Lyodra",
      desc: "Lagu ini menunjukkan teknik vokal tinggi dengan dinamika yang dramatis. Secara materi, lagu ini mengajarkan tentang 'Acceptance' (penerimaan) dan ketegaran seseorang dalam melepaskan cinta yang tidak bisa dipaksakan demi kebahagiaan orang lain.",
    },
    {
      id: "Svz5F8J1Ap0?si",
      title: "Melawan Restu",
      artist: "Mahalini",
      desc: "Mengangkat tema konflik sosial dan emosional. Lagu ini sangat baik untuk dipelajari dari sisi penghayatan (ekspresi) vokal, di mana melodi yang meliuk menggambarkan perjuangan dan kesedihan saat cinta terbentur perbedaan keyakinan atau restu.",
    },
    {
      id: "8O8wQ_NvKwA?si",
      title: "Perahu Kertas",
      artist: "Maudy Ayunda",
      desc: "Diciptakan oleh Dewi 'Dee' Lestari, lagu ini memiliki lirik metaforis yang kuat. 'Perahu Kertas' melambangkan impian dan pencarian jati diri. Melodinya yang ceria namun bermakna dalam sangat cocok untuk melatih teknik pernapasan dan kejernihan vokal (artikulasi).",
    },
    {
      id: "QSWYyoF79oE?si",
      title: "Sial",
      artist: "Mahalini",
      desc: "Lagu ini viral karena aransemennya yang menggabungkan pop balada dengan struktur lagu modern yang 'catchy'. Liriknya menceritakan tentang penyesalan dan rasa sakit hati karena dikhianati, sangat efektif untuk belajar interpretasi lirik dalam sebuah pertunjukan musik.",
    },
  ];

  const westernSongs = [
    {
      id: "A_MjCqQoLLA",
      title: "Hey Jude",
      artist: "The Beatles",
      desc: "Analisis struktur lagu anthemic rock yang ikonik. Fokus pada progresi akord diatonis dan 'coda' (bagian akhir) yang panjang, yang mendemonstrasikan bagaimana sebuah lagu dapat membangun intensitas emosional melalui pengulangan vokal dan penambahan instrumen orkestra secara bertahap.",
    },
    {
      id: "Xl4O5J2mLp4",
      title: "Why Do You Love Me",
      artist: "Koes Plus",
      desc: "Studi kasus sejarah musik Indonesia mengenai pengaruh 'British Invasion' tahun 60-an. Lagu ini menunjukkan bagaimana harmoni vokal khas grup Barat diadaptasi ke dalam estetika musik pop Indonesia, menciptakan perpaduan antara nuansa nostalgia dan struktur lagu pop klasik.",
    },
    {
      id: "nevO8YwaPho",
      title: "Misty",
      artist: "Ella Fitzgerald",
      desc: "Eksplorasi mendalam pada genre Jazz Standard. Fokus pada teknik 'phrasing' vokal yang fleksibel, penggunaan nada kromatik, serta kemampuan improvisasi tingkat tinggi. Lagu ini mengajarkan cara menyampaikan emosi melalui dinamika nada yang halus dan kontrol napas yang matang.",
    },
    {
      id: "EloXaKNp2co",
      title: "La Vie En Rose",
      artist: "Emily Watts",
      desc: "Bedah lagu klasik Chanson Prancis dalam kemasan kontemporer. Menganalisis bagaimana aransemen minimalis (akustik) dapat menonjolkan kekuatan lirik dan melodi. Siswa mempelajari pentingnya interpretasi pribadi dalam membawakan ulang (cover) karya legendaris.",
    },
    {
      id: "FYrFkKABbgQ",
      title: "Somewhere Over the Rainbow",
      artist: "Christina Perri",
      desc: "Analisis teknik vokal pada lagu ballad lintas generasi. Fokus pada jangkauan interval nada yang lebar (oktaf) dan penggunaan 'head voice'. Mempelajari bagaimana iringan instrumen sederhana dapat mendukung pembangunan narasi cerita dalam musik.",
    },
    {
      id: "b87dBaL4qI0",
      title: "Almost Is Never Enough",
      artist: "Ariana Grande",
      desc: "Studi teknik vokal R&B modern dan Pop-Soul. Menitikberatkan pada penggunaan 'melisma' (lekukan nada vokal yang kompleks) dan harmonisasi duet. Mengajarkan cara menjaga sinkronisasi ritme dan emosi saat berkolaborasi dengan penyanyi lain.",
    },
  ];

  const popSongsSMA = [
    {
      id: "6BptZhPu4tM",
      title: "Rindu Ku Rindu",
      artist: "Mahalini",
      desc: "Analisis produksi musik pop orkestral masa kini. Menelaah struktur lagu yang menggunakan dinamika 'grand' pada bagian chorus. Fokus pada teknik vokal dengan power yang kuat namun tetap memiliki kontrol rasa yang dalam sesuai standar pop industri.",
    },
    {
      id: "7SqNVv98e8Q",
      title: "Kita Usahakan Rumah Itu",
      artist: "Sal Priadi",
      desc: "Eksplorasi lirik puitis dan naratif dalam musik indie-pop. Lagu ini menonjolkan penggunaan diksi yang tidak biasa dalam penulisan lagu (songwriting), serta aransemen musik yang bersifat teatrikal, mengajarkan siswa bahwa musik adalah media bercerita (storytelling).",
    },
    {
      id: "X-EK60rmcQs",
      title: "Terbuang Dalam Waktu",
      artist: "Barasuara",
      desc: "Analisis kompleksitas aransemen Rock-Alternatif. Fokus pada sinkopasi ritme (pola irama yang tidak biasa) dan interaksi antara instrumen gitar, bass, dan drum yang rapat. Mempelajari bagaimana energi kolektif dalam sebuah band dibentuk melalui teknik permainan yang presisi.",
    },
    {
      id: "oIYWenB637c",
      title: "To The Bone",
      artist: "Pamungkas",
      desc: "Mempelajari fenomena musik 'Bedroom Pop' yang sukses secara global. Analisis penggunaan lirik bahasa Inggris oleh musisi lokal dan pengaruhnya terhadap jangkauan audiens. Fokus pada gaya produksi musik yang santai (laid back) namun memiliki kaitan emosional yang kuat.",
    },
    {
      id: "fPMB2H450iI",
      title: "Bunga Abadi",
      artist: "Rio Clappy",
      desc: "Studi tentang tren Retro-Pop dan City Pop dalam musik modern. Menganalisis penggunaan sound synthesizer dan gaya produksi era 80-an yang dihidupkan kembali. Mengajarkan bagaimana unsur musik masa lalu dapat dikemas menjadi sesuatu yang relevan untuk generasi masa kini.",
    },
  ];

  // --- FUNCTIONS ---
  const startRecording = async () => {
    try {
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
    } catch (err) {
      console.error("Mic access denied", err);
    }
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

  return (
    /* KONTINER UTAMA: 
       - Full width di mobile
       - Max-width 4xl di desktop (agar tidak terlalu lebar)
       - Auto margin agar rata tengah 
    */
    <main className="h-screen w-screen bg-white overflow-hidden flex flex-col">
      <div className="w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex-grow flex flex-col">
          {/* NAVBAR RESPONSIVE */}
          <nav
            className={`w-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between z-[100] fixed top-0 transition-all duration-500 ${
              activeSlide === 1
                ? "bg-transparent border-b border-white/10"
                : "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            }`}
          >
            {/* Logo & Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setActiveSlide(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-2xl border-2 border-white/50 rotate-3 group-hover:rotate-0 transition-all duration-500">
                <Image
                  src="/images/logo.jpeg"
                  alt="Logo"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter flex flex-col leading-none">
                <span
                  className={
                    activeSlide === 1 ? "text-white" : "text-brand-blue"
                  }
                >
                  Edu<span className="text-brand-yellow">Vibe</span>
                </span>
                <span
                  className={`text-[8px] uppercase tracking-[0.3em] font-bold ${
                    activeSlide === 1 ? "text-white/60" : "text-slate-400"
                  }`}
                >
                  Music Education
                </span>
              </h1>
            </div>

            {/* Navigasi Halaman (Desktop) */}
            <div
              className={`hidden lg:flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-500 ${
                activeSlide === 1
                  ? "bg-white/10 backdrop-blur-md"
                  : "bg-slate-100/80"
              }`}
            >
              {[
                { id: 1, label: "Home", icon: "home" },
                { id: 2, label: "Intro", icon: "music_note" },
                { id: 3, label: "Menu", icon: "grid_view" },
                { id: 4, label: "SD", icon: "child_care" },
                { id: 5, label: "SMP", icon: "face" },
                { id: 6, label: "SMA", icon: "mic" },
                { id: 7, label: "Rating", icon: "star" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 4) {
                      setSdView("teori");
                      setSelectedSong(0);
                    }
                    setActiveSlide(item.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    activeSlide === item.id
                      ? "bg-brand-blue text-white shadow-lg shadow-blue-200 scale-105"
                      : `hover:bg-white/20 ${
                          activeSlide === 1
                            ? "text-white"
                            : "text-slate-500 hover:text-brand-blue"
                        }`
                  }`}
                >
                  <span className="material-icons text-lg">{item.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigasi Mobile (Trigger Sidebar) */}
            <div
              className="lg:hidden flex items-center relative" // Ditambahkan relative
              onClick={() => setIsSidebarOpen(true)}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                  activeSlide === 1
                    ? "bg-white/10 border-white/20 backdrop-blur-md text-white"
                    : "bg-white border-slate-100 shadow-sm text-slate-700"
                }`}
              >
                {/* Info Slide: Ukuran Teks diperkecil */}
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[7px] font-black uppercase tracking-tighter opacity-50">
                    Menu
                  </span>
                  <span className="text-[10px] font-bold font-mono">
                    {activeSlide.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Divider: Lebih pendek */}
                <div className="w-[1px] h-3 bg-current opacity-10" />

                {/* Icon Container: Ukuran diubah dari w-8 h-8 ke w-6 h-6 */}
                <div className="bg-brand-yellow text-blue-900 w-6 h-6 flex items-center justify-center rounded-lg font-black shadow-sm">
                  <span className="material-icons text-base">menu</span>
                </div>
              </div>
            </div>
          </nav>

          {/* SIDEBAR OVERLAY */}
          <div
            className={`fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] transition-opacity duration-500 lg:hidden ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* SIDEBAR PANEL */}
          <div
            className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-slate-50 z-[120] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform lg:hidden flex flex-col ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header Sidebar dengan Gradasi - Penyesuaian Padding Mobile */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-brand-blue to-blue-800 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg shadow-black/20">
                    <span className="material-icons text-brand-blue text-xl md:text-2xl">
                      auto_stories
                    </span>
                  </div>
                  <h2 className="font-black text-xl md:text-2xl tracking-tighter leading-tight">
                    EduVibe
                  </h2>
                  <p className="text-[9px] md:text-[10px] text-blue-200 uppercase tracking-[0.2em] font-bold">
                    Learning Path
                  </p>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/20 hover:bg-black/40 transition-colors active:scale-90"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            {/* Menu List dengan Animasi Hover - Optimalisasi Scroll & Touch Target */}
            <div className="flex-grow py-4 md:py-6 overflow-y-auto px-3 md:px-4 custom-scrollbar">
              <div className="space-y-1.5 md:space-y-2">
                {[
                  {
                    id: 1,
                    label: "Beranda Utama",
                    icon: "home",
                    desc: "Kembali ke awal",
                  },
                  {
                    id: 2,
                    label: "Pendahuluan",
                    icon: "music_note",
                    desc: "Mengenal musik",
                  },
                  {
                    id: 3,
                    label: "Menu Level",
                    icon: "grid_view",
                    desc: "Pilih tingkatan",
                  },
                  {
                    id: 4,
                    label: "Materi SD",
                    icon: "child_care",
                    desc: "Dasar & Fun",
                  },
                  {
                    id: 5,
                    label: "Materi SMP",
                    icon: "face",
                    desc: "Eksplorasi Genre",
                  },
                  {
                    id: 6,
                    label: "Materi SMA",
                    icon: "mic",
                    desc: "Analisis & Teknik",
                  },
                  {
                    id: 7,
                    label: "Beri Rating",
                    icon: "star",
                    desc: "Feedback Anda",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSlide(item.id);
                      setIsSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full p-3.5 md:p-4 flex items-center gap-3 md:gap-4 rounded-xl md:rounded-2xl transition-all duration-300 group active:scale-[0.98] ${
                      activeSlide === item.id
                        ? "bg-brand-blue text-white shadow-lg shadow-blue-100"
                        : "text-slate-600 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        activeSlide === item.id
                          ? "bg-white/20"
                          : "bg-slate-100 group-hover:bg-brand-blue/10"
                      }`}
                    >
                      <span
                        className={`material-icons text-xl md:text-2xl ${
                          activeSlide === item.id
                            ? "text-white"
                            : "text-brand-blue"
                        }`}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="font-bold text-sm md:text-base leading-none truncate">
                        {item.label}
                      </p>
                      <p
                        className={`text-[10px] mt-1 truncate ${
                          activeSlide === item.id
                            ? "text-blue-200"
                            : "text-slate-400"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Sidebar - Responsif untuk layar pendek */}
            <div className="p-6 md:p-8 border-t border-slate-200 bg-white">
              <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Version
                  </p>
                  <p className="text-[11px] md:text-xs font-bold text-slate-700">
                    EduVibe Pro v1.2
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

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
                {/* Background Utama - Penyesuaian padding mobile agar lebih proporsional */}
                <div className="bg-brand-blue pt-20 pb-32 md:pt-48 md:pb-56 px-6 md:px-12 rounded-b-[2.5rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden transition-all duration-700">
                  {/* Dekorasi Cahaya Abstrak */}
                  <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[60px] md:blur-[100px] -mr-10 -mt-10" />

                  {/* Floating Music Notes - Dikurangi jumlahnya di mobile agar tidak mengganggu keterbacaan */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex flex-wrap gap-10 md:gap-20 p-10 justify-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-icons text-white text-5xl md:text-8xl rotate-12 transition-transform hover:scale-110"
                      >
                        music_note
                      </span>
                    ))}
                  </div>

                  {/* Konten Teks Header */}
                  <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                      {/* Badge - Ukuran font sedikit lebih besar di mobile untuk legibilitas */}
                      <div className="inline-flex items-center gap-2 bg-brand-yellow text-blue-900 px-4 py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.15em] mb-6 md:mb-8 shadow-lg">
                        <span className="material-icons text-xs md:text-sm animate-pulse">
                          auto_awesome
                        </span>
                        Modul Teori Musik
                      </div>

                      {/* Judul - Responsif sempurna untuk layar kecil iPhone/Android */}
                      <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-8 tracking-tighter leading-[1.1] md:leading-[1.05]">
                        Eksplorasi <br className="block md:block" />
                        <span className="text-brand-yellow drop-shadow-sm">
                          EduVibe
                        </span>
                      </h2>

                      {/* Paragraf - Line height dioptimalkan untuk mobile */}
                      <p className="text-white/80 text-[15px] md:text-2xl max-w-2xl font-light leading-relaxed px-2 md:px-4">
                        Pahami fondasi seni suara dan cara teknologi membantu
                        kita mengapresiasi setiap nada yang tercipta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- CONTENT SECTION: FLOATING CARDS --- */}
              {/* -mt-20 di mobile membuat overlap yang cantik dengan lengkungan biru */}
              <div className="w-full px-5 md:px-12 lg:px-24 -mt-20 md:-mt-32 relative z-20 pb-16">
                <div className="max-w-7xl mx-auto">
                  {/* 3 Pilar Utama: Grid stacking otomatis di mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 mb-12 md:mb-20">
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
                        className={`${item.bg} p-7 md:p-12 rounded-[2rem] md:rounded-[3rem] border ${item.border} shadow-[0_10px_30px_rgba(0,0,0,0.04)] active:scale-[0.98] md:hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] md:hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden`}
                      >
                        {/* Tap Indicator for Mobile */}
                        <div className="absolute top-4 right-6 md:hidden">
                          <span className="material-icons text-gray-200 text-sm">
                            touch_app
                          </span>
                        </div>

                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gray-50 flex items-center justify-center mb-5 md:mb-8 group-hover:bg-brand-blue transition-colors duration-500">
                          <span
                            className={`material-icons ${item.color} group-hover:text-white text-3xl md:text-5xl transition-colors`}
                          >
                            {item.icon}
                          </span>
                        </div>
                        <h4 className="text-xl md:text-3xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-gray-500 text-[13px] md:text-lg leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Sejarah Musik: Layout Card dengan padding internal yang lebih rapat di mobile */}
                  <div className="bg-gray-50 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col lg:flex-row mb-10 mx-1 md:mx-0">
                    <div className="lg:w-1/3 bg-brand-blue p-8 md:p-16 text-white relative overflow-hidden">
                      <span className="material-icons text-[8rem] md:text-[15rem] absolute -bottom-8 -right-8 opacity-10 rotate-12">
                        history_edu
                      </span>
                      <h3 className="text-2xl md:text-5xl font-black mb-3 md:mb-6 leading-tight relative z-10">
                        Timeline <br />
                        Musik
                      </h3>
                      <div className="w-10 md:w-16 h-1.5 md:h-2 bg-brand-yellow rounded-full relative z-10"></div>
                    </div>

                    <div className="lg:w-2/3 p-7 md:p-16 flex flex-col justify-center gap-6 md:gap-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                        <div className="space-y-2 md:space-y-4">
                          <h5 className="font-black text-brand-blue uppercase tracking-[0.15em] text-[10px] md:text-sm">
                            Era Prasejarah
                          </h5>
                          <p className="text-gray-600 text-[13px] md:text-base leading-relaxed">
                            Bermula dari tiruan suara alam. Instrumen tertua
                            ditemukan berusia lebih dari 40.000 tahun.
                          </p>
                        </div>
                        <div className="space-y-2 md:space-y-4">
                          <h5 className="font-black text-brand-blue uppercase tracking-[0.15em] text-[10px] md:text-sm">
                            Era Digital
                          </h5>
                          <p className="text-gray-600 text-[13px] md:text-base leading-relaxed">
                            Teknologi mengubah segalanya. Musik kini hadir dalam
                            genggaman secara instan.
                          </p>
                        </div>
                      </div>
                      <blockquote className="border-l-4 border-brand-yellow pl-4 md:pl-6 py-1 italic text-gray-500 text-sm md:text-lg font-medium">
                        "Musik bukan sekadar hiburan; ia adalah catatan sejarah
                        peradaban manusia."
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- FOOTER NAVIGATION --- */}
              <div className="mt-auto p-5 md:p-8 md:px-24 bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 sticky bottom-0 z-30">
                <button
                  onClick={() => setActiveSlide(1)} // Tidak perlu window.scrollTo lagi di sini
                  className="group text-gray-400 hover:text-brand-blue active:text-brand-blue p-2 transition-all flex items-center gap-2 md:gap-3 font-bold text-sm md:text-lg order-2 md:order-1"
                >
                  <span className="material-icons text-sm md:text-base group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Kembali
                </button>

                <button
                  onClick={nextSlide} // Tidak perlu window.scrollTo lagi di sini
                  className="group w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-8 md:px-16 rounded-2xl md:rounded-full flex items-center justify-center gap-3 md:gap-4 font-black text-base md:text-xl hover:bg-brand-yellow hover:text-blue-900 shadow-xl shadow-brand-blue/20 transition-all active:scale-95 order-1 md:order-2"
                >
                  Lanjut ke Materi
                  <span className="material-icons group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </section>
          )}

           {/* 3. HALAMAN MENU UTAMA (LOBBY) - DENGAN EFEK SMOOTH SCROLL */}
          {activeSlide === 3 && (
            <section className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center bg-slate-50 pt-20 pb-12 px-4 md:px-6 animate-fade-in relative overflow-x-hidden">
              {/* Dekorasi Background */}
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-blue/5 to-transparent pointer-events-none" />

              <div className="z-10 w-full max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-8 md:mb-16">
                  <div className="inline-block px-4 py-1.5 bg-brand-blue/10 rounded-full text-brand-blue text-[9px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
                    Learning Hub
                  </div>
                  <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                    Mulai <span className="text-brand-blue">Petualanganmu</span>
                  </h2>
                  <p className="text-slate-400 font-bold text-[10px] md:text-base mt-4 max-w-xs md:max-w-lg mx-auto uppercase tracking-wide leading-relaxed">
                    Pilih jenjang pendidikan untuk mengeksplorasi musik
                  </p>
                </div>

                {/* Grid Menu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-sm md:max-w-none mx-auto">
                  {/* CARD SD */}
                  <button
                    onClick={() => {
                      // 1. Tambahkan baris ini untuk memaksa balik ke tampilan Menu/Teori
                      setSdView("menu");

                      // 2. Jika ada state lagu yang terpilih, reset juga biar tidak langsung putar video
                      if (typeof setSelectedSong === "function") {
                        setSelectedSong(0);
                      }

                      // 3. Pindah slide ke SD
                      setActiveSlide(4);

                      // 4. Scroll ke paling atas agar tidak nyangkut di tengah halaman
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group relative bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl hover:shadow-2xl md:hover:-translate-y-4 transition-all duration-500 text-left overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

                    <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[9px] font-black uppercase tracking-widest mb-6">
                      Kurikulum Merdeka
                    </div>

                    <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                      <span className="material-icons text-3xl md:text-4xl text-white">
                        child_care
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 leading-none">
                      Level{" "}
                      <span className="text-brand-blue italic underline decoration-brand-yellow decoration-4 underline-offset-4">
                        SD
                      </span>
                    </h3>

                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-grow">
                      Jelajahi keindahan{" "}
                      <span className="text-slate-800 font-bold italic">
                        Lagu Nasional & Daerah
                      </span>{" "}
                      dengan ensiklopedia interaktif.
                    </p>

                    <div className="flex items-center gap-2 text-brand-blue font-black text-[10px] tracking-widest uppercase mt-auto">
                      Masuk Kelas
                      <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <span className="material-icons text-blue-900 text-xs">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* CARD SMP */}
                  <button
                    onClick={() => {
                      setActiveSlide(5);
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Efek meluncur ke atas
                    }}
                    className="group relative bg-brand-blue p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl hover:shadow-blue-200 md:hover:-translate-y-4 transition-all duration-500 text-left overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-yellow/10 transition-colors" />

                    <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-[9px] font-black uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-md">
                      Psikologi Musik
                    </div>

                    <div className="w-14 h-14 md:w-20 md:h-20 bg-brand-yellow rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20 group-hover:-rotate-6 transition-transform">
                      <span className="material-icons text-3xl md:text-4xl text-blue-900">
                        face
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
                      Level{" "}
                      <span className="text-brand-yellow italic">SMP</span>
                    </h3>

                    <p className="text-blue-100/70 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-grow">
                      Ekspresikan diri melalui{" "}
                      <span className="text-white font-bold italic">
                        Musik Populer
                      </span>{" "}
                      dan pahami gaya belajarmu.
                    </p>

                    <div className="flex items-center gap-2 text-brand-yellow font-black text-[10px] tracking-widest uppercase mt-auto">
                      Mulai Belajar
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <span className="material-icons text-brand-blue text-xs">
                          play_arrow
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* CARD SMA */}
                  <button
                    onClick={() => {
                      setActiveSlide(6);
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Efek meluncur ke atas
                    }}
                    className="group relative bg-white border-2 border-brand-yellow/20 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl hover:shadow-2xl md:hover:-translate-y-4 transition-all duration-500 text-left overflow-hidden flex flex-col"
                  >
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500" />

                    <div className="inline-flex items-center self-start px-3 py-1 rounded-full bg-yellow-50 text-amber-600 text-[9px] font-black uppercase tracking-widest mb-6 border border-brand-yellow/20">
                      Creator Studio
                    </div>

                    <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 border-2 border-brand-blue/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 relative group-hover:border-brand-blue transition-colors">
                      <span className="material-icons text-3xl md:text-4xl text-brand-blue">
                        mic_external_on
                      </span>
                      <div className="absolute -bottom-1.5 flex gap-0.5 group-hover:animate-pulse">
                        <div className="w-0.5 h-3 bg-brand-yellow rounded-full"></div>
                        <div className="w-0.5 h-5 bg-brand-blue rounded-full"></div>
                        <div className="w-0.5 h-3 bg-brand-yellow rounded-full"></div>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 leading-none">
                      Level{" "}
                      <span className="text-brand-blue italic underline decoration-brand-yellow decoration-4 underline-offset-4">
                        SMA
                      </span>
                    </h3>

                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-grow">
                      Wadah inspiratif lewat{" "}
                      <span className="text-slate-800 font-bold italic">
                        Podcast Studio
                      </span>{" "}
                      dan eksplorasi makna lagu.
                    </p>

                    <div className="flex items-center gap-2 text-brand-blue font-black text-[10px] tracking-widest uppercase mt-auto">
                      Buka Studio
                      <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <span className="material-icons text-white text-xs">
                          settings_voice
                        </span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Footer Navigation */}
                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setActiveSlide(2);
                      window.scrollTo({ top: 0, behavior: "smooth" }); // Efek meluncur ke atas
                    }}
                    className="text-slate-400 hover:text-brand-blue text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mx-auto group p-4"
                  >
                    <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">
                      arrow_back
                    </span>
                    Kembali ke Pengenalan
                  </button>
                </div>
              </div>
            </section>
          )}

       {/* 3. Slide SD - Edukasi Seni & Lagu Kurikulum Merdeka */}
          {activeSlide === 4 && (
            <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
              {/* --- HEADER SECTION --- */}
              <div className="relative w-full">
                {/* Padding disesuaikan agar proporsional: pt-20 untuk memberi ruang bagi notch/status bar di HP */}
                <div className="bg-brand-blue pt-20 pb-28 md:pt-32 md:pb-48 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-56 h-56 md:w-96 md:h-96 bg-white/5 rounded-full blur-[70px] md:blur-[100px] -mr-12 -mt-12" />

                  <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {/* Badge: Ukuran font minimal 10px agar terbaca jelas di Android/iPhone */}
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-yellow text-blue-900 px-4 py-1.5 md:px-5 md:py-1.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] mb-6 md:mb-8 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        auto_awesome
                      </span>
                      Kurikulum Merdeka Kelas 5
                    </div>

                    {/* Judul: Menggunakan leading-tight agar tidak bertumpuk saat teks turun ke baris baru di mobile */}
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none md:leading-tight uppercase italic">
                      Seni &{" "}
                      <span className="text-brand-yellow text-shadow-sm block sm:inline">
                        Budaya
                      </span>
                    </h2>

                    {/* Paragraf: Ukuran standar text-sm agar nyaman di mata (tidak terlalu kecil/besar) */}
                    <p className="text-white/80 text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-2 italic">
                      "Seni bukan hanya tentang hasil, tapi tentang proses
                      berekspresi."
                    </p>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT AREA --- */}
              {/* Penyesuaian: Margin negatif lebih kecil di mobile (-mt-10) agar konten tidak menabrak header terlalu jauh */}
              <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24 -mt-10 md:-mt-24 relative z-20 pb-16 flex-grow">
                <div className="max-w-5xl mx-auto">
                  {/* TAMPILAN 1: MENU MATERI (ACCORDION STYLE) */}
                  {sdView === "menu" && (
                    <div className="flex flex-col gap-3 md:gap-4 animate-slide-up">
                      {[
                        {
                          id: 1,
                          title: "Seni Rupa",
                          icon: "palette",
                          short: "Prinsip visual dan komposisi.",
                          detail:
                            "Mempelajari unsur seni rupa seperti garis, bidang, warna, dan tekstur. Siswa diajak memahami cara menyusun komposisi yang seimbang dalam sebuah karya 2D maupun 3D.",
                        },
                        {
                          id: 2,
                          title: "Ragam Hias Nusantara",
                          icon: "grid_view",
                          short: "Motif tradisional khas daerah.",
                          detail:
                            "Eksplorasi kekayaan motif batik, tenun, dan ukiran dari Sabang sampai Merauke. Memahami makna filosofis di balik setiap lengkungan dan pola tradisional.",
                        },
                        {
                          id: 3,
                          title: "Kriya Anyaman",
                          icon: "gesture",
                          short: "Teknik Makrame dan anyam tangan.",
                          detail:
                            "Melatih motorik halus dengan teknik menganyam bahan alam atau sintetis. Fokus pada kekuatan simpul dan pola repetisi untuk menghasilkan benda fungsional.",
                        },
                        {
                          id: 4,
                          title: "Seni Tari",
                          icon: "accessibility_new",
                          short: "Gerak tubuh, ruang, dan waktu.",
                          detail:
                            "Mempelajari elemen dasar tari: Wiraga (raga), Wirama (irama), dan Wirasa (rasa). Mengenal tari tradisional Indonesia yang mencerminkan kekayaan budaya lokal.",
                        },
                        {
                          id: 5,
                          title: "Seni Teater",
                          icon: "theater_comedy",
                          short: "Ekspresi, peran, dan panggung.",
                          detail:
                            "Eksplorasi olah tubuh, olah rasa, dan olah suara. Belajar memerankan karakter, memahami naskah sederhana, dan bekerja sama dalam sebuah pertunjukan panggung.",
                        },
                        {
                          id: 6,
                          title: "Seni Musik",
                          icon: "library_music",
                          short: "Unsur Bunyi, Harmoni & Lagu.",
                          detail:
                            "Materi inti tentang nada, irama, dan alat musik. Siapkan dirimu untuk mengeksplorasi lagu-lagu nasional dan daerah kebanggaan Indonesia.",
                          highlight: true,
                        },
                      ].map((item) => (
                        <div key={item.id} className="w-full">
                          {/* Button Trigger: Padding dikecilkan (p-4 md:p-8) dan rounded (rounded-[1.5rem] md:rounded-[2rem]) */}
                          <button
                            onClick={() =>
                              setActiveMateri(
                                activeMateri === item.id ? null : item.id
                              )
                            }
                            className={`w-full p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all flex items-center gap-4 md:gap-6 border-b-4 ${
                              activeMateri === item.id
                                ? "bg-brand-blue text-white border-brand-yellow shadow-2xl translate-x-1 md:translate-x-2"
                                : "bg-white text-slate-700 border-slate-100 hover:bg-blue-50 shadow-lg"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                                activeMateri === item.id
                                  ? "bg-brand-yellow text-blue-900 rotate-[360deg] scale-105 md:scale-110"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <span className="material-icons text-xl md:text-3xl">
                                {item.icon}
                              </span>
                            </div>
                            <div className="flex-grow">
                              <h4
                                className={`text-sm md:text-xl font-black uppercase tracking-tighter leading-tight ${
                                  activeMateri === item.id
                                    ? "text-white"
                                    : "text-brand-blue"
                                }`}
                              >
                                {item.title}
                              </h4>
                              <p
                                className={`text-[10px] md:text-sm font-medium ${
                                  activeMateri === item.id
                                    ? "text-white/70"
                                    : "text-slate-400"
                                }`}
                              >
                                {item.short}
                              </p>
                            </div>
                            <div
                              className={`transition-transform duration-300 ${
                                activeMateri === item.id ? "rotate-180" : ""
                              }`}
                            >
                              <span className="material-icons text-xl md:text-2xl opacity-50">
                                expand_more
                              </span>
                            </div>
                          </button>

                          {/* Dropdown Content: Margin dan Padding disesuaikan agar proporsional */}
                          {activeMateri === item.id && (
                            <div className="mx-2 sm:mx-4 p-5 md:p-8 bg-white border-x border-b border-slate-100 rounded-b-[1.5rem] md:rounded-b-[2rem] shadow-inner animate-slide-down">
                              <div className="flex gap-3 md:gap-4">
                                <div className="w-1 bg-brand-yellow rounded-full shrink-0" />
                                <div>
                                  <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4 md:mb-6">
                                    {item.detail}
                                  </p>
                                  {item.highlight && (
                                    <button
                                      onClick={() => {
                                        setSdView("teori");
                                        setActiveMateri(null);
                                      }}
                                      className="inline-flex items-center gap-2 md:gap-3 bg-brand-yellow text-blue-900 px-6 py-2 md:px-8 md:py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-200"
                                    >
                                      Buka Galeri Musik{" "}
                                      <span className="material-icons text-sm md:text-base">
                                        headphones
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                   {/* TAMPILAN 2: DETAIL MATERI SENI MUSIK (TEORI MENDETAIL) */}
                  {sdView === "teori" && (
                    <div className="animate-slide-up bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 mb-10 relative">
                      {/* Header Materi: Padding disesuaikan p-6 (Mobile) vs p-10 (Desktop) */}
                      <div className="bg-brand-blue p-6 md:p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-brand-yellow/10 rounded-full -mr-10 -mt-10 md:-mr-20 md:-mt-20 blur-2xl md:blur-3xl" />
                        <div className="relative z-10 flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                              <span className="material-icons text-brand-yellow text-sm md:text-base">
                                library_music
                              </span>
                              <span className="text-brand-yellow font-black uppercase tracking-[0.15em] md:tracking-[0.3em] text-[8px] md:text-[10px]">
                                Eksplorasi Bunyi & Harmoni
                              </span>
                            </div>
                            <h3 className="text-xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                              Materi:{" "}
                              <span className="text-brand-yellow">
                                Seni Musik
                              </span>
                            </h3>
                          </div>
                          <button
                            onClick={() => setSdView("menu")}
                            className="bg-white/10 hover:bg-brand-yellow hover:text-blue-900 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all group shrink-0"
                          >
                            <span className="material-icons group-hover:rotate-90 transition-transform text-xl md:text-2xl">
                              close
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="p-5 md:p-14">
                        {/* Grid Materi Utama: 1 Kolom (Mobile) & 3 Kolom (Desktop) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                          {/* Kolom 1: Unsur Bunyi & Suara */}
                          <div className="space-y-6 md:space-y-8">
                            <section className="group">
                              <h4 className="flex items-center gap-3 md:gap-4 text-brand-blue font-black uppercase mb-3 md:mb-4 text-base md:text-lg">
                                <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                                  <span className="material-icons text-[16px] md:text-[20px] leading-none">
                                    graphic_eq
                                  </span>
                                </span>
                                <span className="leading-none pt-0.5">
                                  Unsur Bunyi
                                </span>
                              </h4>
                              <div className="space-y-3 md:space-y-4 border-l-2 border-slate-100 pl-4 md:pl-5">
                                <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                                  <p className="text-slate-700 text-[11px] md:text-sm leading-relaxed">
                                    <strong className="text-brand-blue block text-[9px] md:text-xs mb-1 uppercase tracking-wider">
                                      Nada
                                    </strong>
                                    Tinggi rendahnya bunyi yang beraturan dengan
                                    frekuensi tertentu.
                                  </p>
                                </div>
                                <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                                  <p className="text-slate-700 text-[11px] md:text-sm leading-relaxed">
                                    <strong className="text-brand-blue block text-[9px] md:text-xs mb-1 uppercase tracking-wider">
                                      Irama
                                    </strong>
                                    Panjang pendeknya bunyi yang membentuk pola
                                    detak musik.
                                  </p>
                                </div>
                              </div>
                            </section>

                            <section className="group">
                              <h4 className="flex items-center gap-3 md:gap-4 text-brand-blue font-black uppercase mb-3 md:mb-4 text-base md:text-lg">
                                <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                                  <span className="material-icons text-[16px] md:text-[20px] leading-none">
                                    record_voice_over
                                  </span>
                                </span>
                                <span className="leading-none pt-0.5">
                                  Vokal Manusia
                                </span>
                              </h4>
                              <div className="grid grid-cols-2 gap-2 md:gap-3">
                                {[
                                  {
                                    name: "Sopran",
                                    d: "Tinggi Wanita",
                                    color: "bg-blue-100 text-blue-800",
                                  },
                                  {
                                    name: "Alto",
                                    d: "Rendah Wanita",
                                    color: "bg-blue-50 text-blue-700",
                                  },
                                  {
                                    name: "Tenor",
                                    d: "Tinggi Pria",
                                    color: "bg-brand-yellow/20 text-blue-900",
                                  },
                                  {
                                    name: "Bass",
                                    d: "Rendah Pria",
                                    color:
                                      "bg-brand-yellow text-blue-900 shadow-sm",
                                  },
                                ].map((v) => (
                                  <div
                                    key={v.name}
                                    className={`${v.color} p-2.5 md:p-4 rounded-xl md:rounded-2xl text-center border border-white/50`}
                                  >
                                    <div className="font-black text-[10px] md:text-xs uppercase tracking-tighter">
                                      {v.name}
                                    </div>
                                    <div className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase leading-none mt-1">
                                      {v.d}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>
                          </div>

                           {/* Kolom 2: Alat Musik & Teknik */}
                          <div className="space-y-6 md:space-y-8">
                            <section className="group">
                              <h4 className="flex items-center gap-3 md:gap-4 text-brand-blue font-black uppercase mb-3 md:mb-4 text-base md:text-lg">
                                <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                                  <span className="material-icons text-[16px] md:text-[20px] leading-none">
                                    piano
                                  </span>
                                </span>
                                <span className="leading-none pt-0.5">
                                  Pengenalan Alat
                                </span>
                              </h4>
                              <div className="bg-white border-2 border-dashed border-slate-200 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] space-y-4 md:space-y-6">
                                <div>
                                  <span className="text-[8px] md:text-[10px] font-black bg-brand-yellow px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-2 inline-block shadow-sm">
                                    TRADISIONAL
                                  </span>
                                  <p className="text-slate-600 text-[10px] md:text-xs leading-relaxed">
                                    Angklung, Gamelan, Sasando.
                                  </p>
                                </div>
                                <div className="h-[1px] bg-slate-100 w-full" />
                                <div>
                                  <span className="text-[8px] md:text-[10px] font-black bg-brand-blue text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-2 inline-block shadow-sm">
                                    MODERN
                                  </span>
                                  <p className="text-slate-600 text-[10px] md:text-xs leading-relaxed">
                                    Piano, Biola, Gitar, Terompet.
                                  </p>
                                </div>
                              </div>
                            </section>

                            <section className="group">
                              <h4 className="flex items-center gap-3 md:gap-4 text-brand-blue font-black uppercase mb-3 md:mb-4 text-base md:text-lg">
                                <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                                  <span className="material-icons text-[16px] md:text-[20px] leading-none">
                                    lyrics
                                  </span>
                                </span>
                                <span className="leading-none pt-0.5">
                                  Teknik Dasar
                                </span>
                              </h4>
                              <div className="grid grid-cols-1 gap-2 md:gap-3">
                                <div className="bg-blue-900 text-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-xl flex items-start gap-3 md:gap-4">
                                  <span className="material-icons text-brand-yellow text-lg md:text-2xl">
                                    adjust
                                  </span>
                                  <div>
                                    <div className="font-black text-[10px] md:text-xs uppercase mb-1">
                                      Ritmis
                                    </div>
                                    <p className="text-[9px] md:text-[10px] text-blue-100 leading-relaxed italic">
                                      Pengatur tempo (Drum/Kendang).
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-brand-yellow text-blue-900 p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-lg flex items-start gap-3 md:gap-4 border-2 border-white">
                                  <span className="material-icons text-blue-900 text-lg md:text-2xl">
                                    queue_music
                                  </span>
                                  <div>
                                    <div className="font-black text-[10px] md:text-xs uppercase mb-1">
                                      Melodis
                                    </div>
                                    <p className="text-[9px] md:text-[10px] text-blue-900/60 leading-relaxed italic">
                                      Rangkaian nada (Pianika/Vokal).
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>

                          {/* Kolom 3: Apresiasi & CTA */}
                          <div className="flex flex-col h-full mt-4 lg:mt-0">
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-200 text-center flex-grow flex flex-col justify-center relative overflow-hidden group shadow-inner">
                              <div className="absolute -bottom-5 -right-5 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                                <span className="material-icons text-[100px] md:text-[180px]">
                                  auto_awesome
                                </span>
                              </div>
                              <div className="relative z-10">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl text-brand-blue group-hover:scale-110 transition-transform">
                                  <span className="material-icons text-3xl md:text-5xl">
                                    volunteer_activism
                                  </span>
                                </div>
                                <h4 className="text-brand-blue font-black uppercase mb-2 md:mb-4 text-xl md:text-2xl tracking-tighter italic">
                                  Apresiasi Musik
                                </h4>
                                <p className="text-slate-500 text-[11px] md:text-sm mb-6 md:mb-10 leading-relaxed px-2">
                                  Mempelajari kekayaan{" "}
                                  <strong>Lagu Daerah</strong> &{" "}
                                  <strong>Lagu Nasional</strong>.
                                </p>
                                <button
                                  onClick={() => setSdView("video")}
                                  className="w-full bg-brand-blue text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-brand-yellow hover:text-blue-900 transition-all flex items-center justify-center gap-2 md:gap-4 shadow-lg"
                                >
                                  Mulai Eksplorasi
                                  <span className="material-icons text-base md:text-lg">
                                    play_circle_filled
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAMPILAN 3: GALERI VIDEO LAGU */}
                  {sdView === "video" && (
                    <div className="animate-slide-up flex flex-col gap-4 md:gap-8 mb-10 md:mb-20">
                      {/* Tombol Navigasi Atas */}
                      <div className="flex justify-between items-center px-2">
                        <button
                          onClick={() => setSdView("teori")}
                          className="group flex items-center gap-2 md:gap-3 text-slate-500 font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-brand-blue transition-all"
                        >
                          <span className="material-icons bg-slate-100 p-1.5 md:p-2 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-all text-sm md:text-base">
                            arrow_back
                          </span>
                          Kembali ke Teori
                        </button>

                        <div className="hidden md:flex items-center gap-2 text-slate-400 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                          <span className="material-icons text-sm">info</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            Pilih lagu di playlist untuk memutar video
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                        {/* Sidebar Playlist */}
                        <div className="w-full lg:w-96 bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-white sticky lg:top-10 z-10">
                          <div className="flex items-center gap-3 mb-4 md:mb-6 px-2">
                            <div className="w-2 h-6 md:h-8 bg-brand-yellow rounded-full" />
                            <h4 className="font-black text-brand-blue uppercase tracking-tighter text-lg md:text-xl">
                              Daftar Lagu
                            </h4>
                          </div>

                          {/* Tab Selector */}
                          <div className="flex gap-2 mb-4 md:mb-6 p-1.5 md:p-2 bg-slate-100/50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/50 font-black">
                            {(["nasional", "daerah"] as const).map((tab) => (
                              <button
                                key={tab}
                                onClick={() => {
                                  setSdTab(tab);
                                  setSelectedSong(0);
                                }}
                                className={`flex-1 py-2.5 md:py-3 rounded-[1.2rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all duration-500 ${
                                  sdTab === tab
                                    ? "bg-brand-blue text-white shadow-xl scale-105"
                                    : "text-slate-400 hover:text-brand-blue hover:bg-white"
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>

                          {/* List Lagu */}
                          <div className="max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2 md:space-y-3">
                            {songData[sdTab as keyof SongCollection].map(
                              (song: SongItem, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setSelectedSong(idx);
                                    // Logika Auto Scroll ke Video Player
                                    videoPlayerRef.current?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                  }}
                                  className={`w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] text-left transition-all duration-300 flex items-center gap-3 md:gap-5 border-2 ${
                                    selectedSong === idx
                                      ? "bg-white border-brand-yellow text-blue-900 shadow-xl translate-x-2"
                                      : "bg-transparent border-transparent hover:bg-white/50 text-slate-500"
                                  }`}
                                >
                                  <div
                                    className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-black transition-all ${
                                      selectedSong === idx
                                        ? "bg-brand-yellow rotate-12"
                                        : "bg-slate-100"
                                    }`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <div className="flex-grow overflow-hidden">
                                    <span className="font-black text-[10px] md:text-[11px] uppercase block truncate tracking-tight">
                                      {song.title}
                                    </span>
                                    {selectedSong === idx && (
                                      <span className="text-[8px] md:text-[9px] font-bold text-brand-blue/50 flex items-center gap-1 animate-pulse">
                                        <span className="material-icons text-[10px] md:text-[12px]">
                                          play_arrow
                                        </span>{" "}
                                        Sedang Diputar
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Video Player Container */}
                        <div
                          ref={videoPlayerRef}
                          className="flex-grow w-full bg-white p-3 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-[6px] md:border-[16px] border-white overflow-hidden transition-all duration-700"
                        >
                          {/* Frame Video */}
                          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-slate-900 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group">
                            <iframe
                              key={`${sdTab}-${selectedSong}`}
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${
                                songData[sdTab as keyof SongCollection][
                                  selectedSong
                                ].id
                              }?rel=0&autoplay=1&modestbranding=1`}
                              title="Video Player"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            ></iframe>

                            {/* Overlay Dekoratif (Hanya muncul saat loading/hover) */}
                            <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 text-[8px] md:text-[10px] text-white font-bold uppercase tracking-widest">
                                HD Quality Available
                              </div>
                            </div>
                          </div>

                          {/* Informasi Lagu Bawah Video */}
                          <div className="mt-6 md:mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-6 px-2 md:px-4">
                            <div className="space-y-2 md:space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 md:w-3 md:h-3 bg-brand-yellow rounded-full animate-ping" />
                                <p className="text-brand-blue/40 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
                                  Sekarang Memutar
                                </p>
                              </div>
                              <h3 className="text-2xl md:text-5xl font-black text-brand-blue uppercase italic tracking-tighter leading-none">
                                {
                                  songData[sdTab as keyof SongCollection][
                                    selectedSong
                                  ].title
                                }
                              </h3>
                              <div className="inline-flex items-center gap-2 md:gap-3 bg-slate-100 px-3 md:px-5 py-1.5 md:py-2 rounded-full">
                                <span className="material-icons text-brand-blue text-xs md:text-sm">
                                  category
                                </span>
                                <p className="text-slate-600 font-black text-[8px] md:text-[10px] uppercase tracking-widest leading-none">
                                  {sdTab === "nasional"
                                    ? "Lagu Wajib Nasional"
                                    : "Lagu Tradisional Nusantara"}
                                </p>
                              </div>
                            </div>

                            <div className="hidden md:flex w-20 h-20 md:w-24 md:h-24 bg-brand-yellow rounded-full items-center justify-center shadow-2xl shadow-yellow-200 rotate-12 border-4 md:border-8 border-white">
                              <span className="material-icons text-4xl md:text-5xl text-blue-900 animate-bounce">
                                music_note
                              </span>
                            </div>
                          </div>

                          {/* Lirik Singkat / Fun Fact Area (Placeholder) */}
                          <div className="mt-6 md:mt-10 p-5 md:p-8 bg-blue-50/50 rounded-[2rem] md:rounded-[3rem] border border-blue-100/50 flex items-center gap-4 md:gap-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                              <span className="material-icons text-brand-blue text-xl md:text-2xl">
                                auto_stories
                              </span>
                            </div>
                            <p className="text-slate-500 text-[10px] md:text-xs italic leading-relaxed">
                              "Apresiasi musik membantu kita memahami nilai
                              sejarah dan kekayaan budaya Indonesia melalui nada
                              dan syair yang bermakna."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- FOOTER NAVIGATION --- */}
              <div className="p-5 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
                <button
                  onClick={() => {
                    if (sdView === "video") setSdView("teori");
                    else if (sdView === "teori") setSdView("menu");
                    else setActiveSlide(3); // Kembali ke menu utama
                  }}
                  className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-black text-[11px] md:text-sm uppercase tracking-widest order-2 md:order-1"
                >
                  <span className="material-icons text-base md:text-lg">
                    west
                  </span>{" "}
                  Kembali ke Menu
                </button>

                <button
                  onClick={nextSlide}
                  className="w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-8 md:px-16 rounded-full flex items-center justify-center gap-3 font-black text-sm md:text-lg hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all order-1 md:order-2"
                >
                  Materi SMP{" "}
                  <span className="material-icons text-base md:text-xl">
                    arrow_forward
                  </span>
                </button>
              </div>
            </section>
          )}

       {/* 4. Slide SMP - Kurikulum Merdeka Fase D */}
          {activeSlide === 5 && (
            <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
              {/* Penanda Scroll ke Atas */}
              <div ref={topRef} className="absolute top-0 left-0 w-full h-1" />

              {/* --- HEADER SECTION --- */}
              <div className="relative w-full">
                {/* Padding disesuaikan: pt-20 agar aman dari notch/kamera depan HP, pb-32 untuk transisi lengkungan yang lebih halus */}
                <div className="bg-brand-blue pt-20 pb-32 md:pt-40 md:pb-56 px-6 md:px-12 rounded-b-[3rem] md:rounded-b-[10rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] -mr-10 -mt-10" />

                  <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {/* Badge: Ukuran font dikunci minimal 10px agar tidak kekecilan di layar HP */}
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-yellow text-blue-900 px-4 py-1.5 md:px-5 md:py-1.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-wider md:tracking-[0.2em] mb-6 md:mb-6 shadow-lg">
                      <span className="material-icons text-xs md:text-sm">
                        school
                      </span>
                      Seni Musik SMP - Fase D
                    </div>

                    {/* Judul: Menggunakan text-4xl di mobile agar tegas dan tidak terpotong di layar sempit */}
                    <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-tight">
                      Harmoni{" "}
                      <span className="text-brand-yellow">Tradisi & Pop</span>
                    </h2>

                    {/* Deskripsi: Ukuran font disesuaikan ke text-sm agar nyaman dibaca di Android/iPhone */}
                    <p className="text-white/80 text-sm md:text-xl max-w-3xl mx-auto font-light leading-relaxed px-2 md:px-4 mb-8 md:mb-10">
                      Mempelajari teknik vokal, apresiasi musik daerah sebagai
                      identitas bangsa, dan kreativitas dalam musik modern untuk
                      membentuk karakter Pelajar Pancasila.
                    </p>

                    {/* TAB NAVIGATION: Menggunakan padding yang pas agar jari mudah menekan tombol */}
                    <div className="flex justify-center w-full px-2">
                      <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 overflow-x-auto no-scrollbar max-w-full">
                        {["materi", "tradisional", "modern"].map((view) => (
                          <button
                            key={view}
                            onClick={() => setSmpView(view)}
                            className={`whitespace-nowrap px-6 md:px-10 py-3 md:py-2.5 rounded-xl text-[11px] md:text-xs font-black transition-all uppercase ${
                              smpView === view
                                ? "bg-white text-brand-blue shadow-lg"
                                : "text-white hover:bg-white/10"
                            }`}
                          >
                            {view === "materi"
                              ? "Teori Musik"
                              : view === "tradisional"
                              ? "Musik Daerah"
                              : "Musik Modern"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT AREA --- */}
              <div className="w-full px-4 md:px-12 lg:px-24 -mt-8 md:-mt-24 relative z-20 pb-16 flex-grow">
                <div className="max-w-6xl mx-auto">
                  {/* VIEW 1: MATERI TEORI */}
                  {smpView === "materi" && (
                    <div className="animate-slide-up space-y-6">
                      <div className="bg-white p-6 md:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-white relative overflow-hidden">
                        <span className="material-icons absolute -right-10 -bottom-10 text-[10rem] md:text-[15rem] text-slate-50">
                          auto_stories
                        </span>

                        <div className="relative z-10">
                          <h4 className="text-xl md:text-3xl font-black text-brand-blue mb-6 md:mb-8 flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-yellow rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-yellow/30">
                              <span className="material-icons text-blue-900 text-sm md:text-base">
                                menu_book
                              </span>
                            </div>
                            Eksplorasi Kurikulum Fase D
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            <div className="space-y-6">
                              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                Pada jenjang ini, kamu tidak hanya mendengarkan
                                musik, tapi juga{" "}
                                <span className="text-brand-blue font-bold">
                                  membedah anatomi nada
                                </span>
                                . Fokus utama kita adalah membangun kepekaan
                                telinga terhadap ritme kompleks dan melodi.
                              </p>
                              <div className="bg-slate-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border-l-4 border-brand-blue">
                                <h5 className="font-black text-brand-blue text-[10px] md:text-sm uppercase mb-3">
                                  Target Kompetensi:
                                </h5>
                                <ul className="space-y-3 text-xs md:text-sm text-gray-500 font-medium">
                                  <li className="flex items-start gap-2">
                                    <span className="material-icons text-[14px] text-green-500 mt-0.5">
                                      check_circle
                                    </span>
                                    Mampu mengidentifikasi genre musik melalui
                                    teknik vokal.
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="material-icons text-[14px] text-green-500 mt-0.5">
                                      check_circle
                                    </span>
                                    Memahami struktur harmoni dalam lagu modern.
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="material-icons text-[14px] text-green-500 mt-0.5">
                                      check_circle
                                    </span>
                                    Menciptakan aransemen sederhana secara
                                    kolaboratif.
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <h5 className="font-black text-gray-900 text-lg md:text-xl">
                                Integrasi Pelajar Pancasila
                              </h5>
                              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                                Musik adalah sarana{" "}
                                <span className="italic">
                                  Character Building
                                </span>
                                . Melalui lagu daerah, kita mengasah rasa{" "}
                                <span className="text-brand-blue font-bold">
                                  Berkebinekaan Global
                                </span>{" "}
                                —menghargai warisan nenek moyang sembari tetap
                                adaptif terhadap musik pop modern sebagai sarana
                                ekspresi kreatif di era digital.
                              </p>
                              <button
                                onClick={() => {
                                  setSmpView("tradisional");
                                  window.scrollTo({
                                    top: 400,
                                    behavior: "smooth",
                                  });
                                }}
                                className="w-full bg-brand-blue text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-xl hover:bg-brand-yellow hover:text-blue-900 transition-all flex items-center justify-center gap-3"
                              >
                                Mulai Analisis Lagu{" "}
                                <span className="material-icons text-sm md:text-base">
                                  headphones
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                   {/* VIEW 2: MUSIK TRADISIONAL */}
                  {smpView === "tradisional" && (
                    <div
                      className="animate-slide-up flex flex-col lg:grid lg:grid-cols-3 gap-6"
                      id="video-player-section"
                    >
                      {/* Sidebar Playlist - Akan di atas video saat mobile */}
                      <div className="lg:col-span-1 space-y-4 order-1 lg:order-1">
                        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                          <h5 className="font-black text-brand-blue uppercase text-[10px] md:text-xs mb-4 tracking-widest">
                            Warisan Budaya
                          </h5>
                          <div className="space-y-2 max-h-[300px] lg:max-h-none overflow-y-auto pr-1">
                            {traditionalSongs.map((song, i) => (
                              <button
                                key={i}
                                onClick={() => handleSongSelection(i)}
                                className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center gap-3 md:gap-4 ${
                                  selectedSong === i
                                    ? "bg-brand-blue text-white shadow-lg scale-[1.02]"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                }`}
                              >
                                <span className="material-icons text-sm md:text-base">
                                  {selectedSong === i
                                    ? "play_circle"
                                    : "library_music"}
                                </span>
                                <div className="overflow-hidden">
                                  <p className="font-black text-xs md:text-sm truncate">
                                    {song.title}
                                  </p>
                                  <p
                                    className={`text-[9px] md:text-[10px] uppercase font-bold ${
                                      selectedSong === i
                                        ? "text-white/70"
                                        : "opacity-70"
                                    }`}
                                  >
                                    {song.artist}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Main Content Video & Deskripsi */}
                      <div className="lg:col-span-2 space-y-6 order-2 lg:order-2">
                        <div className="bg-white p-3 md:p-6 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-[4px] md:border-[8px] border-white">
                          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black shadow-lg">
                            <iframe
                              key={traditionalSongs[selectedSong].id}
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${traditionalSongs[selectedSong].id}`}
                              allowFullScreen
                            ></iframe>
                          </div>

                          <div className="mt-6 md:mt-8 px-2 md:px-4 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                              <div>
                                <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter">
                                  {traditionalSongs[selectedSong].title}
                                </h3>
                                <p className="text-brand-blue font-bold text-xs md:text-sm">
                                  Asal Daerah:{" "}
                                  {traditionalSongs[selectedSong].artist}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 bg-brand-yellow/20 text-blue-900 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl self-start border border-brand-yellow/30">
                                <span className="material-icons text-xs md:text-sm">
                                  history_edu
                                </span>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                  Materi Tradisional
                                </span>
                              </div>
                            </div>
                            <div className="p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 relative">
                              <span className="material-icons absolute -top-3 -left-3 bg-brand-blue text-white p-2 rounded-full text-xs">
                                menu_book
                              </span>
                              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium italic">
                                "{traditionalSongs[selectedSong].desc}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                   {/* VIEW 3: MUSIK MODERN */}
                  {smpView === "modern" && (
                    <div
                      className="animate-slide-up flex flex-col lg:grid lg:grid-cols-3 gap-6"
                      id="video-player-section"
                    >
                      <div className="lg:col-span-1 space-y-4 order-1 lg:order-1">
                        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                          <h5 className="font-black text-brand-blue uppercase text-[10px] md:text-xs mb-4 tracking-widest">
                            Playlist Pop Hits
                          </h5>
                          <div className="space-y-2 max-h-[300px] lg:max-h-none overflow-y-auto pr-1">
                            {popSongs2.map((song, i) => (
                              <button
                                key={i}
                                onClick={() => handleSongSelection(i)}
                                className={`w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center gap-3 md:gap-4 ${
                                  selectedSong === i
                                    ? "bg-red-50 text-red-600 shadow-inner scale-[1.02]"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                }`}
                              >
                                <span className="material-icons text-sm md:text-base">
                                  {selectedSong === i
                                    ? "play_circle"
                                    : "music_note"}
                                </span>
                                <div className="overflow-hidden">
                                  <p className="font-black text-xs md:text-sm truncate">
                                    {song.title}
                                  </p>
                                  <p className="text-[9px] md:text-[10px] uppercase font-bold opacity-70">
                                    {song.artist}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-6 order-2 lg:order-2">
                        <div className="bg-white p-3 md:p-6 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-[4px] md:border-[8px] border-white">
                          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black shadow-lg">
                            <iframe
                              key={popSongs2[selectedSong].id}
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${popSongs2[selectedSong].id}`}
                              allowFullScreen
                            ></iframe>
                          </div>

                          <div className="mt-6 md:mt-8 px-2 md:px-4 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                              <div>
                                <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tighter">
                                  {popSongs2[selectedSong].title}
                                </h3>
                                <p className="text-brand-blue font-bold text-xs md:text-sm">
                                  Interpretasi Karya:{" "}
                                  {popSongs2[selectedSong].artist}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl self-start">
                                <span className="material-icons text-xs md:text-sm">
                                  auto_awesome
                                </span>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                  Apresiasi Pop
                                </span>
                              </div>
                            </div>
                            <div className="p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 relative">
                              <span className="material-icons absolute -top-3 -left-3 bg-brand-yellow text-blue-900 p-2 rounded-full text-xs shadow-md">
                                lightbulb
                              </span>
                              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium italic">
                                "{popSongs2[selectedSong].desc}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- FOOTER NAVIGATION --- */}
              <div className="mt-auto p-4 md:p-8 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 sticky bottom-0 z-30">
                <button
                  onClick={() => setActiveSlide(4)}
                  className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-black text-xs md:text-sm uppercase tracking-widest order-2 md:order-1"
                >
                  <span className="material-icons text-sm md:text-base">
                    west
                  </span>{" "}
                  Kembali ke SD
                </button>

                <button
                  onClick={nextSlide}
                  className="group w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-8 md:px-16 rounded-full flex items-center justify-center gap-3 font-black text-base md:text-lg hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all active:scale-95 order-1 md:order-2"
                >
                  Lanjut ke SMA
                  <span className="material-icons group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </section>
          )}

        {/* 5. Slide SMA - Musik Tradisional, Barat & Modern */}
          {activeSlide === 6 && (
            <section className="flex-grow min-h-screen flex flex-col animate-fade-in bg-slate-50 overflow-x-hidden relative">
              {/* --- HEADER SECTION --- */}
              <div className="relative w-full">
                {/* Padding pt-20 untuk menghindari notch/status bar mobile, rounded disesuaikan agar tetap elegan */}
                <div className="bg-brand-blue pt-20 pb-28 md:pt-32 md:pb-48 px-4 md:px-12 rounded-b-[3rem] md:rounded-b-[8rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[80px] md:blur-[100px] -mr-10 -mt-10" />

                  <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {/* Badge: Font size dinaikkan sedikit ke 10px agar terbaca di layar HP resolusi tinggi */}
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-yellow text-blue-900 px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-6 shadow-lg">
                      <span className="material-icons text-sm md:text-sm">
                        school
                      </span>
                      SMA Kelas 11 - Kurikulum Merdeka
                    </div>

                    {/* Judul: Menggunakan text-4xl agar lebih berani (bold) di mobile */}
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 md:mb-6 tracking-tighter leading-tight">
                      Eksplorasi{" "}
                      <span className="text-brand-yellow">Seni Musik</span>
                    </h2>

                    {/* Tab Switcher Utama - Optimalisasi: Menggunakan grid-cols-2 agar tombol cukup besar untuk ditekan di mobile */}
                    <div className="flex justify-center w-full px-2">
                      <div className="grid grid-cols-2 md:flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 w-full max-w-sm md:max-w-max gap-1.5">
                        {["materi", "barat", "pop", "podcast"].map((view) => (
                          <button
                            key={view}
                            onClick={() => {
                              setSmaView(view);
                              setSelectedSong(0);
                            }}
                            className={`px-3 md:px-8 py-3 md:py-2.5 rounded-xl text-[11px] md:text-xs font-black transition-all uppercase whitespace-nowrap active:scale-95 ${
                              smaView === view
                                ? "bg-white text-brand-blue shadow-lg"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            {view === "materi"
                              ? "Materi"
                              : view === "barat"
                              ? "Lagu Barat"
                              : view === "pop"
                              ? "Lagu Pop"
                              : "Podcast"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- MAIN CONTENT AREA --- */}
              {/* Penyesuaian margin negatif agar pas di layar kecil */}
              <div className="w-full px-4 md:px-12 lg:px-24 -mt-12 md:-mt-24 relative z-20 pb-16 flex-grow">
                <div className="max-w-6xl mx-auto">
                  {/* VIEW 1: MATERI SINGKAT */}
                  {smaView === "materi" && (
                    <div className="animate-slide-up bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-blue-50">
                      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                          <span className="text-brand-blue font-black uppercase tracking-widest text-[10px] md:text-sm">
                            Ringkasan Kurikulum
                          </span>
                          <h3 className="text-2xl md:text-4xl font-black text-gray-900 mt-2 mb-4 md:mb-6">
                            Mengeksplorasi Bunyi & Budaya
                          </h3>
                          <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                            <p>
                              Fokus pada eksplorasi mendalam{" "}
                              <strong className="text-brand-blue">
                                ragam musik Indonesia
                              </strong>{" "}
                              (tradisional & modern) serta analisis{" "}
                              <strong className="text-brand-blue">
                                genre musik Barat
                              </strong>
                              .
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                "Analisis Genre",
                                "Unsur Nada & Tempo",
                                "Membaca Partitur",
                                "Vlog/Podcast",
                              ].map((item) => (
                                <li
                                  key={item}
                                  className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg"
                                >
                                  <span className="material-icons text-brand-blue text-sm">
                                    check_circle
                                  </span>{" "}
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <p className="bg-blue-50 p-4 rounded-xl border-l-4 border-brand-blue italic text-xs md:text-sm">
                              "Mengembangkan keterampilan kolaborasi dan
                              kreativitas siswa dalam konteks sosial budaya
                              melalui proyek kreatif."
                            </p>
                          </div>
                          <button
                            onClick={() => setSmaView("barat")}
                            className="w-full md:w-auto mt-8 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-brand-yellow hover:text-blue-900 transition-all shadow-lg"
                          >
                            MULAI EKSPLORASI LAGU{" "}
                            <span className="material-icons">
                              arrow_forward
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                   {/* VIEW 2 & 3: VIDEO PLAYER (BARAT & POP) */}
                  {(smaView === "barat" || smaView === "pop") && (
                    <div className="flex flex-col gap-4 md:gap-6">
                      {/* Playlist Filter - Responsif Scroll */}
                      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                        {(smaView === "barat" ? westernSongs : popSongsSMA).map(
                          (song, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSong(index)}
                              className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all border-2 ${
                                selectedSong === index
                                  ? "bg-brand-blue text-white border-brand-blue shadow-xl scale-105"
                                  : "bg-white text-gray-400 border-transparent hover:border-blue-100 shadow-sm"
                              }`}
                            >
                              {song.title}
                            </button>
                          )
                        )}
                      </div>

                      {/* Player Card - Dioptimalkan untuk Mobile */}
                      <div className="animate-slide-up bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 border border-blue-50">
                        <div className="lg:col-span-2">
                          <div className="relative aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black shadow-2xl">
                            <iframe
                              key={
                                (smaView === "barat"
                                  ? westernSongs
                                  : popSongsSMA)[selectedSong]?.id
                              }
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${
                                (smaView === "barat"
                                  ? westernSongs
                                  : popSongsSMA)[selectedSong]?.id
                              }?rel=0&modestbranding=1`}
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="hidden md:flex bg-brand-yellow/10 p-3 rounded-full w-fit mb-4">
                            <span className="material-icons text-brand-yellow">
                              auto_stories
                            </span>
                          </div>
                          <h3 className="text-xl md:text-3xl font-black text-brand-blue leading-tight mb-1">
                            {
                              (smaView === "barat"
                                ? westernSongs
                                : popSongsSMA)[selectedSong]?.title
                            }
                          </h3>
                          <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest mb-4 md:mb-6">
                            ARTIST:{" "}
                            {
                              (smaView === "barat"
                                ? westernSongs
                                : popSongsSMA)[selectedSong]?.artist
                            }
                          </p>
                          <div className="p-4 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-200">
                            <h4 className="font-black text-[10px] md:text-xs text-slate-800 mb-2 uppercase">
                              Analisis Materi:
                            </h4>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">
                              "
                              {
                                (smaView === "barat"
                                  ? westernSongs
                                  : popSongsSMA)[selectedSong]?.desc
                              }
                              "
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: PODCAST */}
                  {smaView === "podcast" && (
                    <div className="animate-slide-up bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-16 text-center border border-blue-50 overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-blue" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 md:mb-8 transition-all ${
                            isRecording
                              ? "bg-red-500 animate-pulse scale-110"
                              : "bg-slate-100 shadow-inner"
                          }`}
                        >
                          <span
                            className={`material-icons text-3xl md:text-4xl ${
                              isRecording ? "text-white" : "text-slate-400"
                            }`}
                          >
                            mic
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-brand-blue mb-4 uppercase tracking-tighter">
                          Podcast Kreatif
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mb-8 md:mb-10 font-medium">
                          Tugas: Buatlah vlog/podcast singkat berdurasi 1 menit
                          mengenai apresiasi salah satu lagu di atas.
                        </p>

                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`w-full md:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-sm md:text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 ${
                            isRecording
                              ? "bg-slate-900 text-white"
                              : "bg-red-600 text-white hover:bg-red-700 shadow-red-100"
                          }`}
                        >
                          {isRecording ? "BERHENTI REKAM" : "MULAI REKAMAN"}
                          <div
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-white ${
                              isRecording ? "animate-pulse" : "opacity-50"
                            }`}
                          />
                        </button>

                        {audioURL && !isRecording && (
                          <div className="mt-8 md:mt-10 p-4 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-white shadow-inner w-full max-w-lg">
                            <audio
                              src={audioURL}
                              controls
                              className="w-full mb-4"
                            />
                            <button
                              onClick={() => setAudioURL(null)}
                              className="text-red-500 text-[10px] md:text-xs font-black uppercase tracking-widest"
                            >
                              Hapus & Ulangi
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- FOOTER NAVIGATION --- */}
              <div className="p-6 md:px-24 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mt-auto">
                <button
                  onClick={() => setActiveSlide(5)}
                  className="text-gray-400 hover:text-brand-blue transition-all flex items-center gap-2 font-black text-[10px] md:text-sm uppercase tracking-widest order-2 md:order-1"
                >
                  <span className="material-icons text-sm">west</span> Kembali
                  ke SMP
                </button>

                <button
                  onClick={nextSlide}
                  className="w-full md:w-auto bg-brand-blue text-white py-4 md:py-5 px-10 md:px-16 rounded-full flex items-center justify-center gap-4 font-black text-sm md:text-xl hover:bg-brand-yellow hover:text-blue-900 shadow-xl transition-all active:scale-95 order-1 md:order-2"
                >
                  SELESAIKAN MATERI
                  <span className="material-icons text-lg md:text-2xl">
                    stars
                  </span>
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
