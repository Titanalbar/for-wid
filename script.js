const galleryContainer = document.getElementById('dinding-foto');
const totalFoto = 47;

const daftarCaption = [
    "Momen Manis ✨", "Kebersamaan Kita 🌸", "Hari yang Bahagia 🥰", 
    "Tawa Bersamamu 🗓️", "Momen Berharga 📂", "Senyuman Terbaik 😊", 
    "Kilas Balik Memori 📸", "Langkah Bersama 🗺️", "Sisi Cerita Lain 💬", 
    "Tatapan Hangat 🌟", "Hari yang Tenang 🍃", "Hingga Waktu Berhenti ⏳", 
    "Selamanya Bersama 🔒", "Cerita Baru 📖", "Tawa Lepas 💖", "Dunia Milik Kita 🌍"
];

// 1. GENERATE KOTAK FOTO OTOMATIS
for (let i = 1; i <= totalFoto; i++) {
    const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const imgElement = document.createElement('img');
    imgElement.src = `foto/foto (${i}).jpg`; 
    imgElement.alt = `Momen Kita ${i}`;

    let mencobaFormat = 1;
    imgElement.onerror = function() {
        if (mencobaFormat === 1) {
            this.src = `foto/foto (${i}).jpeg`;
            mencobaFormat = 2;
        } else if (mencobaFormat === 2) {
            this.src = `foto/foto (${i}).JPG`;
            mencobaFormat = 3;
        } else if (mencobaFormat === 3) {
            this.src = `foto/foto  (${i}).jpg`;
            mencobaFormat = 4;
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

// 2. LOGIKA LIGHTBOX (ZOOM FOTO)
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

// 3. LOGIKA PEMUTAR MUSIK LATAR BELAKANG
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = musicBtn.querySelector('.music-icon');

// Tombol manual dengan proteksi muat ulang (Force Load & Playback Check)
musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (bgMusic.readyState === 0) {
        bgMusic.load();
    }

    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            musicBtn.title = "Pause Musik";
        }).catch(err => {
            alert("Gagal memutar lagu!\n\nPastikan file bernama 'lagu.mp3' sudah ditaruh di folder utama (sejajar dengan index.html), bukan di dalam folder 'foto'.");
            console.error("Detail Error Audio:", err);
        });
    } else {
        bgMusic.pause();
        musicIcon.classList.remove('playing');
        musicIcon.innerText = "🎵";
        musicBtn.title = "Putar Musik";
    }
});

// 4. LOGIKA HITUNG HARI JADIAN (DISET KE: 14 MEI 2026 JAM 09:00 AM)
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

// 5. LOGIKA HUJAN KELOPAK BUNGA SAKURA
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
// 6. LOGIKA TOMBOL SAMBUTAN & PEMUTAR MUSIK INSTAN
// ==========================================
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');

if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicIcon.classList.add('playing');
                musicIcon.innerText = "💿";
                musicBtn.title = "Pause Musik";
            }).catch(err => {
                console.error("Gagal memutar audio otomatis:", err);
            });
        }
    });
}