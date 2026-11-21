const galleryContainer = document.getElementById('dinding-foto');
const memoryBadge = document.getElementById('memory-badge');
const jumlahFotoDasar = 187; // Jumlah foto dasar (indeks 0 sampai 186)

// Daftarkan Service Worker untuk dukungan akses offline & ikon layar utama
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

// Helper Umpan Balik Getaran Lembut di HP (Mobile Haptic Touch)
function getarLembut(pola = 18) {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pola);
        } catch {
            // Abaikan jika browser membatasi vibrasi
        }
    }
}

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

const galeriTampil = [];
let galeriSiap = false;
let sudahKlikMulai = false;

// ==========================================
// 1. PARALLEL BATCH AUTO-DISCOVERY + LIVE MEMORY COUNTER BADGE
// ==========================================
async function cekFileAda(url) {
    try {
        const respon = await fetch(url, { method: 'HEAD' });
        return respon.ok;
    } catch {
        return false;
    }
}

async function cekIndeksFotoAda(indeks) {
    const kandidatUrl = [
        `foto/foto (${indeks}).jpg`,
        `foto/foto (${indeks}).jpeg`,
        `foto/foto (${indeks}).JPG`,
        `foto/foto  (${indeks}).jpg`,
        `foto/foto  (${indeks}).jpeg`
    ];
    const hasil = await Promise.all(kandidatUrl.map(cekFileAda));
    return hasil.some(Boolean);
}

async function deteksiTotalFotoOtomatis() {
    let indeksAwal = jumlahFotoDasar;
    const ukuranBatch = 15;

    while (true) {
        const daftarIndeks = Array.from({ length: ukuranBatch }, (_, i) => indeksAwal + i);
        const hasilBatch = await Promise.all(daftarIndeks.map(cekIndeksFotoAda));

        const indeksKosongPertama = hasilBatch.indexOf(false);
        if (indeksKosongPertama !== -1) {
            return indeksAwal + indeksKosongPertama;
        }
        indeksAwal += ukuranBatch;
    }
}

function muatSumberGambar(imgElement) {
    if (imgElement.dataset.dimuat === "true") return;
    imgElement.dataset.dimuat = "true";

    const indeksFoto = imgElement.dataset.indeksFoto;
    imgElement.src = `foto/foto (${indeksFoto}).jpg`;

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
}

function aktifkanPemuatanGambarViewport() {
    const semuaGambar = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                muatSumberGambar(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "350px 0px"
    });

    semuaGambar.forEach(img => imageObserver.observe(img));
}

async function inisialisasiGaleri() {
    const totalFotoSekarang = await deteksiTotalFotoOtomatis();
    if (memoryBadge) {
        memoryBadge.innerText = `${totalFotoSekarang} Momen Tersimpan & Terus Bertambah 📸`;
    }

    const urutanFoto = Array.from({ length: totalFotoSekarang }, (_, index) => index);

    for (let i = urutanFoto.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [urutanFoto[i], urutanFoto[j]] = [urutanFoto[j], urutanFoto[i]];
    }

    urutanFoto.forEach((indeksFoto, posisiTampil) => {
        const captionAcak = daftarCaption[Math.floor(Math.random() * daftarCaption.length)];
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const imgElement = document.createElement('img');
        imgElement.alt = `Momen Kita ${indeksFoto}`;
        imgElement.className = 'blur-load';
        imgElement.decoding = 'async';
        imgElement.dataset.indeksFoto = indeksFoto;
        
        imgElement.onload = function() {
            this.classList.add('loaded');
        };

        const captionElement = document.createElement('div');
        captionElement.className = 'photo-caption';
        captionElement.innerText = captionAcak;

        galleryItem.appendChild(imgElement);
        galleryItem.appendChild(captionElement);
        
        galeriTampil.push({ img: imgElement, caption: captionAcak });

        galleryItem.addEventListener('click', function() {
            getarLembut(12);
            bukaLightbox(posisiTampil);
        });

        galleryContainer.appendChild(galleryItem);
    });

    aktifkanPemuatanGambarViewport();
    galeriSiap = true;
    if (sudahKlikMulai) {
        aktifkanScrollReveal();
    }
}

inisialisasiGaleri();

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
// 3. LIGHTBOX + EFEK SINEMATIK KEN BURNS SLIDESHOW + DOUBLE-TAP HEART
// ==========================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
const slideshowBtn = document.getElementById('slideshow-btn');
const doubleTapHeart = document.getElementById('double-tap-heart');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let indeksLightboxSekarang = 0;
let slideshowTimer = null;
let slideshowAktif = false;

