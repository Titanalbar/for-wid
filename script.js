const galleryContainer = document.getElementById('dinding-foto');
const totalFoto = 183; // Membaca foto (0) sampai foto (146)

const daftarCaption = [
    "Momen Manis ✨", "Kebersamaan Kita 🌸", "Hari yang Bahagia 🥰", 
    "Tawa Bersamamu 🗓️", "Momen Berharga 📂", "Senyuman Terbaik 😊", 
    "Kilas Balik Memori 📸", "Langkah Bersama 🗺️", "Sisi Cerita Lain 💬", 
    "Tatapan Hangat 🌟", "Hari yang Tenang 🍃", "Hingga Waktu Berhenti ⏳", 
    "Selamanya Bersama 🔒", "Cerita Baru 📖", "Tawa Lepas 💖", "Dunia Milik Kita 🌍",
    "Setiap Detik Berharga ⏱️", "Bahagia Itu Sederhana 🌱", "Kamu dan Segala Ceritamu 📝",
    "Penyejuk Hati 🌊", "Satu Atap Langit yang Sama 🌌", "I Love You More ❤️",
    "Gemasnya Kamu, Genitnya Aku 😜", "Dinding Memori Kita 🧱", "Tawa yang Selalu Dirindukan 💭",
    "Matahari di Pagi Hariku ☀️", "Alasan Aku Tersenyum 🌻", "Bintang Jatuh Terindah 🌠",
    "Cahaya dalam Gelap 🕯️", "Melodi Terindah dari Tuhan 🎵", "Takdir yang Terlukis Indah 🎨",
    "Sepenggal Surga di Bumi 😇", "Rindu yang Tak Pernah Usai 🌬️", "Detak Jantung yang Seirama 💓",
    "Rumah Tempatku Pulang 🏡", "Mimpi yang Menjadi Nyata 💭", "Sihir Manis Senyumanmu 🪄",
    "Pelangi Setelah Hujan 🌈", "Keajaiban dalam Hidupku 🪄✨", "Tulang Rusuk yang Kutemukan 🦴❤️",
    "Jawaban dari Setiap Doa 🤲🌹", "Pemilik Kunci Hatiku 🔑💓", "Tujuan Akhir Perjalananku 🏁💖",
    "Pelukan Terhangat 🤗🔥", "Separuh Jiwaku 👋💖", "Janji Suci dalam Hati 💍🔒",
    "Bunga yang Selalu Mekar 🌺", "Cinta Sejati yang Abadi ♾️❤️", "Hadiah Terindah dari Alam 🎁🌿",
    "Warna dalam Hidupku 🌈✨", "Kehadiranmu Adalah Berkah 🙏❤️", "Harta Karun Tercinta 💎💖",
    "Puisiku yang Tak Pernah Usai 📜✍️", "Semesta Mendukung Kita 🌌🤝", "Terima Kasih Telah Ada 💖",
    "Cintaku Takkan Pernah Padam 🔥❤️", "Hanya Ada Kamu di Hatiku 💘", "Masa Depan Cerah Bersamamu 🌅",
    "Saksi Bisu Kebahagiaan Kita 🤫❤️", "Hanya Kita yang Mengerti ✨🔗"
];

// ==========================================
// 1. GENERATE KOTAK FOTO MASSAL + LAZY LOADING BLUR-UP
// ==========================================
for (let i = 0; i < totalFoto; i++) {
    const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const imgElement = document.createElement('img');
    imgElement.src = `foto/foto (${i}).jpg`; 
    imgElement.alt = `Momen Kita ${i}`;
    
    // Menerapkan Lazy Loading bawaan agar browser hemat bandwidth
    imgElement.className = 'blur-load';
    imgElement.setAttribute('loading', 'lazy');
    
    // Menghilangkan efek blur setelah gambar selesai terunduh penuh
    imgElement.onload = function() {
        this.classList.add('loaded');
    };

    let urutanCek = 1;
    imgElement.onerror = function() {
        if (urutanCek === 1) {
            this.src = `foto/foto (${i}).jpeg`;
            urutanCek = 2;
        } else if (urutanCek === 2) {
            this.src = `foto/foto (${i}).JPG`;
            urutanCek = 3;
        } else if (urutanCek === 3) {
            this.src = `foto/foto  (${i}).jpg`;
            urutanCek = 4;
        } else if (urutanCek === 4) {
            this.src = `foto/foto  (${i}).jpeg`;
            urutanCek = 5;
        }
    };

    const captionElement = document.createElement('div');
    captionElement.className = 'photo-caption';
    captionElement.innerText = captionAcak;

    galleryItem.appendChild(imgElement);
    galleryItem.appendChild(captionElement);
    
    galleryItem.addEventListener('click', function() {
        bukaLightbox(imgElement.src, captionAcak);
    });

    galleryContainer.appendChild(galleryItem);
}

