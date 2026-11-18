const galleryContainer = document.getElementById('dinding-foto');
const totalFoto = 187; // Membaca foto (0) sampai foto (186)

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

// Simpan referensi elemen yang dirender untuk navigasi Next/Prev Lightbox
const galeriTampil = [];

// ==========================================
// 1. ACAK URUTAN FOTO (FISHER-YATES SHUFFLE) + RENDER GALERI
// ==========================================
const urutanFoto = Array.from({ length: totalFoto }, (_, index) => index);

for (let i = urutanFoto.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [urutanFoto[i], urutanFoto[j]] = [urutanFoto[j], urutanFoto[i]];
}

urutanFoto.forEach((indeksFoto, posisiTampil) => {
    const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const imgElement = document.createElement('img');
    imgElement.src = `foto/foto (${indeksFoto}).jpg`; 
    imgElement.alt = `Momen Kita ${indeksFoto}`;
    
    imgElement.className = 'blur-load';
    imgElement.setAttribute('loading', 'lazy');
    
    imgElement.onload = function() {
        this.classList.add('loaded');
    };

    let urutanCek = 1;
    imgElement.onerror = function() {
        if (urutanCek === 1) {
            this.src = `foto/foto (${indeksFoto}).jpeg`;
            urutanCek = 2;
        } else if (urutanCek === 2) {
            this.src = `foto/foto (${indeksFoto}).JPG`;
            urutanCek = 3;
        } else if (urutanCek === 3) {
            this.src = `foto/foto  (${indeksFoto}).jpg`;
            urutanCek = 4;
        } else if (urutanCek === 4) {
            this.src = `foto/foto  (${indeksFoto}).jpeg`;
            urutanCek = 5;
        }
    };

    const captionElement = document.createElement('div');
    captionElement.className = 'photo-caption';
    captionElement.innerText = captionAcak;

    galleryItem.appendChild(imgElement);
    galleryItem.appendChild(captionElement);
    
    galeriTampil.push({ img: imgElement, caption: captionAcak });

    galleryItem.addEventListener('click', function() {
        bukaLightbox(posisiTampil);
    });

    galleryContainer.appendChild(galleryItem);
});

// ==========================================
// 2. DETEKSI HARI SPESIAL (ULTAH, MENSIVERSARY & ANNIVERSARY)
// ==========================================
const tanggalJadian = new Date("2026-05-14T09:00:00");
const tanggalUltahWidia = "10-17"; 

const hariIni = new Date();
const bulanSekarang = hariIni.getMonth() + 1;
const tanggalSekarang = hariIni.getDate();
const bulanTanggalSekarang = `${String(bulanSekarang).padStart(2, '0')}-${String(tanggalSekarang).padStart(2, '0')}`;

const apakahHariUlangTahun = (bulanTanggalSekarang === tanggalUltahWidia);
const apakahAnniversary = (bulanTanggalSekarang === "05-14" && hariIni.getFullYear() > 2026);
const apakahMensiversary = (tanggalSekarang === 14 && !apakahAnniversary && hariIni >= tanggalJadian);
const apakahHariSpesial = apakahHariUlangTahun || apakahAnniversary || apakahMensiversary;

window.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('web-title');
    const subtitleEl = document.getElementById('web-subtitle');
    if (!titleEl) return;

    if (apakahHariUlangTahun) {
        titleEl.innerHTML = "Happy Birthday, Widia! 🎂🎉";
        if (subtitleEl) subtitleEl.innerText = "Semoga panjang umur, sehat selalu, dan semua doa baikmu terkabul. ❤️";
    } else if (apakahAnniversary) {
        const tahunKe = hariIni.getFullYear() - 2026;
        titleEl.innerHTML = `Happy ${tahunKe} Year Anniversary, Sayang! 💍✨`;
        if (subtitleEl) subtitleEl.innerText = "Terima kasih sudah bertahan dan tumbuh bersama sejauh ini. ❤️";
    } else if (apakahMensiversary) {
        const bulanKe = (hariIni.getFullYear() - 2026) * 12 + (bulanSekarang - 5);
        if (bulanKe > 0) {
            titleEl.innerHTML = `Happy Mensiversary ke-${bulanKe}, Widia! 🥰💖`;
            if (subtitleEl) subtitleEl.innerText = "Satu bulan lagi terlewati dengan penuh cerita indah bersamamu. ✨";
        }
    }
});