function bukaLightbox(indeks) {
    if (galeriTampil.length === 0) return;
    indeksLightboxSekarang = (indeks + galeriTampil.length) % galeriTampil.length;
    const itemTerpilih = galeriTampil[indeksLightboxSekarang];

    muatSumberGambar(itemTerpilih.img);

    lightboxModal.style.display = "block";
    
    lightboxImg.classList.remove('ken-burns');
    lightboxImg.style.animation = 'none';
    void lightboxImg.offsetHeight;
    lightboxImg.style.animation = null;

    if (slideshowAktif) {
        lightboxImg.classList.add('ken-burns');
    }

    const urlFoto = itemTerpilih.img.src || `foto/foto (${itemTerpilih.img.dataset.indeksFoto}).jpg`;
    lightboxImg.src = urlFoto;
    lightboxCaption.innerText = `${itemTerpilih.caption} (${indeksLightboxSekarang + 1}/${galeriTampil.length})`;
    
    if (lightboxDownloadBtn) {
        lightboxDownloadBtn.href = urlFoto;
        lightboxDownloadBtn.setAttribute('download', `Momen-Widia-Tan-${indeksLightboxSekarang + 1}.jpg`);
    }
}

function tutupLightbox() {
    lightboxModal.style.display = "none";
    hentikanSlideshow();
}

function mulaiSlideshow() {
    slideshowAktif = true;
    if (slideshowBtn) {
        slideshowBtn.innerText = "⏸️ Jeda Slide";
        slideshowBtn.classList.add('active');
    }
    if (lightboxImg) {
        lightboxImg.classList.remove('ken-burns');
        void lightboxImg.offsetWidth;
        lightboxImg.classList.add('ken-burns');
    }
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
        bukaLightbox(indeksLightboxSekarang + 1);
    }, 4200);
}

function hentikanSlideshow() {
    slideshowAktif = false;
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    if (lightboxImg) {
        lightboxImg.classList.remove('ken-burns');
    }
    if (slideshowBtn) {
        slideshowBtn.innerText = "▶️ Slideshow";
        slideshowBtn.classList.remove('active');
    }
}

if (slideshowBtn) {
    slideshowBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(16);
        if (slideshowAktif) hentikanSlideshow();
        else mulaiSlideshow();
    });
}

function picuHatiLightbox() {
    if (!doubleTapHeart) return;
    getarLembut([25, 45, 35]);
    doubleTapHeart.classList.remove('animate');
    void doubleTapHeart.offsetWidth;
    doubleTapHeart.classList.add('animate');
}

if (lightboxImg) {
    lightboxImg.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        picuHatiLightbox();
    });

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
    getarLembut(12);
    bukaLightbox(indeksLightboxSekarang + 1);
    if (slideshowAktif) mulaiSlideshow();
}

function fotoSebelumnya() {
    getarLembut(12);
    bukaLightbox(indeksLightboxSekarang - 1);
    if (slideshowAktif) mulaiSlideshow();
}

if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); fotoSebelumnya(); });
if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); fotoBerikutnya(); });

closeBtn.addEventListener('click', tutupLightbox);

lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal) {
        tutupLightbox();
    }
});

document.addEventListener('keydown', function(e) {
    if (lightboxModal.style.display === "block") {
        if (e.key === "ArrowRight") fotoBerikutnya();
        else if (e.key === "ArrowLeft") fotoSebelumnya();
        else if (e.key === "Escape") tutupLightbox();
    }
});

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
// 4. PLAYLIST LAGU LATAR + AUDIO DUCKING + MEDIA SESSION LOCKSCREEN HP
// ==========================================
const players = [
    document.getElementById('bg-music-1'),
    document.getElementById('bg-music-2'),
    document.getElementById('bg-music-3')
].filter(Boolean);

const daftarJudulLagu = [
    "Lagu 1 - Melodi Untuk Widia 🎶",
    "Lagu 2 - Cerita Kita Berdua 💖",
    "Lagu 3 - Selamanya Bersamamu ✨"
];

let indeksLaguSekarang = 0;
let isFading = false;
let volumeFadeInterval = null;
let sedangMembacaSurat = false;
let sedangPutarVoiceNote = false;
let toastTimeout = null;
let clickTimer = null;

const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('.music-icon');
const musicToast = document.getElementById('music-toast');

function perbaruiMediaSessionLockscreen(judulLagu, sedangPutar) {
    if (!('mediaSession' in navigator)) return;

    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: judulLagu.replace(/[^\w\s\-&().,!?']/g, '').trim() || "Melodi Untuk Widia",
            artist: "Titan & Widia ❤️",
            album: "Our Memory Wall",
            artwork: [
                { src: "foto/foto (1).jpg", sizes: "512x512", type: "image/jpeg" }
            ]
        });

        navigator.mediaSession.playbackState = sedangPutar ? "playing" : "paused";

        navigator.mediaSession.setActionHandler("play", () => {
            const activePlayer = players[indeksLaguSekarang];
            if (activePlayer && activePlayer.paused) {
                activePlayer.play().then(() => {
                    musicIcon.classList.add('playing');
                    musicIcon.innerText = "💿";
                    transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
                    perbaruiMediaSessionLockscreen(daftarJudulLagu[indeksLaguSekarang] || "Melodi Untuk Widia", true);
                }).catch(() => {});
            }
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            const activePlayer = players[indeksLaguSekarang];
            if (activePlayer && !activePlayer.paused) {
                activePlayer.pause();
                musicIcon.classList.remove('playing');
                musicIcon.innerText = "🎵";
                perbaruiMediaSessionLockscreen(daftarJudulLagu[indeksLaguSekarang] || "Melodi Untuk Widia", false);
            }
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            indeksLaguSekarang = (indeksLaguSekarang - 1 + players.length) % players.length;
            eksekusiPutar(indeksLaguSekarang);
        });

        navigator.mediaSession.setActionHandler("nexttrack", () => {
            indeksLaguSekarang = (indeksLaguSekarang + 1) % players.length;
            eksekusiPutar(indeksLaguSekarang);
        });
    } catch {
        // Abaikan jika browser tidak mendukung penuh MediaMetadata
    }
}