// ==========================================
// DETEKSI LOGIKA ULANG TAHUN WIDIA
// ==========================================
const tanggalUltahWidia = "10-17"; 
const hariIni = new Date();
const bulanTanggalSekarang = `${String(hariIni.getMonth() + 1).padStart(2, '0')}-${String(hariIni.getDate()).padStart(2, '0')}`;
const apakahHariUlangTahun = (bulanTanggalSekarang === tanggalUltahWidia);

if (apakahHariUlangTahun) {
    window.addEventListener('DOMContentLoaded', () => {
        const titleEl = document.getElementById('web-title');
        if (titleEl) titleEl.innerHTML = "Happy Birthday, Widia! 🎂🎉";
    });
}

// ==========================================
// 2. LOGIKA LIGHTBOX (ZOOM FOTO)
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
const closeBtn = document.querySelector('.close-btn');

function bukaLightbox(src, caption) {
    lightboxModal.style.display = "block";
    lightboxImg.src = src;
    lightboxCaption.innerText = caption;
    
    // Set link dan nama file untuk download
    if (lightboxDownloadBtn) {
        lightboxDownloadBtn.href = src;
        lightboxDownloadBtn.setAttribute('download', 'Momen-Widia-Tan.jpg');
    }
}

closeBtn.addEventListener('click', function() {
    lightboxModal.style.display = "none";
});

lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
        lightboxModal.style.display = "none";
    }
});

// ==========================================
// 3. MULTI-PLAYER PLAYLIST + FADE CONTROL (Ide 3)
// ==========================================
const players = [
    document.getElementById('bg-music-1'),
    document.getElementById('bg-music-2'),
    document.getElementById('bg-music-3')
];
let indeksLaguSekarang = 0;
let isFading = false; // Flag pengunci tombol agar tidak bentrok saat proses fade

const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('.music-icon');

function eksekusiPutar(indeks) {
    players.forEach(p => {
        if(p) { p.pause(); p.currentTime = 0; }
    });

    const activePlayer = players[indeks];
    if (activePlayer) {
        // Fade-In saat ganti lagu otomatis atau pertama kali buka web
        activePlayer.volume = 0;
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            musicBtn.title = "Pause Musik";
            
            let fadeInInterval = setInterval(() => {
                if (activePlayer.volume < 0.9) {
                    activePlayer.volume = (parseFloat(activePlayer.volume) + 0.1).toFixed(1);
                } else {
                    activePlayer.volume = 1.0;
                    clearInterval(fadeInInterval);
                }
            }, 100);
        }).catch(err => console.error("Autoplay safety triggered."));
    }
}

players.forEach((player, indeks) => {
    if(player) {
        player.addEventListener('ended', function() {
            indeksLaguSekarang = (indeks + 1) % players.length;
            eksekusiPutar(indeksLaguSekarang);
        });
    }
});

musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isFading) return; // Kunci tombol jika animasi transisi volume sedang berjalan

    const activePlayer = players[indeksLaguSekarang];
    if (!activePlayer) return;

    if (activePlayer.paused) {
        // --- TRANSIFADE-IN (PLAY MUSIK) ---
        activePlayer.volume = 0;
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            
            isFading = true;
            let fadeInInterval = setInterval(() => {
                if (activePlayer.volume < 0.9) {
                    activePlayer.volume = (parseFloat(activePlayer.volume) + 0.1).toFixed(1);
                } else {
                    activePlayer.volume = 1.0;
                    clearInterval(fadeInInterval);
                    isFading = false;
                }
            }, 100);
        }).catch(err => console.error(err));
    } else {
        // --- TRANSIFADE-OUT (PAUSE MUSIK) ---
        isFading = true;
        let fadeOutInterval = setInterval(() => {
            if (activePlayer.volume > 0.1) {
                activePlayer.volume = (parseFloat(activePlayer.volume) - 0.1).toFixed(1);
            } else {
                activePlayer.volume = 0;
                activePlayer.pause();
                musicIcon.classList.remove('playing');
                musicIcon.innerText = "🎵";
                clearInterval(fadeOutInterval);
                isFading = false;
            }
        }, 100);
    }
});