// ==========================================
// 3. LOGIKA LIGHTBOX + NAVIGASI GESER + DOUBLE-TAP HEART
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
const doubleTapHeart = document.getElementById('double-tap-heart');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let indeksLightboxSekarang = 0;

function bukaLightbox(indeks) {
    indeksLightboxSekarang = (indeks + galeriTampil.length) % galeriTampil.length;
    const itemTerpilih = galeriTampil[indeksLightboxSekarang];

    lightboxModal.style.display = "block";
    
    // Reset animasi zoom halus saat pindah foto
    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight; // Trigger reflow
    lightboxImg.style.animation = null;

    lightboxImg.src = itemTerpilih.img.src;
    lightboxCaption.innerText = `${itemTerpilih.caption} (${indeksLightboxSekarang + 1}/${galeriTampil.length})`;
    
    if (lightboxDownloadBtn) {
        lightboxDownloadBtn.href = itemTerpilih.img.src;
        lightboxDownloadBtn.setAttribute('download', `Momen-Widia-Tan-${indeksLightboxSekarang + 1}.jpg`);
    }
}

function picuHatiLightbox() {
    if (!doubleTapHeart) return;
    doubleTapHeart.classList.remove('animate');
    void doubleTapHeart.offsetWidth; // Trigger reflow agar animasi bisa berulang
    doubleTapHeart.classList.add('animate');
}

// Double-Click di Desktop / Laptop pada foto Lightbox
if (lightboxImg) {
    lightboxImg.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        picuHatiLightbox();
    });

    // Double-Tap di Layar Sentuh HP pada foto Lightbox
    let waktuTapTerakhir = 0;
    lightboxImg.addEventListener('touchend', (e) => {
        const waktuSekarang = new Date().getTime();
        const selisihTap = waktuSekarang - waktuTapTerakhir;
        if (selisihTap > 0 && selisihTap < 300) {
            e.preventDefault();
            picuHatiLightbox();
        }
        waktuTapTerakhir = waktuSekarang;
    });
}

function fotoBerikutnya() {
    bukaLightbox(indeksLightboxSekarang + 1);
}

function fotoSebelumnya() {
    bukaLightbox(indeksLightboxSekarang - 1);
}

if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); fotoSebelumnya(); });
if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); fotoBerikutnya(); });

closeBtn.addEventListener('click', function() {
    lightboxModal.style.display = "none";
});

lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
        lightboxModal.style.display = "none";
    }
});

// Navigasi Keyboard (Panah Kiri, Panah Kanan, Escape)
document.addEventListener('keydown', function(e) {
    if (lightboxModal.style.display === "block") {
        if (e.key === "ArrowRight") fotoBerikutnya();
        else if (e.key === "ArrowLeft") fotoSebelumnya();
        else if (e.key === "Escape") lightboxModal.style.display = "none";
    }
});

// Navigasi Touch Swipe di Layar HP
let touchStartX = 0;
lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightboxModal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const selisihSwipe = touchStartX - touchEndX;
    if (Math.abs(selisihSwipe) > 50) {
        if (selisihSwipe > 0) fotoBerikutnya();
        else fotoSebelumnya();
    }
}, { passive: true });

// ==========================================
// 4. MULTI-PLAYER PLAYLIST + TOAST NOTIFIKASI + DOUBLE-CLICK NEXT
// ==========================================
const players = [
    document.getElementById('bg-music-1'),
    document.getElementById('bg-music-2'),
    document.getElementById('bg-music-3')
];

// Silakan ubah judul lagu di bawah ini sesuai nama file MP3 milikmu
const daftarJudulLagu = [
    "Lagu 1 - Melodi Untuk Widia 🎶",
    "Lagu 2 - Cerita Kita Berdua 💖",
    "Lagu 3 - Selamanya Bersamamu ✨"
];

let indeksLaguSekarang = 0;
let isFading = false;
let toastTimeout = null;
let clickTimer = null;

const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('.music-icon');
const musicToast = document.getElementById('music-toast');

function tampilkanToastLagu(teks) {
    if (!musicToast) return;
    musicToast.innerText = teks;
    musicToast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        musicToast.classList.remove('show');
    }, 3200);
}

function eksekusiPutar(indeks) {
    players.forEach(p => {
        if(p) { p.pause(); p.currentTime = 0; }
    });

    const activePlayer = players[indeks];
    if (activePlayer) {
        activePlayer.volume = 0;
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            tampilkanToastLagu(`Memutar: ${daftarJudulLagu[indeks]}`);
            
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
        }).catch(() => console.error("Autoplay safety triggered."));
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