function getTargetVolumeAktif() {
    if (sedangPutarVoiceNote) return 0.01; // Backsound super pelan (1%) agar suara kamu dominan
    if (sedangMembacaSurat) return 0.25;   // Volume baca surat (25%)
    return 1.0;                            // Volume normal (100%)
}

function transisiVolumeHalus(player, volumeTujuan, onSelesai = null) {
    if (!player) return;
    clearInterval(volumeFadeInterval);
    isFading = true;

    volumeFadeInterval = setInterval(() => {
        const saatIni = parseFloat(player.volume);
        const selisih = volumeTujuan - saatIni;

        if (Math.abs(selisih) <= 0.015) {
            player.volume = volumeTujuan;
            clearInterval(volumeFadeInterval);
            volumeFadeInterval = null;
            isFading = false;
            if (onSelesai) onSelesai();
        } else {
            const langkah = selisih > 0 ? 0.015 : -0.015;
            player.volume = Math.min(1, Math.max(0, parseFloat((saatIni + langkah).toFixed(3))));
        }
    }, 45);
}

function pasangListenerLaguSelesai(player) {
    player.addEventListener('ended', function() {
        const posisiSekarang = players.indexOf(player);
        indeksLaguSekarang = (posisiSekarang + 1) % players.length;
        eksekusiPutar(indeksLaguSekarang);
    });
}

players.forEach(pasangListenerLaguSelesai);

async function deteksiLaguTambahanOtomatis() {
    let nomorAwal = players.length + 1;
    const batchLagu = 5;

    while (true) {
        const daftarNomor = Array.from({ length: batchLagu }, (_, i) => nomorAwal + i);
        const hasilCek = await Promise.all(daftarNomor.map(n => cekFileAda(`lagu/lagu${n}.mp3`)));

        let berhenti = false;
        for (let i = 0; i < hasilCek.length; i++) {
            if (hasilCek[i]) {
                const nomorLagu = daftarNomor[i];
                const audioBaru = document.createElement('audio');
                audioBaru.src = `lagu/lagu${nomorLagu}.mp3`;
                audioBaru.preload = 'none';
                document.body.appendChild(audioBaru);

                pasangListenerLaguSelesai(audioBaru);
                players.push(audioBaru);
                daftarJudulLagu.push(`Lagu ${nomorLagu} - Kenangan Kita 🎶`);
            } else {
                berhenti = true;
                break;
            }
        }

        if (berhenti) break;
        nomorAwal += batchLagu;
    }
}

deteksiLaguTambahanOtomatis();

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
    clearInterval(volumeFadeInterval);
    players.forEach(p => {
        if(p) { p.pause(); p.currentTime = 0; }
    });

    const activePlayer = players[indeks];
    if (activePlayer) {
        activePlayer.volume = 0;
        activePlayer.play().then(() => {
            musicIcon.classList.add('playing');
            musicIcon.innerText = "💿";
            const judul = daftarJudulLagu[indeks] || `Lagu ${indeks + 1} - Kenangan Kita 🎶`;
            tampilkanToastLagu(`Memutar: ${judul}`);
            perbaruiMediaSessionLockscreen(judul, true);
            transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
        }).catch(() => console.error("Autoplay safety triggered."));
    }
}

musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    getarLembut(15);

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
        const activePlayer = players[indeksLaguSekarang];
        if (!activePlayer) return;

        if (activePlayer.paused) {
            activePlayer.volume = 0;
            activePlayer.play().then(() => {
                musicIcon.classList.add('playing');
                musicIcon.innerText = "💿";
                const judul = daftarJudulLagu[indeksLaguSekarang] || `Lagu ${indeksLaguSekarang + 1} - Kenangan Kita 🎶`;
                tampilkanToastLagu(`Memutar: ${judul}`);
                perbaruiMediaSessionLockscreen(judul, true);
                transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
            }).catch(err => console.error(err));
        } else {
            tampilkanToastLagu("Musik dijeda ⏸️");
            perbaruiMediaSessionLockscreen(daftarJudulLagu[indeksLaguSekarang] || "Melodi Untuk Widia", false);
            transisiVolumeHalus(activePlayer, 0, () => {
                activePlayer.pause();
                musicIcon.classList.remove('playing');
                musicIcon.innerText = "🎵";
            });
        }
    }, 240);
});

