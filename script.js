const galleryContainer = document.getElementById('dinding-foto');
const totalFoto = 147; // Membaca foto (0) sampai foto (146)

const daftarCaption = [
    "Momen Manis ✨", "Kebersamaan Kita 🌸", "Hari yang Bahagia 🥰", 
    "Tawa Bersamamu 🗓️", "Momen Berharga 📂", "Senyuman Terbaik 😊", 
    "Kilas Balik Memori 📸", "Langkah Bersama 🗺️", "Sisi Cerita Lain 💬", 
    "Tatapan Hangat 🌟", "Hari yang Tenang 🍃", "Hingga Waktu Berhenti ⏳", 
    "Selamanya Bersama 🔒", "Cerita Baru 📖", "Tawa Lepas 💖", "Dunia Milik Kita 🌍"
];

// ==========================================
// 1. GENERATE KOTAK FOTO MASSAL
// ==========================================
for (let i = 0; i < totalFoto; i++) {
    const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const imgElement = document.createElement('img');
    imgElement.src = `foto/foto (${i}).jpg`; 
    imgElement.alt = `Momen Kita ${i}`;

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
const closeBtn = document.querySelector('.close-btn');

function bukaLightbox(src, caption) {
    lightboxModal.style.display = "block";
    lightboxImg.src = src;
    lightboxCaption.innerText = caption;
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
// 3. MULTI-PLAYER PLAYLIST MANAGEMENT
// ==========================================
const players = [
    document.getElementById('bg-music-1'),
    document.getElementById('bg-music-2'),
    document.getElementById('bg-music-3')
];
let indeksLaguSekarang = 0;

const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('.music-icon');

function eksekusiPutar(indeks) {
    players.forEach(p => {
        if(p) { p.pause(); p.currentTime = 0; }
    });

    const activePlayer = players[indeks];
    if (activePlayer) {
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            musicBtn.title = "Pause Musik";
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
    const activePlayer = players[indeksLaguSekarang];
    if (!activePlayer) return;

    if (activePlayer.paused) {
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
        }).catch(err => console.error(err));
    } else {
        activePlayer.pause();
        musicIcon.classList.remove('playing');
        musicIcon.innerText = "🎵";
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

/// ==========================================
// 5. LOGIKA HUJAN KELOPAK & DAUN MAPLE MULTI-WARNA
// ==========================================
function buatKelopakSakura() {
    const sakura = document.createElement("div");
    customSakuraClass = "sakura";
    sakura.className = customSakuraClass;
    
    // Daftar partikel (Sakura tetap dibuat dominan)
    const partikelBiasa = ["🌸", "🌸", "🌸", "🌸", "🌸", "💮", "🌼", "🌻", "🌺", "🍁", "🍁", "✨", "❤️"];
    const partikelUltah = ["🎂", "🎈", "🎉", "💖", "✨", "🌸", "💮", "🍰"];
    
    const listSimbol = apakahHariUlangTahun ? partikelUltah : partikelBiasa;
    const simbolTerpilih = listSimbol[Math.floor(Math.random() * listSimbol.length)];
    sakura.innerText = simbolTerpilih;
    
    // JIKA YANG MUNCUL DAUN MAPLE, BERIKAN VARIASI WARNA ACAK VIA CSS CLASS
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
    // Membaca posisi scroll saat ini
    const posisiScroll = window.innerHeight + window.scrollY;
    // Membaca total tinggi maksimal halaman web saat ini
    const totalTinggiHalaman = document.documentElement.scrollHeight;
    
    // Tombol baru akan muncul jika Widia sudah scroll mendekati bawah (sisa 150px dari paling dasar)
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
// LOGIKA TOMBOL SAMBUTAN & AUTOPLAY MUSIK
// ==========================================
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');

if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        players.forEach(p => { if(p) p.load(); });
        eksekusiPutar(indeksLaguSekarang);
    });
}