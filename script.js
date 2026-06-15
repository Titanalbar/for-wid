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
// 1. GENERATE KOTAK FOTO & INISIALISASI TILT 3D
// ==========================================
for (let i = 0; i < totalFoto; i++) {
    const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    galleryItem.setAttribute('data-tilt', '');
    galleryItem.setAttribute('data-tilt-max', '15');       
    galleryItem.setAttribute('data-tilt-speed', '400');    
    galleryItem.setAttribute('data-tilt-glare', 'true');   
    galleryItem.setAttribute('data-tilt-max-glare', '0.2');

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

if (window.innerWidth > 600 && typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".gallery-item"));
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
// 3. MULTI-PLAYER PLAYLIST MANAGEMENT (ANTI-BLOKIR CHROME)
// ==========================================
const players = [
    document.getElementById('bg-music-1'),
    document.getElementById('bg-music-2'),
    document.getElementById('bg-music-3')
];
let indeksLaguSekarang = 0;
let statusMusikBerjalan = false;

const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('.music-icon');

// Fungsi utama memutar lagu berdasarkan index player
function eksekusiPutar(indeks) {
    // Matikan semua player lain terlebih dahulu agar tidak saling tabrakan suara
    players.forEach(p => {
        p.pause();
        p.currentTime = 0;
    });

    const activePlayer = players[indeks];
    if (activePlayer) {
        activePlayer.play().then(() => {
            statusMusikBerjalan = true;
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            musicBtn.title = "Pause Musik";
        }).catch(err => console.error("Gagal putar otomatis player ke-" + indeks, err));
    }
}

// Hubungkan semua event 'ended' pada masing-masing player secara mandiri
players.forEach((player, indeks) => {
    player.addEventListener('ended', function() {
        // Hitung index lagu berikutnya (0 -> 1 -> 2 -> kembali ke 0)
        indeksLaguSekarang = (indeks + 1) % players.length;
        eksekusiPutar(indeksLaguSekarang);
    });
});

// Handler Klik Manual pada Tombol Tunggal Piringan Hitam
musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const activePlayer = players[indeksLaguSekarang];

    if (!activePlayer) return;

    if (activePlayer.paused) {
        activePlayer.play().then(() => {
            statusMusikBerjalan = true;
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
        }).catch(err => console.error(err));
    } else {
        activePlayer.pause();
        statusMusikBerjalan = false;
        musicIcon.classList.remove('playing');
        musicIcon.innerText = "🎵";
    }
});

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
// 5. LOGIKA HUJAN KELOPAK BUNGA SAKURA
// ==========================================
function buatKelopakSakura() {
    const sakura = document.createElement("div");
    sakura.className = "sakura";
    
    const simbolBunga = ["🌸", "🌸", "✨", "❤️"];
    sakura.innerText = simbolBunga[Math.floor(Math.random() * simbolBunga.length)];
    
    sakura.style.left = Math.random() * 100 + "vw";
    sakura.style.fontSize = Math.random() * 0.5 + 0.8 + "rem";
    
    const duration = Math.random() * 4 + 4;
    sakura.style.animationDuration = duration + "s";
    sakura.style.opacity = Math.random() * 0.6 + 0.4;

    document.body.appendChild(sakura);

    setTimeout(() => {
        sakura.remove();
    }, duration * 1000);
}

setInterval(buatKelopakSakura, 400);

// ==========================================
// 6. LOGIKA TOMBOL SAMBUTAN & UNLOCK ALL AUDIO
// ==========================================
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');

if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        
        // TRIK UTAMA: Pancing semua player dengan metode load kosong 
        // agar browser Chrome menganggap ketiga player sudah disetujui pengguna
        players.forEach(p => {
            if(p) p.load();
        });

        // Jalankan lagu pertama
        eksekusiPutar(indeksLaguSekarang);
    });
}