// ==========================================
// 5. AMPLOP TERBUKA, SURAT CINTA, VOICE NOTE TERSEMBUNYI (450% BOOST + COMPRESSOR + FADE IN/OUT)
// ==========================================
const letterBtn = document.getElementById('letter-btn');
const letterModal = document.getElementById('letter-modal');
const envelopeStage = document.getElementById('envelope-stage');
const envelopeCard = document.getElementById('envelope-card');
const letterBox = document.getElementById('letter-box');
const letterProgress = document.getElementById('letter-progress');
const closeLetterBtn = letterBox ? letterBox.querySelector('.close-letter-btn') : null;

const tabNowLetter = document.getElementById('tab-now-letter');
const tabCapsuleLetter = document.getElementById('tab-capsule-letter');
const panelNowLetter = document.getElementById('panel-now-letter');
const panelCapsuleLetter = document.getElementById('panel-capsule-letter');

const voicenoteCard = document.getElementById('voicenote-card');
const voicenotePlayer = document.getElementById('voicenote-player');
let voicenoteSiap = false;
let sudahAutoPlayVoiceNote = false;
let sedangFadeOutVoiceNote = false;
let voiceFadeInterval = null;

// Web Audio API Booster + Compressor untuk memperbesar suara rekaman (450%) tanpa pecah
let voiceAudioCtx = null;
let voiceGainNode = null;
const TARGET_BOOST_VOICE = 4.5; // 450% volume suara kamu

function siapkanBoosterSuara() {
    if (!voicenotePlayer) return;

    if (voiceAudioCtx && voiceAudioCtx.state === 'suspended') {
        voiceAudioCtx.resume().catch(() => {});
    }

    if (voiceGainNode) return;

    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        voiceAudioCtx = new AudioContextClass();
        const source = voiceAudioCtx.createMediaElementSource(voicenotePlayer);
        voiceGainNode = voiceAudioCtx.createGain();
        voiceGainNode.gain.value = 0;

        // Compressor mencegah distorsi saat vokal dikeraskan 4.5x
        const compressor = voiceAudioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-18, voiceAudioCtx.currentTime);
        compressor.knee.setValueAtTime(12, voiceAudioCtx.currentTime);
        compressor.ratio.setValueAtTime(6, voiceAudioCtx.currentTime);
        compressor.attack.setValueAtTime(0.005, voiceAudioCtx.currentTime);
        compressor.release.setValueAtTime(0.15, voiceAudioCtx.currentTime);

        source.connect(voiceGainNode);
        voiceGainNode.connect(compressor);
        compressor.connect(voiceAudioCtx.destination);
    } catch {
        // Fallback otomatis ke volume standar HTML5 jika browser membatasi file://
        voiceGainNode = null;
    }
}

function aturLevelSuaraVoiceNote(nilaiNormalisasi) {
    const levelAman = Math.min(1, Math.max(0, nilaiNormalisasi));
    if (voiceGainNode && voiceAudioCtx) {
        if (voiceAudioCtx.state === 'suspended') {
            voiceAudioCtx.resume().catch(() => {});
        }
        voicenotePlayer.volume = 1.0;
        voiceGainNode.gain.setTargetAtTime(levelAman * TARGET_BOOST_VOICE, voiceAudioCtx.currentTime, 0.03);
    } else if (voicenotePlayer) {
        voicenotePlayer.volume = levelAman;
    }
}

function fadeInVoiceNote(durasiMs = 1200) {
    if (!voicenotePlayer) return;
    clearInterval(voiceFadeInterval);
    sedangFadeOutVoiceNote = false;

    siapkanBoosterSuara();
    aturLevelSuaraVoiceNote(0);

    voicenotePlayer.play().then(() => {
        const langkahTotal = 24;
        const jedaMs = durasiMs / langkahTotal;
        let langkahSekarang = 0;

        voiceFadeInterval = setInterval(() => {
            langkahSekarang++;
            const progres = langkahSekarang / langkahTotal;
            aturLevelSuaraVoiceNote(progres);

            if (langkahSekarang >= langkahTotal) {
                clearInterval(voiceFadeInterval);
                voiceFadeInterval = null;
            }
        }, jedaMs);
    }).catch(() => {});
}

function fadeOutVoiceNote(durasiMs = 1500, saatSelesai = null) {
    if (!voicenotePlayer || voicenotePlayer.paused) {
        if (saatSelesai) saatSelesai();
        return;
    }
    if (sedangFadeOutVoiceNote && durasiMs > 600) return;

    clearInterval(voiceFadeInterval);
    sedangFadeOutVoiceNote = true;

    const langkahTotal = 20;
    const jedaMs = durasiMs / langkahTotal;
    let langkahSekarang = 0;

    voiceFadeInterval = setInterval(() => {
        langkahSekarang++;
        const sisaProgres = Math.max(0, 1 - (langkahSekarang / langkahTotal));
        aturLevelSuaraVoiceNote(sisaProgres);

        if (langkahSekarang >= langkahTotal) {
            clearInterval(voiceFadeInterval);
            voiceFadeInterval = null;
            sedangFadeOutVoiceNote = false;
            voicenotePlayer.pause();
            if (saatSelesai) saatSelesai();
        }
    }, jedaMs);
}

const tanggalBukaKapsul = new Date("2027-05-14T09:00:00");
const capsuleLockedView = document.getElementById('capsule-locked-view');
const capsuleUnlockedView = document.getElementById('capsule-unlocked-view');
const capsuleCountdownEl = document.getElementById('capsule-countdown');