// ==========================================
// LOGIKA POP-UP SURAT CINTA RAHASIA
// ==========================================
const letterBtn = document.getElementById('letter-btn');
const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.querySelector('.close-letter-btn');

if(letterBtn && letterModal && closeLetterBtn) {
    letterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        letterModal.style.display = "flex";
    });

    closeLetterBtn.addEventListener('click', () => {
        letterModal.style.display = "none";
    });

    letterModal.addEventListener('click', (e) => {
        if(e.target === letterModal) letterModal.style.display = "none";
    });
}

// ==========================================
// 4. LOGIKA HITUNG WAKTU JADIAN
// ==========================================
function hitungWaktuJadian() {
    const tanggalJadian = new Date("2026-05-14T09:00:00"); 
    const sekarang = new Date();
    const selisihWaktu = sekarang - tanggalJadian;

    const hari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

    const counterElement = document.getElementById("love-counter");
    if (counterElement) {
        counterElement.innerHTML = `Sudah ${hari} Hari, ${jam} Jam, ${menit} Menit, dan ${detik} Detik Kita Bersama ✨`;
    }
}
setInterval(hitungWaktuJadian, 1000);
hitungWaktuJadian(); 

// ==========================================
// 5. LOGIKA HUJAN KELOPAK & DAUN MAPLE MULTI-WARNA
// ==========================================
function buatKelopakSakura() {
    const sakura = document.createElement("div");
    customSakuraClass = "sakura";
    sakura.className = customSakuraClass;
    
    const partikelBiasa = ["🌸", "🌸", "🌸", "🌸", "🌸", "💮", "🌼", "🌻", "🌺", "🍁", "🍁", "✨", "❤️"];
    const partikelUltah = ["🎂", "🎈", "🎉", "💖", "✨", "🌸", "💮", "🍰"];
    
    const listSimbol = apakahHariUlangTahun ? partikelUltah : partikelBiasa;
    const simbolTerpilih = listSimbol[Math.floor(Math.random() * listSimbol.length)];
    sakura.innerText = simbolTerpilih;
    
    if (simbolTerpilih === "🍁") {
        const daftarWarnaMaple = ["maple-hijau", "maple-kuning", "maple-ungu", "maple-biru", "maple-tua"];
        const warnaAcak = daftarWarnaMaple[Math.floor(Math.random() * daftarWarnaMaple.length)];
        sakura.classList.add(warnaAcak);
    }
    
    sakura.style.left = Math.random() * 100 + "vw";
    sakura.style.fontSize = Math.random() * 0.5 + 0.8 + "rem"; 
    
    const duration = Math.random() * 4 + 4; 
    sakura.style.animationDuration = duration + "s";
    sakura.style.opacity = Math.random() * 0.6 + 0.4; 

    document.body.appendChild(sakura);
    setTimeout(() => { sakura.remove(); }, duration * 1000);
}
setInterval(buatKelopakSakura, 300);

// ==========================================
// 6. HOVER TAB TITLE DYNAMIC TRICK
// ==========================================
const judulAsliWeb = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = "Kok ditinggal? 🥺❤️";
    } else {
        document.title = judulAsliWeb;
    }
});

// ==========================================
// 7. LOGIKA KEMBALI KE ATAS / BACK TO TOP (KONDISI DASAR HALAMAN)
// ==========================================
const backToTopBtn = document.getElementById("back-to-top");

window.onscroll = function() {
    const posisiScroll = window.innerHeight + window.scrollY;
    const totalTinggiHalaman = document.documentElement.scrollHeight;
    
    if (posisiScroll >= totalTinggiHalaman - 150) {
        if (backToTopBtn) backToTopBtn.style.display = "block";
    } else {
        if (backToTopBtn) backToTopBtn.style.display = "none";
    }
};

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// LOGIKA TOMBOL SAMBUTAN & ANIMASI MUNCUL SMOOTH FLOW
// ==========================================
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');

if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        
        players.forEach(p => { if(p) p.load(); });
        eksekusiPutar(indeksLaguSekarang);
        
        const semuaFoto = document.querySelectorAll('.gallery-item');
        
        semuaFoto.forEach((foto, indeks) => {
            setTimeout(() => {
                foto.classList.add('muncul');
            }, indeks * 35); 
        });
    });
}