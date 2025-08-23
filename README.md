# 🎮 Game Edukasi Anak - Educational Games App

Aplikasi game edukasi untuk anak-anak usia 6-12 tahun dengan 30 permainan interaktif yang mendidik dan menyenangkan.

## 🌟 Fitur Utama

### 30 Game Edukasi Lengkap

**Paket Pertama (15 Game):**
1. **🧮 Petualangan Matematika** - Belajar matematika dengan visual menarik
2. **🐱 Memory Hewan** - Game memori dengan kartu hewan
3. **📝 Tebak Ejaan** - Latihan mengeja kata dengan gambar
4. **🌈 Pola Warna** - Simon Says dengan pola warna
5. **🕐 Belajar Jam** - Membaca waktu analog dan digital
6. **🔺 Tebak Bentuk** - Pengenalan geometri dasar
7. **🇬🇧 Kosakata Inggris** - Belajar bahasa Inggris
8. **🔬 Sains Anak** - Pengetahuan sains dasar
9. **🍎 Hitung Buah** - Latihan berhitung visual
10. **🎵 Nada & Ritme** - Pengenalan musik dasar
11. **🌍 Negara & Bendera** - Geografi dan bendera
12. **🧩 Puzzle Gambar** - Sliding puzzle interaktif
13. **⌨️ Belajar Ketik** - Latihan mengetik untuk anak
14. **🎨 Campur Warna** - Teori warna dasar
15. **📚 Cerita Interaktif** - Choose-your-adventure stories

**Paket Kedua (15 Game Baru):**
16. **🏠 Tebak Rumah Adat** - Mengenal rumah adat Indonesia
17. **🦷 Kesehatan Gigi** - Belajar merawat gigi yang benar
18. **🌙 Fase Bulan** - Memahami siklus fase bulan
19. **🍯 Rantai Makanan** - Menyusun rantai makanan ekosistem
20. **🎭 Tebak Emosi** - Mengenali ekspresi dan perasaan
21. **🏔️ Peta Indonesia** - Jelajahi geografi Indonesia
22. **🌡️ Cuaca & Iklim** - Belajar tentang cuaca
23. **🚂 Transportasi Tempo Dulu** - Bandingkan transportasi
24. **🥗 Makanan 4 Sehat 5 Sempurna** - Nutrisi seimbang
25. **🎨 Menggambar Huruf** - Latihan menulis huruf
26. **⚖️ Timbangan Matematika** - Persamaan matematika
27. **🎪 Urutan Kejadian** - Logika sebab-akibat
28. **🏃♂️ Olahraga & Kesehatan** - Manfaat olahraga
29. **🔊 Tebak Suara** - Mengenali sumber suara
30. **🗓️ Hari & Tanggal** - Konsep waktu dan kalender

### 📱 Optimasi Mobile
- **Responsive Design** - Sempurna di semua ukuran layar
- **Touch-Friendly** - Tombol besar untuk anak-anak
- **PWA Ready** - Dapat diinstall seperti aplikasi native
- **Offline Support** - Beberapa game bisa dimainkan offline

### 🏆 Sistem Skor & Achievement
- **Tracking Skor** - Skor tersimpan di localStorage
- **Achievement System** - Pencapaian untuk motivasi
- **Progress Tracking** - Pantau kemajuan belajar
- **High Score** - Skor tertinggi per game

## 🚀 Teknologi

- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety untuk development
- **Tailwind CSS** - Utility-first CSS framework
- **PWA** - Progressive Web App capabilities
- **Responsive Design** - Mobile-first approach

## 📦 Instalasi

```bash
# Clone repository
git clone [repository-url]

# Masuk ke direktori
cd APP WEB EDUKASI ANAK-ANAK

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Start production server
npm start
```

## 🎯 Target Pengguna

- **Usia**: 6-12 tahun (anak sekolah dasar)
- **Platform**: Web browser (mobile & desktop)
- **Bahasa**: Indonesia dengan beberapa konten Inggris
- **Akses**: Tidak perlu registrasi atau login

## 🎨 Design System

### Warna
- **Primary**: Blue to Purple gradient
- **Secondary**: Colorful, child-friendly palette
- **Success**: Green tones
- **Warning**: Yellow to Orange
- **Error**: Red to Pink

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Large, readable fonts for children
- **Weight**: 400 (regular), 600 (semibold), 700 (bold)

### Animations
- **Feedback**: Success/error animations
- **Interactions**: Hover and click effects
- **Transitions**: Smooth page transitions
- **Celebrations**: Achievement animations

## 📚 Struktur Pembelajaran

### Matematika
- Operasi dasar (tambah, kurang, kali, bagi)
- Pengenalan angka 1-100
- Visualisasi dengan objek konkret

### Bahasa
- Ejaan kata bahasa Indonesia
- Kosakata bahasa Inggris dasar
- Cerita interaktif dengan moral

### Sains & Pengetahuan
- Pengetahuan alam dasar
- Geografi (negara dan bendera)
- Musik dan seni

### Keterampilan Kognitif
- Memori dan konsentrasi
- Pola dan logika
- Problem solving
- Koordinasi mata-tangan

## 🔧 Konfigurasi

### Environment Variables
```env
# Tidak ada environment variables yang diperlukan
# Semua konfigurasi ada di file config
```

### PWA Configuration
- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Icons**: 192x192 dan 512x512 pixels

## 📱 Mobile Optimization

### Performance
- **Core Web Vitals** optimized
- **Image optimization** dengan Next.js Image
- **Code splitting** per game
- **Lazy loading** untuk komponen besar

### UX/UI
- **Touch targets** minimum 44px
- **No horizontal scroll**
- **Large fonts** untuk readability
- **High contrast** untuk accessibility

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Lighthouse audit
npm run audit
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy ke Vercel
vercel --prod
```

### Manual Build
```bash
# Build static files
npm run build
npm run export

# Deploy folder 'out' ke hosting
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - Bebas digunakan untuk tujuan edukasi

## 🎓 Educational Value

### Learning Objectives
- **Numeracy**: Kemampuan berhitung dasar
- **Literacy**: Kemampuan baca tulis
- **Science**: Pengetahuan sains dasar
- **Geography**: Pengenalan negara dan budaya
- **Arts**: Kreativitas dan ekspresi
- **Technology**: Literasi digital dasar

### Pedagogical Approach
- **Learning by Playing** - Belajar melalui permainan
- **Visual Learning** - Pembelajaran visual dengan emoji dan gambar
- **Progressive Difficulty** - Tingkat kesulitan bertahap
- **Positive Reinforcement** - Feedback positif dan achievement
- **Self-Paced Learning** - Belajar sesuai kecepatan anak

## 📞 Support

Untuk pertanyaan atau masalah:
- **Issues**: Gunakan GitHub Issues
- **Documentation**: Lihat README dan komentar kode
- **Community**: Diskusi di GitHub Discussions

---

**Dibuat dengan ❤️ untuk pendidikan anak Indonesia**