let timerAmplop1 = null;
let timerAmplop2 = null;

// Deteksi voicenote secara diam-diam di latar belakang (kotak tetap tersembunyi)
function deteksiVoiceNoteRahasia() {
    if (!voicenotePlayer) return;
    if (voicenoteCard) voicenoteCard.style.display = 'none';

    const akhiranAntiCache = window.location.protocol === 'file:' ? '' : `?t=${Date.now()}`;
    const kandidatVoiceNote = [
        `lagu/voicenote.mp3${akhiranAntiCache}`,
        `lagu/Voicenote.mp3${akhiranAntiCache}`,
        `lagu/voicenote.m4a${akhiranAntiCache}`,
        `lagu/voicenote.ogg${akhiranAntiCache}`,
        `lagu/voicenote.wav${akhiranAntiCache}`
    ];

    let indeksCek = 0;

    function ujiKandidatBerikutnya() {
        if (indeksCek >= kandidatVoiceNote.length) {
            voicenoteSiap = false;
            return;
        }

        const urlUji = kandidatVoiceNote[indeksCek];
        const tester = new Audio();
        tester.preload = 'metadata';

        tester.onloadedmetadata = () => {
            voicenotePlayer.src = urlUji;
            voicenoteSiap = true;
        };

        tester.onerror = () => {
            indeksCek++;
            ujiKandidatBerikutnya();
        };

        tester.src = urlUji;
    }

    ujiKandidatBerikutnya();
}
deteksiVoiceNoteRahasia();

if (voicenotePlayer) {
    voicenotePlayer.addEventListener('play', () => {
        sedangPutarVoiceNote = true;
        const activePlayer = players[indeksLaguSekarang];
        if (activePlayer && !activePlayer.paused) {
            transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
        }
    });

    // Otomatis mulai fade-out 1.8 detik sebelum rekaman selesai
    voicenotePlayer.addEventListener('timeupdate', () => {
        if (
            !voicenotePlayer.paused &&
            !sedangFadeOutVoiceNote &&
            isFinite(voicenotePlayer.duration) &&
            voicenotePlayer.duration > 3
        ) {
            const sisaDetik = voicenotePlayer.duration - voicenotePlayer.currentTime;
            if (sisaDetik <= 1.8 && sisaDetik > 0) {
                fadeOutVoiceNote(sisaDetik * 1000);
            }
        }
    });

    const kembalikanVolumeSetelahVoiceNote = () => {
        sedangPutarVoiceNote = false;
        const activePlayer = players[indeksLaguSekarang];
        if (activePlayer && !activePlayer.paused) {
            transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
        }
    };

    voicenotePlayer.addEventListener('pause', kembalikanVolumeSetelahVoiceNote);
    voicenotePlayer.addEventListener('ended', kembalikanVolumeSetelahVoiceNote);
}

function perbaruiStatusKapsulWaktu() {
    const sekarang = new Date();
    if (sekarang >= tanggalBukaKapsul) {
        if (capsuleLockedView) capsuleLockedView.style.display = "none";
        if (capsuleUnlockedView) capsuleUnlockedView.style.display = "block";
        if (tabCapsuleLetter) tabCapsuleLetter.innerText = "Kapsul Waktu 🔓";
    } else if (capsuleCountdownEl) {
        const sisa = tanggalBukaKapsul - sekarang;
        const hari = Math.floor(sisa / (1000 * 60 * 60 * 24));
        const jam = Math.floor((sisa % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((sisa % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((sisa % (1000 * 60)) / 1000);
        capsuleCountdownEl.innerText = `Terbuka dalam ${hari} Hari, ${jam} Jam, ${menit} Menit, ${detik} Detik`;
    }
}
setInterval(perbaruiStatusKapsulWaktu, 1000);
perbaruiStatusKapsulWaktu();

if (tabNowLetter && tabCapsuleLetter && panelNowLetter && panelCapsuleLetter) {
    tabNowLetter.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(12);
        tabNowLetter.classList.add('active');
        tabCapsuleLetter.classList.remove('active');
        panelNowLetter.style.display = "block";
        panelCapsuleLetter.style.display = "none";
        if (letterBox) letterBox.scrollTop = 0;
    });

    tabCapsuleLetter.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(15);
        tabCapsuleLetter.classList.add('active');
        tabNowLetter.classList.remove('active');
        panelCapsuleLetter.style.display = "block";
        panelNowLetter.style.display = "none";
        perbaruiStatusKapsulWaktu();
        if (letterBox) letterBox.scrollTop = 0;
    });
}

function tampilkanLembaranSurat() {
    clearTimeout(timerAmplop1);
    clearTimeout(timerAmplop2);
    if (envelopeStage) envelopeStage.style.display = "none";
    if (letterBox) {
        letterBox.style.display = "block";
        letterBox.scrollTop = 0;
    }
    if (letterProgress) letterProgress.style.width = "0%";
}