// Klik 1x: Play/Pause dengan Fade | Klik 2x: Lompat ke Lagu Berikutnya
musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();

    if (clickTimer !== null) {
        clearTimeout(clickTimer);
        clickTimer = null;
        isFading = false;
        indeksLaguSekarang = (indeksLaguSekarang + 1) % players.length;
        eksekusiPutar(indeksLaguSekarang);
        return;
    }

    clickTimer = setTimeout(() => {
        clickTimer = null;
        if (isFading) return;

        const activePlayer = players[indeksLaguSekarang];
        if (!activePlayer) return;

        if (activePlayer.paused) {
            activePlayer.volume = 0;
            activePlayer.play().then(() => {
                musicIcon.classList.add('playing');
                musicIcon.innerText = "💿";
                tampilkanToastLagu(`Memutar: ${daftarJudulLagu[indeksLaguSekarang]}`);
                
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
            isFading = true;
            tampilkanToastLagu("Musik dijeda ⏸️");
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
    }, 240);
});

// ==========================================
// 5. LOGIKA POP-UP SURAT CINTA RAHASIA
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
// 6. LOGIKA HITUNG WAKTU JADIAN
// ==========================================
function hitungWaktuJadian() {
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
// 7. HUJAN KELOPAK, DAUN MAPLE & PERCIKAN SENTUHAN (TAP SPARKLES)
// ==========================================
function buatKelopakSakura() {
    const sakura = document.createElement("div");
    sakura.className = "sakura";
    
    const partikelBiasa = ["🌸", "🌸", "🌸", "🌸", "🌸", "💮", "🌼", "🌻", "🌺", "🍁", "🍁", "✨", "❤️"];
    const partikelSpesial = ["🎂", "🎈", "🎉", "💖", "✨", "🌸", "💍", "❤️"];
    
    const listSimbol = apakahHariSpesial ? partikelSpesial : partikelBiasa;
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

// Percikan Hati & Kilau Saat Layar Diklik / Disentuh
document.addEventListener('click', function(e) {
    const simbolSparkle = ["❤️", "✨", "🌸", "💖"];
    const sparkle = document.createElement("span");
    sparkle.className = "tap-sparkle";
    sparkle.innerText = simbolSparkle[Math.floor(Math.random() * simbolSparkle.length)];
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;

    document.body.appendChild(sparkle);
    setTimeout(() => { sparkle.remove(); }, 900);
});

// ==========================================
// 8. HOVER TAB TITLE DYNAMIC TRICK
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
// 9. SCROLL PROGRESS BAR & TOMBOL KEMBALI KE ATAS
// ==========================================
const backToTopBtn = document.getElementById("back-to-top");
const scrollProgressBar = document.getElementById("scroll-progress");

window.addEventListener('scroll', () => {
    const scrollAtas = window.scrollY;
    const tinggiBisaDiScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update panjang garis progres di atas layar
    if (scrollProgressBar && tinggiBisaDiScroll > 0) {
        const persentaseScroll = (scrollAtas / tinggiBisaDiScroll) * 100;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, persentaseScroll))}%`;
    }

    // Munculkan tombol Back to Top di area bawah halaman
    const posisiScroll = window.innerHeight + scrollAtas;
    const totalTinggiHalaman = document.documentElement.scrollHeight;
    
    if (backToTopBtn) {
        if (posisiScroll >= totalTinggiHalaman - 250) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    }
}, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 10. TOMBOL SAMBUTAN & SMART SCROLL-REVEAL (INTERSECTION OBSERVER)
// ==========================================
const welcomeOverlay = document.getElementById('welcome-overlay');
const startBtn = document.getElementById('start-btn');

function aktifkanScrollReveal() {
    const semuaFoto = document.querySelectorAll('.gallery-item');
    let antreanBatch = 0;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const kartu = entry.target;
                const jeda = antreanBatch * 65;
                antreanBatch++;

                setTimeout(() => {
                    kartu.classList.add('muncul');
                }, jeda);

                obs.unobserve(kartu);

                setTimeout(() => {
                    antreanBatch = 0;
                }, 400);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
    });

    semuaFoto.forEach(foto => observer.observe(foto));
}

if (startBtn && welcomeOverlay) {
    startBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('fade-out');
        
        players.forEach(p => { if(p) p.load(); });
        eksekusiPutar(indeksLaguSekarang);
        
        aktifkanScrollReveal();
    });
}