function tutupModalSurat() {
    clearTimeout(timerAmplop1);
    clearTimeout(timerAmplop2);
    sedangMembacaSurat = false;
    sudahAutoPlayVoiceNote = false;

    if (voicenotePlayer && !voicenotePlayer.paused) {
        fadeOutVoiceNote(450, () => {
            voicenotePlayer.currentTime = 0;
            sedangPutarVoiceNote = false;
            const activePlayer = players[indeksLaguSekarang];
            if (activePlayer && !activePlayer.paused) {
                transisiVolumeHalus(activePlayer, 1.0);
            }
        });
    } else {
        sedangPutarVoiceNote = false;
        if (voicenotePlayer) voicenotePlayer.currentTime = 0;
        const activePlayer = players[indeksLaguSekarang];
        if (activePlayer && !activePlayer.paused) {
            transisiVolumeHalus(activePlayer, 1.0);
        }
    }

    if (letterModal) letterModal.style.display = "none";
    if (envelopeCard) envelopeCard.classList.remove('open');
    if (envelopeStage) {
        envelopeStage.classList.remove('fade-away');
        envelopeStage.style.display = "flex";
    }
    if (letterBox) letterBox.style.display = "none";
}

if (letterBtn && letterModal && closeLetterBtn) {
    letterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut([15, 30, 20]);
        sedangMembacaSurat = true;

        // Siapkan booster audio sejak pengguna mengetuk tombol surat (penting untuk browser HP)
        siapkanBoosterSuara();

        const activePlayer = players[indeksLaguSekarang];
        if (activePlayer && !activePlayer.paused) {
            transisiVolumeHalus(activePlayer, getTargetVolumeAktif());
        }
        
        if (envelopeCard) envelopeCard.classList.remove('open');
        if (envelopeStage) {
            envelopeStage.classList.remove('fade-away');
            envelopeStage.style.display = "flex";
        }
        if (letterBox) letterBox.style.display = "none";
        
        letterModal.style.display = "flex";

        timerAmplop1 = setTimeout(() => {
            if (envelopeCard) envelopeCard.classList.add('open');
        }, 180);

        timerAmplop2 = setTimeout(() => {
            if (envelopeStage) envelopeStage.classList.add('fade-away');
            setTimeout(tampilkanLembaranSurat, 320);
        }, 1050);
    });

    if (envelopeCard) {
        envelopeCard.addEventListener('click', (e) => {
            e.stopPropagation();
            getarLembut(15);
            tampilkanLembaranSurat();
        });
    }

    if (letterBox && letterProgress) {
        letterBox.addEventListener('scroll', () => {
            const jarakScroll = letterBox.scrollTop;
            const totalScrollSurat = letterBox.scrollHeight - letterBox.clientHeight;
            if (totalScrollSurat > 0) {
                const persenBaca = (jarakScroll / totalScrollSurat) * 100;
                letterProgress.style.width = `${Math.min(100, Math.max(0, persenBaca))}%`;

                // Otomatis mulai fade-in suara kamu saat scroll mencapai paling bawah surat
                const diTabSuratSekarang = !panelNowLetter || panelNowLetter.style.display !== 'none';
                const sudahDiDasarSurat = jarakScroll >= totalScrollSurat - 25;

                if (
                    diTabSuratSekarang &&
                    sudahDiDasarSurat &&
                    !sudahAutoPlayVoiceNote &&
                    voicenoteSiap &&
                    voicenotePlayer &&
                    voicenotePlayer.paused
                ) {
                    sudahAutoPlayVoiceNote = true;
                    fadeInVoiceNote(1200);
                }
            }
        }, { passive: true });
    }

    closeLetterBtn.addEventListener('click', tutupModalSurat);

    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) tutupModalSurat();
    });
}

// ==========================================
// 6. JEJAK PERJALANAN KITA (INTERACTIVE MILESTONE STORY MODAL)
// ==========================================
const dataMilestone = {
    jatinegara: {
        ikon: "🚉",
        tanggal: "6 Mei 2026 • Pukul 01.00 WIB",
        judul: "Awal Cerita di Stasiun Jatinegara",
        cerita: "Malam itu kamu baru tiba dari mudik naik kereta dan sampai stasiun jam 1 dini hari. Karena khawatir kamu pulang sendirian tengah malam, aku nekat menawarkan diri untuk menjemput. Foto pertama di dinding memori ini adalah foto yang kamu kirim malam itu sebelum akhirnya aku mengantarmu sampai depan kost dengan aman."
    },
    kemang: {
        ikon: "☕",
        tanggal: "14 Mei 2026",
        judul: "Resmi Bersama di Kopi Nako Kemang",
        cerita: "Setelah obrolan yang semakin intens sejak malam penjemputan di stasiun, di tempat inilah aku memberanikan diri mengungkapkan perasaan dan mengajakmu melangkah bersama. Hari di mana cerita kita resmi dimulai."
    },
    jakarta: {
        ikon: "🏍️",
        tanggal: "Jakarta Night Ride",
        judul: "Keliling Sudirman, HI, Monas & Blok M",
        cerita: "Menyusuri lampu-lampu malam Jakarta berdua naik motor melewati Jenderal Sudirman, Bundaran HI, Monas, sampai mencari tempat nongkrong di Blok M. Obrolan sederhana di atas motor selalu jadi bagian paling menenangkan."
    },
    bandung: {
        ikon: "🌲",
        tanggal: "Trip Bandung",
        judul: "Gokart, Braga & Dresscode Hitam Golden Pine",
        cerita: "Perjalanan seru naik kereta bareng ke Bandung! Mulai dari makan Ayam Bu Imas, sewa motor keliling kota, adu cepat main gokart, bubur ayam DPR, cireng racing, sampai sesi foto box di Braga dan makan cantik di Golden Pine dengan dresscode serba hitam."
    }
};

const milestoneModal = document.getElementById('milestone-modal');
const closeMilestoneBtn = document.getElementById('close-milestone-btn');
const milestoneIcon = document.getElementById('milestone-icon');
const milestoneDate = document.getElementById('milestone-date');
const milestoneTitle = document.getElementById('milestone-title');
const milestoneStory = document.getElementById('milestone-story');

document.querySelectorAll('.milestone-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(16);
        const key = chip.dataset.milestone;
        const info = dataMilestone[key];
        if (!info || !milestoneModal) return;

        if (milestoneIcon) milestoneIcon.innerText = info.ikon;
        if (milestoneDate) milestoneDate.innerText = info.tanggal;
        if (milestoneTitle) milestoneTitle.innerText = info.judul;
        if (milestoneStory) milestoneStory.innerText = info.cerita;

        milestoneModal.style.display = "flex";
    });
});

if (closeMilestoneBtn && milestoneModal) {
    closeMilestoneBtn.addEventListener('click', () => {
        milestoneModal.style.display = "none";
    });
    milestoneModal.addEventListener('click', (e) => {
        if (e.target === milestoneModal) milestoneModal.style.display = "none";
    });
}

// ==========================================
// 7. MODE WAKTU BERSAMA & HITUNG MUNDUR (COUNTDOWN) + KEJUTAN LOVE COUNTER
// ==========================================
const counterElement = document.getElementById("love-counter");
const loveQuoteElement = document.getElementById("love-quote");
const modeTogetherBtn = document.getElementById("mode-together-btn");
const modeCountdownBtn = document.getElementById("mode-countdown-btn");
const countdownProgressWrap = document.getElementById("countdown-progress-wrap");
const countdownProgressFill = document.getElementById("countdown-progress-fill");
const countdownTargetLabel = document.getElementById("countdown-target-label");

let modeCounterSekarang = "together";

const daftarKutipanCinta = [
    "\"Setiap detik bersamamu selalu jadi waktu favoritku.\" ❤️",
    "\"Dari Stasiun Jatinegara sampai selamanya, terima kasih sudah memilihku.\" ✨",
    "\"Rumah terbaikku bukan tempat, tapi setiap kali ada kamu di sampingku.\" 🏡💖",
    "\"Semoga hitungan hari ini terus bertambah sampai menua bersama.\" 💍🌸",
    "\"Kamu adalah jawaban paling indah dari setiap doaku.\" 🤲❤️",
    "\"Bersamamu, hal-hal sederhana pun selalu terasa istimewa.\" 🥰✨"
];
let indeksKutipanSekarang = -1;

function cariMomenSpesialTerdekat(sekarang) {
    const tahun = sekarang.getFullYear();
    const bulan = sekarang.getMonth();

    let targetMensiv = new Date(tahun, bulan, 14, 9, 0, 0);
    if (sekarang >= targetMensiv) {
        targetMensiv = new Date(tahun, bulan + 1, 14, 9, 0, 0);
    }
    const bulanKe = (targetMensiv.getFullYear() - 2026) * 12 + (targetMensiv.getMonth() - 4);
    const mulaiMensiv = new Date(targetMensiv.getFullYear(), targetMensiv.getMonth() - 1, 14, 9, 0, 0);

    let targetUltah = new Date(tahun, 9, 17, 0, 0, 0);
    if (sekarang >= targetUltah) {
        targetUltah = new Date(tahun + 1, 9, 17, 0, 0, 0);
    }
    const mulaiUltah = new Date(targetUltah.getFullYear() - 1, 9, 17, 0, 0, 0);

    let targetAnniv = new Date(tahun, 4, 14, 9, 0, 0);
    if (sekarang >= targetAnniv) {
        targetAnniv = new Date(tahun + 1, 4, 14, 9, 0, 0);
    }
    const tahunKe = targetAnniv.getFullYear() - 2026;
    const mulaiAnniv = new Date(targetAnniv.getFullYear() - 1, 4, 14, 9, 0, 0);

    const kandidat = [
        {
            nama: `Mensiversary ke-${bulanKe} 💖`,
            tanggalTeks: targetMensiv.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            target: targetMensiv,
            mulai: mulaiMensiv
        },
        {
            nama: "Ulang Tahun Widia 🎂",
            tanggalTeks: targetUltah.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            target: targetUltah,
            mulai: mulaiUltah
        },
        {
            nama: `Anniversary ke-${tahunKe} Tahun 💍`,
            tanggalTeks: targetAnniv.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            target: targetAnniv,
            mulai: mulaiAnniv
        }
    ];

    kandidat.sort((a, b) => a.target - b.target);
    return kandidat[0];
}

function perbaruiTampilanWaktu() {
    const sekarang = new Date();
    if (!counterElement) return;

    if (modeCounterSekarang === "together") {
        const selisihWaktu = sekarang - tanggalJadian;
        const hari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

        counterElement.innerHTML = `Sudah ${hari} Hari, ${jam} Jam, ${menit} Menit, dan ${detik} Detik Kita Bersama ✨`;
    } else {
        const momen = cariMomenSpesialTerdekat(sekarang);
        const sisaMs = Math.max(0, momen.target - sekarang);

        const hari = Math.floor(sisaMs / (1000 * 60 * 60 * 24));
        const jam = Math.floor((sisaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((sisaMs % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((sisaMs % (1000 * 60)) / 1000);

        counterElement.innerHTML = `${hari} Hari, ${jam} Jam, ${menit} Menit, ${detik} Detik menuju ${momen.nama}`;

        const totalRentang = momen.target - momen.mulai;
        const sudahBerjalan = sekarang - momen.mulai;
        const persenProgres = totalRentang > 0 ? Math.min(100, Math.max(2, (sudahBerjalan / totalRentang) * 100)) : 0;

        if (countdownProgressFill) {
            countdownProgressFill.style.width = `${persenProgres.toFixed(1)}%`;
        }
        if (countdownTargetLabel) {
            countdownTargetLabel.innerText = `${momen.tanggalTeks} (${persenProgres.toFixed(0)}% tercapai)`;
        }
    }
}

setInterval(perbaruiTampilanWaktu, 1000);
perbaruiTampilanWaktu();

if (modeTogetherBtn && modeCountdownBtn) {
    modeTogetherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(12);
        modeCounterSekarang = "together";
        modeTogetherBtn.classList.add('active');
        modeCountdownBtn.classList.remove('active');
        if (countdownProgressWrap) countdownProgressWrap.classList.remove('visible');
        perbaruiTampilanWaktu();
    });

    modeCountdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut(12);
        modeCounterSekarang = "countdown";
        modeCountdownBtn.classList.add('active');
        modeTogetherBtn.classList.remove('active');
        if (countdownProgressWrap) countdownProgressWrap.classList.add('visible');
        perbaruiTampilanWaktu();
    });
}

if (counterElement && loveQuoteElement) {
    counterElement.addEventListener('click', (e) => {
        e.stopPropagation();
        getarLembut([18, 25, 22]);

        const rect = counterElement.getBoundingClientRect();
        const pusatX = e.clientX || (rect.left + rect.width / 2);
        const pusatY = e.clientY || (rect.top + rect.height / 2);
        const simbolBurst = ["❤️", "💖", "✨", "🌸", "🥰", "💕"];

        for (let i = 0; i < 12; i++) {
            const partikel = document.createElement("span");
            partikel.className = "counter-burst-heart";
            partikel.innerText = simbolBurst[i % simbolBurst.length];
            partikel.style.left = `${pusatX}px`;
            partikel.style.top = `${pusatY}px`;

            const sudut = (Math.PI * 2 * i) / 12 + (Math.random() * 0.3);
            const jarak = 55 + Math.random() * 55;
            partikel.style.setProperty('--tx', `${Math.cos(sudut) * jarak}px`);
            partikel.style.setProperty('--ty', `${Math.sin(sudut) * jarak - 20}px`);

            document.body.appendChild(partikel);
            setTimeout(() => partikel.remove(), 950);
        }

        indeksKutipanSekarang = (indeksKutipanSekarang + 1) % daftarKutipanCinta.length;
        loveQuoteElement.classList.remove('show');
        setTimeout(() => {
            loveQuoteElement.innerText = daftarKutipanCinta[indeksKutipanSekarang];
            loveQuoteElement.classList.add('show');
        }, 120);
    });
}

// ==========================================
// 8. HUJAN KELOPAK, DAUN MAPLE & PERCIKAN SENTUHAN (TAP SPARKLES)
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
// 9. HOVER TAB TITLE DYNAMIC TRICK
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
// 10. SCROLL PROGRESS BAR & TOMBOL KEMBALI KE ATAS
// ==========================================
const backToTopBtn = document.getElementById("back-to-top");
const scrollProgressBar = document.getElementById("scroll-progress");

window.addEventListener('scroll', () => {
    const scrollAtas = window.scrollY;
    const tinggiBisaDiScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollProgressBar && tinggiBisaDiScroll > 0) {
        const persentaseScroll = (scrollAtas / tinggiBisaDiScroll) * 100;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, persentaseScroll))}%`;
    }

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
        getarLembut(14);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 11. TOMBOL SAMBUTAN & SMART SCROLL-REVEAL (INTERSECTION OBSERVER)
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
        getarLembut([20, 35, 25]);
        sudahKlikMulai = true;
        welcomeOverlay.classList.add('fade-out');
        
        eksekusiPutar(indeksLaguSekarang);
        
        if (galeriSiap) {
            aktifkanScrollReveal();
        }
    });
}