import React, { useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  LogBox,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Lora_600SemiBold, Lora_700Bold } from '@expo-google-fonts/lora';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Feather, Ionicons } from '@expo/vector-icons';

if (LogBox && typeof LogBox.ignoreLogs === 'function') {
  LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
}

const LOGO_SAKTAH = require('./assets/logo-saktah.png');
const WHATSAPP_NUMBER = '6281802899219';

const COLORS = {
  cream: '#f4efdc',
  creamDark: '#e7dfc4',
  forest: '#344c38',
  moss: '#131b15',
  ivory: '#faf7ed',
  sage: '#e6eadc',
  sageDark: '#ccd6be',
  textPrimary: '#131b15',
  textBody: '#28382b',
  textMuted: '#536656',
  gold: '#c88d21',
  goldSoft: '#fbf1d4',
  goldBorder: '#dfc176',
  tape: '#dde3cf',
  dangerBg: '#f9e7e4',
  dangerText: '#9e382e',
  white: '#ffffff',
  overlay: 'rgba(19, 27, 21, 0.6)',
};

const BULAN_PENDEK = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const JENJANG_OPTIONS = ['TK', 'SD'];

const PROGRAM_OPTIONS = [
  'Calistung & Tematik',
  'Mengaji Iqra & Tahsin',
  'Adab & Doa Harian',
];

const PENGAJAR_OPTIONS = ['Kak Annisa', 'Kak Burhan'];

const BULAN_OPTIONS = [
  'November 2026',
  'Desember 2026',
  'Januari 2027',
  'Februari 2027',
  'Maret 2027',
];

const CAPAIAN_TAGS = [
  '#LancarMembaca',
  '#FokusBaik',
  '#HafalDoaBaru',
  '#BerhitungTeliti',
  '#AdabTerpuji',
];

const PREDIKAT_OPTIONS = [
  'Mulai Berkembang',
  'Berkembang Sesuai Harapan',
  'Sangat Baik',
];

const PEKAN_OPTIONS = ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'];

const SESI_TEMPLATES = {
  60: [
    {
      id: 'ice',
      judul: 'Ice Breaking & Doa',
      durasi: '10 Menit',
      deskripsi: 'Sapaan hangat, senam jari ceria, dan doa sebelum belajar.',
    },
    {
      id: 'inti',
      judul: 'Inti Calistung / Tematik',
      durasi: '30 Menit',
      deskripsi: 'Materi utama membaca, menulis, berhitung, atau mengaji Iqra.',
    },
    {
      id: 'jeda',
      judul: 'Jeda Cerita',
      durasi: '10 Menit',
      deskripsi: 'Kisah adab ringan, minum air, dan peregangan tubuh sejenak.',
    },
    {
      id: 'eval',
      judul: 'Evaluasi Bintang',
      durasi: '10 Menit',
      deskripsi: 'Apresiasi bintang, penguatan 1 hal baru, dan doa penutup.',
    },
  ],
  90: [
    {
      id: 'ice',
      judul: 'Ice Breaking & Doa',
      durasi: '15 Menit',
      deskripsi: 'Koneksi hati anak, murojaah ringan, dan doa sebelum belajar.',
    },
    {
      id: 'inti',
      judul: 'Inti Calistung / Tematik',
      durasi: '45 Menit',
      deskripsi: 'Pendampingan terpadu Calistung, Iqra/Tahsin, & tugas sekolah.',
    },
    {
      id: 'jeda',
      judul: 'Jeda Cerita',
      durasi: '15 Menit',
      deskripsi: 'Membuka Kartu Lipat Doa & Adab serta istirahat santai.',
    },
    {
      id: 'eval',
      judul: 'Evaluasi Bintang',
      durasi: '15 Menit',
      deskripsi: 'Kuis Bintang Ceria, cap stempel hadir, dan catatan orang tua.',
    },
  ],
};

function createInitialKurikulum() {
  return [
    {
      id: 'bulan-1',
      kode: 'Bulan 1',
      judul: 'Bulan 1 — Fondasi Huruf, Angka & Adab Dasar',
      targetCapaian:
        'Ananda mengenal huruf vokal & konsonan awal dengan gembira, membilang benda 1–10 secara konkret, serta terbiasa membaca doa sebelum belajar.',
      predikat: 'Berkembang Sesuai Harapan',
      catatanBulanan:
        'Ananda antusias saat bermain kartu huruf dan mulai terbiasa duduk tenang sebelum memulai sesi.',
      materiList: [
        {
          id: 'b1-m1',
          pekan: 'Pekan 1',
          judul: 'Huruf Vokal A-I-U-E-O & Doa Belajar',
          deskripsi:
            'Media kartu lipat bergambar, menebalkan garis lengkung, serta pembiasaan doa sebelum belajar.',
          sudahDiajarkan: true,
        },
        {
          id: 'b1-m2',
          pekan: 'Pekan 2',
          judul: 'Membilang Benda 1–10 & Huruf Hijaiyah Awal',
          deskripsi:
            'Menghitung kancing kayu warna-warni dan melafalkan huruf Alif hingga Tsa dengan jelas.',
          sudahDiajarkan: true,
        },
        {
          id: 'b1-m3',
          pekan: 'Pekan 3',
          judul: 'Konsonan Awal (B, C, D, K, M) & Adab Menyimak',
          deskripsi:
            'Permainan tebak benda sekitar rumah dan praktik mendengarkan pengajar hingga selesai.',
          sudahDiajarkan: true,
        },
        {
          id: 'b1-m4',
          pekan: 'Pekan 4',
          judul: 'Evaluasi Ceria Bulan 1 & Merapikan Meja',
          deskripsi:
            'Mengulang huruf vokal, angka 1–10, dan pembiasaan merapikan alat tulis seusai les.',
          sudahDiajarkan: false,
        },
      ],
    },
    {
      id: 'bulan-2',
      kode: 'Bulan 2',
      judul: 'Bulan 2 — Suku Kata, Berhitung Benda & Doa Harian',
      targetCapaian:
        'Ananda mampu membaca suku kata terbuka (ba-bi-bu-be-bo), berhitung penjumlahan benda 1–20, serta hafal doa sebelum makan dan untuk orang tua.',
      predikat: 'Berkembang Sesuai Harapan',
      catatanBulanan:
        'Mulai percaya diri menyambung dua suku kata sederhana dan rajin mengucapkan kata tolong serta terima kasih.',
      materiList: [
        {
          id: 'b2-m1',
          pekan: 'Pekan 1',
          judul: 'Suku Kata Terbuka (ba-bi-bu, ca-ci-cu)',
          deskripsi:
            'Kartu pasang suku kata dan menyusun kata dua suku seperti buku, baju, dan bola.',
          sudahDiajarkan: true,
        },
        {
          id: 'b2-m2',
          pekan: 'Pekan 2',
          judul: 'Penjumlahan Konkret 1–20 & Doa Sebelum Makan',
          deskripsi:
            'Menggabungkan dua kelompok stik es krim serta praktik cuci tangan dan makan dengan tangan kanan.',
          sudahDiajarkan: true,
        },
        {
          id: 'b2-m3',
          pekan: 'Pekan 3',
          judul: 'Iqra Jilid 1–2 & Pengurangan Ringan',
          deskripsi:
            'Membedakan harakat fathah dan kasrah serta latihan mengambil benda dari kelompok angka.',
          sudahDiajarkan: false,
        },
        {
          id: 'b2-m4',
          pekan: 'Pekan 4',
          judul: '3 Kata Ajaib & Doa Kedua Orang Tua',
          deskripsi:
            'Bermain peran menggunakan Tolong, Maaf, Terima Kasih serta murojaah doa harian.',
          sudahDiajarkan: false,
        },
      ],
    },
    {
      id: 'bulan-3',
      kode: 'Bulan 3',
      judul: 'Bulan 3 — Membaca Lancar, Penjumlahan & Hafalan Surat Pendek',
      targetCapaian:
        'Ananda lancar membaca kalimat sederhana 3–4 kata, menyelesaikan soal cerita penjumlahan, serta menghafal surat pendek pilihan dengan tartil.',
      predikat: 'Mulai Berkembang',
      catatanBulanan:
        'Fokus pada kelancaran tempo membaca tanpa tergesa dan menjaga konsistensi panjang-pendek bacaan Iqra.',
      materiList: [
        {
          id: 'b3-m1',
          pekan: 'Pekan 1',
          judul: 'Kalimat Sederhana & Kata Berakhiran (ng, ny)',
          deskripsi:
            'Membaca kartu cerita bergambar 2 baris dengan intonasi tenang dan jeda titik.',
          sudahDiajarkan: true,
        },
        {
          id: 'b3-m2',
          pekan: 'Pekan 2',
          judul: 'Penjumlahan & Pengurangan Dua Langkah',
          deskripsi:
            'Soal cerita kehidupan sehari-hari menggunakan ilustrasi buah dan alat tulis.',
          sudahDiajarkan: false,
        },
        {
          id: 'b3-m3',
          pekan: 'Pekan 3',
          judul: 'Hafalan Surat Al-Ikhlas & Al-Falaq',
          deskripsi:
            'Menyimak ayat per ayat dengan talaqqi lembut dan memperhatikan makhraj huruf.',
          sudahDiajarkan: false,
        },
        {
          id: 'b3-m4',
          pekan: 'Pekan 4',
          judul: 'Proyek Mini Buku Cerita & Evaluasi Bintang',
          deskripsi:
            'Ananda menyalin 3 kalimat pendek karyanya sendiri dan merayakan capaian bersama orang tua.',
          sudahDiajarkan: false,
        },
      ],
    },
  ];
}

const DOA_ADAB_CARDS = [
  {
    id: 'doa-belajar',
    kategori: 'Doa Harian',
    ikon: 'book-outline',
    judul: 'Doa Sebelum Belajar',
    teaser: 'Memohon ilmu yang bermanfaat dan hati yang lapang.',
    lafazLatin: 'Rabbi zidnii ‘ilmaa, warzuqnii fahmaa.',
    artiLembut:
      'Ya Allah, tambahkanlah ilmu kepadaku dan karuniakanlah aku pemahaman yang baik.',
    tantangan:
      'Duduk tenang, rapikan pensil dan buku di meja, lalu baca doa ini dengan suara lembut sebelum mulai belajar.',
  },
  {
    id: 'doa-makan',
    kategori: 'Doa Harian',
    ikon: 'restaurant-outline',
    judul: 'Doa Sebelum Makan',
    teaser: 'Mensyukuri nikmat rezeki sebelum menyantap hidangan.',
    lafazLatin:
      'Allaahumma baarik lanaa fiimaa razaqtanaa wa qinaa ‘adzaaban-naar.',
    artiLembut:
      'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan jagalah kami dari keburukan.',
    tantangan:
      'Cuci tangan pakai sabun, duduk rapi di kursi, baca Bismillah dan doa ini, lalu makan memakai tangan kanan.',
  },
  {
    id: 'doa-ortu',
    kategori: 'Doa Harian',
    ikon: 'heart-outline',
    judul: 'Doa untuk Ayah & Bunda',
    teaser: 'Mendoakan kedua orang tua sebagai wujud bakti anak.',
    lafazLatin:
      'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    artiLembut:
      'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, serta sayangilah mereka sebagaimana mereka menyayangiku sejak kecil.',
    tantangan:
      'Ucapkan terima kasih kepada Ayah atau Bunda hari ini setelah ditemani belajar atau disiapkan bekal.',
  },
  {
    id: 'adab-bicara',
    kategori: 'Adab Anak',
    ikon: 'chatbubble-ellipses-outline',
    judul: 'Adab Berkata Lembut',
    teaser: 'Menjaga lisan dengan tiga kata ajaib penuh kebaikan.',
    lafazLatin: '“Tolong, Maaf, dan Terima Kasih” dengan nada suara yang ramah.',
    artiLembut:
      'Ucapan yang lembut dan jujur membuat hati orang tua, guru, dan teman merasa tenang serta dihargai.',
    tantangan:
      'Gunakan minimal dua kali kata “Tolong” atau “Terima kasih” selama sesi les berlangsung hari ini.',
  },
  {
    id: 'adab-mendengar',
    kategori: 'Adab Anak',
    ikon: 'ear-outline',
    judul: 'Adab Menyimak dengan Tenang',
    teaser: 'Menghormati guru dan teman yang sedang berbicara.',
    lafazLatin:
      'Menatap wajah pembicara dengan ramah dan menunggu giliran bicara.',
    artiLembut:
      'Anak yang menyimak dengan tenang akan lebih mudah memahami pelajaran dan disayang oleh pengajar.',
    tantangan:
      'Saat Kakak Pengajar menjelaskan bacaan baru, letakkan mainan sejenak dan angkat tangan bila ingin bertanya.',
  },
  {
    id: 'adab-rapi',
    kategori: 'Adab Anak',
    ikon: 'sparkles-outline',
    judul: 'Adab Menjaga Kerapian Meja',
    teaser: 'Merapikan kembali alat belajar setelah selesai sesi.',
    lafazLatin: 'Kebersihan dan kerapian adalah bagian dari iman.',
    artiLembut:
      'Meja yang rapi menenangkan pikiran dan melatih kemandirian anak sejak dini.',
    tantangan:
      'Masukkan kembali buku Iqra, pensil warna, dan penghapus ke dalam tas setelah evaluasi bintang selesai.',
  },
];

const KUIS_SOAL_10 = [
  {
    id: 1,
    level: 'Calistung • Berhitung',
    pertanyaan:
      'Di keranjang ada 3 apel merah dan 2 apel hijau. Berapa jumlah seluruh apel di keranjang?',
    pilihan: ['4 apel', '5 apel', '6 apel', '7 apel'],
    jawabanBenar: 1,
    penjelasan: '3 apel merah + 2 apel hijau = 5 apel.',
  },
  {
    id: 2,
    level: 'Calistung • Suku Kata',
    pertanyaan:
      'Susunan suku kata “bu - ku” jika dibaca bersambung menjadi kata...',
    pilihan: ['baku', 'kuku', 'buku', 'batu'],
    jawabanBenar: 2,
    penjelasan: 'Suku kata “bu” ditambah “ku” dibaca “buku”.',
  },
  {
    id: 3,
    level: 'Doa Harian',
    pertanyaan:
      'Sebelum memulai belajar bersama Kakak Pengajar, kita membaca doa...',
    pilihan: [
      'Rabbi zidnii ‘ilmaa, warzuqnii fahmaa',
      'Bismika Allahumma ahyaa wa bismika amuut',
      'Alhamdulillaahilladzii ath-amanaa',
      'Subhaanakallaahumma rabbanaa',
    ],
    jawabanBenar: 0,
    penjelasan:
      '“Rabbi zidnii ‘ilmaa, warzuqnii fahmaa” adalah doa memohon tambahan ilmu dan pemahaman.',
  },
  {
    id: 4,
    level: 'Adab Anak',
    pertanyaan:
      'Ketika ingin meminjam penghapus milik teman atau Kakak Pengajar, ucapan yang paling santun adalah...',
    pilihan: [
      'Ambil saja langsung tanpa bilang',
      'Tolong, bolehkah aku pinjam penghapus sebentar?',
      'Cepat berikan penghapusmu ke aku!',
      'Diam sambil menarik penghapusnya',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Mengucapkan “Tolong” dengan nada ramah menunjukkan adab menghargai orang lain.',
  },
  {
    id: 5,
    level: 'Calistung • Pengurangan',
    pertanyaan:
      'Zaid memiliki 8 kelereng. Sebanyak 3 kelereng diberikan kepada adiknya. Sisa kelereng Zaid adalah...',
    pilihan: ['4 kelereng', '5 kelereng', '6 kelereng', '7 kelereng'],
    jawabanBenar: 1,
    penjelasan: '8 kelereng dikurangi 3 kelereng = 5 kelereng.',
  },
  {
    id: 6,
    level: 'Mengenal Huruf',
    pertanyaan:
      'Kata berikut yang diawali huruf “S” dan berarti jeda belajar yang tenang adalah...',
    pilihan: ['Rumah', 'Saktah', 'Taman', 'Pasar'],
    jawabanBenar: 1,
    penjelasan: '“Saktah” diawali huruf S dan berarti jeda tenang.',
  },
  {
    id: 7,
    level: 'Adab Makan',
    pertanyaan:
      'Manakah urutan adab makan yang paling tepat untuk dipraktikkan setiap hari?',
    pilihan: [
      'Langsung makan sambil berdiri dengan tangan kiri',
      'Cuci tangan, duduk rapi, berdoa, lalu makan dengan tangan kanan',
      'Berlari sambil memegang roti tanpa mencuci tangan',
      'Makan tergesa-gesa sambil berbicara keras',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Mencuci tangan, duduk tenang, berdoa, dan menggunakan tangan kanan adalah adab makan terbaik.',
  },
  {
    id: 8,
    level: 'Calistung • Cerita',
    pertanyaan:
      'Setiap hari Senin dan Rabu, Aisyah membaca 6 halaman Iqra. Berapa total halaman yang dibaca dalam 2 hari itu?',
    pilihan: ['10 halaman', '11 halaman', '12 halaman', '14 halaman'],
    jawabanBenar: 2,
    penjelasan: '6 halaman + 6 halaman = 12 halaman.',
  },
  {
    id: 9,
    level: 'Doa & Makna',
    pertanyaan:
      'Potongan doa “Rabbighfir lii wa liwaalidayya” mengajarkan kita untuk senantiasa...',
    pilihan: [
      'Meminta mainan baru setiap hari',
      'Mendoakan ampunan dan kebaikan untuk kedua orang tua',
      'Berangkat tidur lebih larut',
      'Menunda merapikan buku belajar',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Doa untuk kedua orang tua adalah bukti cinta dan bakti anak kepada Ayah dan Bunda.',
  },
  {
    id: 10,
    level: 'Adab & Kemandirian',
    pertanyaan:
      'Setelah selesai sesi les, meja belajar berantakan oleh pensil warna dan kertas. Sikap anak shalih adalah...',
    pilihan: [
      'Meninggalkannya agar dirapikan orang lain',
      'Menyembunyikan pensil di bawah meja',
      'Merapikan kembali pensil dan buku ke tempatnya dengan gembira',
      'Menyalahkan adik atas meja yang berantakan',
    ],
    jawabanBenar: 2,
    penjelasan:
      'Merapikan alat belajar sendiri melatih kemandirian, kerapian, dan tanggung jawab.',
  },
];

function formatTanggalHariIni() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = BULAN_PENDEK[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

function createInitialPertemuan(prefill = []) {
  return Array.from({ length: 12 }, (_, index) => {
    const nomor = index + 1;
    const found = prefill.find((item) => item.nomor === nomor);
    return {
      nomor,
      hadir: found ? Boolean(found.hadir) : false,
      tanggal: found && found.tanggal ? found.tanggal : '',
      catatan: found && found.catatan ? found.catatan : '',
    };
  });
}

function createInitialStudents() {
  return [
    {
      id: 'murid-1',
      nama: 'Aisyah Humaira',
      jenjang: 'TK',
      program: 'Mengaji Iqra & Tahsin',
      pengajar: 'Kak Annisa',
      bulan: 'November 2026',
      pertemuan: createInitialPertemuan([
        {
          nomor: 1,
          hadir: true,
          tanggal: '04 Nov 2026',
          catatan:
            'Iqra 2 hal. 10-12. Semangat membedakan huruf berharakat fathah. #FokusBaik',
        },
        {
          nomor: 2,
          hadir: true,
          tanggal: '11 Nov 2026',
          catatan:
            'Iqra 2 hal. 13-15. Panjang pendek mad thabi’i mulai stabil. #HafalDoaBaru',
        },
        {
          nomor: 3,
          hadir: true,
          tanggal: '18 Nov 2026',
          catatan:
            'Latihan huruf sambung serta praktik doa sebelum belajar dengan tenang. #AdabTerpuji',
        },
      ]),
    },
    {
      id: 'murid-2',
      nama: 'Muhammad Zaid',
      jenjang: 'SD',
      program: 'Calistung & Tematik',
      pengajar: 'Kak Burhan',
      bulan: 'November 2026',
      pertemuan: createInitialPertemuan([
        {
          nomor: 1,
          hadir: true,
          tanggal: '05 Nov 2026',
          catatan:
            'Membaca suku kata terbuka dan menulis 5 kalimat pendek dengan rapi. #LancarMembaca',
        },
        {
          nomor: 2,
          hadir: true,
          tanggal: '12 Nov 2026',
          catatan:
            'Berhitung penjumlahan & pengurangan benda 1-20 dengan teliti. #BerhitungTeliti #FokusBaik',
        },
      ]),
    },
  ];
}

function countHadir(student) {
  return student.pertemuan.filter((item) => item.hadir).length;
}

function getMonthProgress(month) {
  const total = month.materiList.length;
  const done = month.materiList.filter((m) => m.sudahDiajarkan).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
}

function buildWhatsAppAttendanceReport(student) {
  const nama = student.nama.trim() || '(Belum diisi)';
  const jenjang = student.jenjang || 'TK';
  const program = student.program.trim() || '(Belum dipilih)';
  const pengajar = student.pengajar.trim() || '(Belum diisi)';
  const bulan = student.bulan.trim() || '(Belum diisi)';
  const totalHadir = countHadir(student);

  const recordedMeetings = student.pertemuan.filter(
    (p) => p.hadir || p.catatan.trim().length > 0
  );
  const latestMeeting =
    recordedMeetings.length > 0
      ? recordedMeetings[recordedMeetings.length - 1]
      : null;

  const lines = [
    '*SAKTAH TARBIYAH — KARTU ABSEN & PERKEMBANGAN*',
    '----------------------------------------',
    `Nama Murid : ${nama} (${jenjang})`,
    `Program    : ${program}`,
    `Pengajar   : ${pengajar}`,
    `Bulan      : ${bulan}`,
    `Kehadiran  : ${totalHadir} / 12 Pertemuan Tercapai`,
    '',
  ];

  if (latestMeeting) {
    lines.push('*Sorotan Pertemuan Terbaru:*');
    const dateInfo = latestMeeting.tanggal ? ` (${latestMeeting.tanggal})` : '';
    const statusText = latestMeeting.hadir ? 'Hadir' : 'Catatan Tersimpan';
    lines.push(`Pertemuan ke-${latestMeeting.nomor}${dateInfo} • ${statusText}`);
    lines.push(
      latestMeeting.catatan.trim() ||
      'Ananda mengikuti sesi belajar dengan tenang dan antusias.'
    );
    lines.push('');
  }

  lines.push('*Rekap Pertemuan (1–12):*');
  if (recordedMeetings.length === 0) {
    lines.push('Belum ada pertemuan yang dicap hadir atau dicatat.');
  } else {
    recordedMeetings.forEach((item) => {
      const cap = item.hadir
        ? `Hadir (${item.tanggal || 'Tercatat'})`
        : 'Belum Hadir';
      const note = item.catatan.trim() ? ` — ${item.catatan.trim()}` : '';
      lines.push(`• Pertemuan ${item.nomor}: ${cap}${note}`);
    });
  }

  lines.push('');
  lines.push(
    'Terima kasih atas pendampingan Ayah & Bunda di rumah. Wassalamu’alaikum warahmatullahi wabarakatuh.'
  );

  return lines.join('\n');
}

function buildWhatsAppMonthlyReport(month, student) {
  const { total, done, percent } = getMonthProgress(month);
  const namaMurid = student.nama.trim() || 'Ananda';
  const lines = [
    '*SAKTAH TARBIYAH — RAPOR KURIKULUM BULANAN*',
    '----------------------------------------',
    `Murid      : ${namaMurid} (${student.jenjang})`,
    `Pengajar   : ${student.pengajar || 'Tim Saktah Tarbiyah'}`,
    `Program    : ${month.judul}`,
    `Capaian    : ${done} / ${total} Materi Sudah Diajarkan (${percent}%)`,
    `Predikat   : ${month.predikat}`,
    '',
    '*Target Capaian Bulan Ini:*',
    month.targetCapaian.trim() || '-',
    '',
    '*Materi & Aktivitas:*',
  ];

  month.materiList.forEach((m) => {
    const mark = m.sudahDiajarkan ? '[Sudah]' : '[Proses]';
    lines.push(`• ${m.pekan} ${mark} ${m.judul}`);
  });

  if (month.catatanBulanan.trim()) {
    lines.push('');
    lines.push('*Catatan Capaian Anak:*');
    lines.push(month.catatanBulanan.trim());
  }

  lines.push('');
  lines.push(
    'Semoga Allah mudahkan langkah belajar ananda di bulan berikutnya. Wassalamu’alaikum.'
  );

  return lines.join('\n');
}

function PaperCard({
  children,
  variant = 'ivory',
  style,
  layerColor = COLORS.sageDark,
  showTape = false,
}) {
  const cardBg =
    variant === 'sage'
      ? COLORS.sage
      : variant === 'forest'
        ? COLORS.forest
        : COLORS.ivory;

  return (
    <View style={styles.paperWrap}>
      <View style={[styles.paperBackLayer, { backgroundColor: layerColor }]} />
      <View style={[styles.paperFrontCard, { backgroundColor: cardBg }, style]}>
        {showTape && <View style={styles.washiTape} />}
        {children}
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Lora_600SemiBold,
    Lora_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const fonts = useMemo(() => {
    const serifFallback = Platform.OS === 'ios' ? 'Georgia' : 'serif';
    return {
      loraSemi: fontsLoaded
        ? { fontFamily: 'Lora_600SemiBold' }
        : { fontFamily: serifFallback, fontWeight: '600' },
      loraBold: fontsLoaded
        ? { fontFamily: 'Lora_700Bold' }
        : { fontFamily: serifFallback, fontWeight: '700' },
      sansRegular: fontsLoaded
        ? { fontFamily: 'PlusJakartaSans_400Regular' }
        : { fontWeight: '400' },
      sansSemi: fontsLoaded
        ? { fontFamily: 'PlusJakartaSans_600SemiBold' }
        : { fontWeight: '600' },
      sansBold: fontsLoaded
        ? { fontFamily: 'PlusJakartaSans_700Bold' }
        : { fontWeight: '700' },
    };
  }, [fontsLoaded]);

  const scrollViewRef = useRef(null);

  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'kurikulum' | 'absen' | 'play'
  const [showTentang, setShowTentang] = useState(false);

  // Beranda: Alur Sesi Mengajar Hari Ini
  const [sessionDuration, setSessionDuration] = useState(60); // 60 | 90
  const [checkedStages, setCheckedStages] = useState({
    ice: true,
    inti: false,
    jeda: false,
    eval: false,
  });

  // Kurikulum: Drill-down per bulan
  const [kurikulumList, setKurikulumList] = useState(createInitialKurikulum);
  const [selectedMonthId, setSelectedMonthId] = useState(null); // null = Level 1, id = Level 2
  const [addMonthModalVisible, setAddMonthModalVisible] = useState(false);
  const [newMonthTitle, setNewMonthTitle] = useState('');
  const [newMonthTarget, setNewMonthTarget] = useState('');
  const [newMonthError, setNewMonthError] = useState('');

  const [addMateriModalVisible, setAddMateriModalVisible] = useState(false);
  const [newMateriPekan, setNewMateriPekan] = useState(PEKAN_OPTIONS[0]);
  const [newMateriTitle, setNewMateriTitle] = useState('');
  const [newMateriDesc, setNewMateriDesc] = useState('');
  const [newMateriError, setNewMateriError] = useState('');

  // Kartu Absen: Multi-Murid
  const [students, setStudents] = useState(createInitialStudents);
  const [activeStudentId, setActiveStudentId] = useState('murid-1');
  const [profileFormOpen, setProfileFormOpen] = useState(true);

  const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentJenjang, setNewStudentJenjang] = useState('TK');
  const [newStudentProgram, setNewStudentProgram] = useState(
    PROGRAM_OPTIONS[0]
  );
  const [newStudentPengajar, setNewStudentPengajar] = useState(
    PENGAJAR_OPTIONS[0]
  );
  const [newStudentBulan, setNewStudentBulan] = useState(BULAN_OPTIONS[0]);
  const [newStudentError, setNewStudentError] = useState('');

  // Modals Preview & Alerts
  const [waPreviewModal, setWaPreviewModal] = useState({
    visible: false,
    title: '',
    text: '',
  });
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [infoModal, setInfoModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Saktah Play
  const [playMode, setPlayMode] = useState('lipat'); // 'lipat' | 'kuis'
  const [doaFilter, setDoaFilter] = useState('Semua');
  const [openDoaIds, setOpenDoaIds] = useState({ 'doa-belajar': true });
  const [doneChallenges, setDoneChallenges] = useState({});

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const starPulse = useRef(new Animated.Value(1)).current;
  const certScale = useRef(new Animated.Value(1)).current;

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0];

  const selectedMonth = selectedMonthId
    ? kurikulumList.find((m) => m.id === selectedMonthId) || null
    : null;

  const androidTopInset =
    Platform.OS === 'android' ? RNStatusBar.currentHeight || 28 : 0;

  const scrollToTop = () => {
    if (scrollViewRef.current && typeof scrollViewRef.current.scrollTo === 'function') {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const navigateTab = (tabKey) => {
    setShowTentang(false);
    setActiveTab(tabKey);
    scrollToTop();
  };

  const triggerStarAnimation = () => {
    starPulse.setValue(0.75);
    Animated.spring(starPulse, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const triggerCertificateAnimation = () => {
    certScale.setValue(0.88);
    Animated.spring(certScale, {
      toValue: 1,
      friction: 5,
      tension: 110,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  /* Beranda handlers */
  const toggleStageChecked = (stageId) => {
    setCheckedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const resetSessionStages = () => {
    setCheckedStages({
      ice: false,
      inti: false,
      jeda: false,
      eval: false,
    });
  };

  /* Kurikulum handlers */
  const handleOpenMonthDetail = (monthId) => {
    setSelectedMonthId(monthId);
    scrollToTop();
  };

  const handleBackToMonths = () => {
    setSelectedMonthId(null);
    scrollToTop();
  };

  const updateSelectedMonthField = (field, value) => {
    if (!selectedMonth) return;
    setKurikulumList((prev) =>
      prev.map((m) => (m.id === selectedMonth.id ? { ...m, [field]: value } : m))
    );
  };

  const toggleMateriDone = (materiId) => {
    if (!selectedMonth) return;
    setKurikulumList((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMonth.id) return m;
        return {
          ...m,
          materiList: m.materiList.map((mat) =>
            mat.id === materiId
              ? { ...mat, sudahDiajarkan: !mat.sudahDiajarkan }
              : mat
          ),
        };
      })
    );
  };

  const handleOpenAddMonth = () => {
    const nextNumber = kurikulumList.length + 1;
    setNewMonthTitle(`Bulan ${nextNumber} — `);
    setNewMonthTarget('');
    setNewMonthError('');
    setAddMonthModalVisible(true);
  };

  const handleSaveNewMonth = () => {
    const cleanTitle = newMonthTitle.trim();
    if (!cleanTitle) {
      setNewMonthError('Silakan tulis judul atau tema bulan terlebih dahulu.');
      return;
    }
    const nextNumber = kurikulumList.length + 1;
    const newId = `bulan-${Date.now()}`;
    const newMonth = {
      id: newId,
      kode: `Bulan ${nextNumber}`,
      judul: cleanTitle,
      targetCapaian:
        newMonthTarget.trim() ||
        'Ananda bertumbuh sesuai tempo belajar yang tenang, memahami materi inti, dan mempraktikkan adab harian.',
      predikat: 'Mulai Berkembang',
      catatanBulanan: '',
      materiList: [
        {
          id: `${newId}-m1`,
          pekan: 'Pekan 1',
          judul: 'Pengenalan Tema & Pemanasan Materi',
          deskripsi:
            'Aktivitas awal menggunakan kartu visual dan permainan interaktif ramah anak.',
          sudahDiajarkan: false,
        },
        {
          id: `${newId}-m2`,
          pekan: 'Pekan 2',
          judul: 'Latihan Terarah & Murojaah Adab',
          deskripsi:
            'Pendampingan bertahap sesuai kemampuan ananda serta praktik doa harian.',
          sudahDiajarkan: false,
        },
      ],
    };
    setKurikulumList((prev) => [...prev, newMonth]);
    setAddMonthModalVisible(false);
    setSelectedMonthId(newId);
    scrollToTop();
  };

  const handleOpenAddMateri = () => {
    setNewMateriPekan(PEKAN_OPTIONS[0]);
    setNewMateriTitle('');
    setNewMateriDesc('');
    setNewMateriError('');
    setAddMateriModalVisible(true);
  };

  const handleSaveNewMateri = () => {
    if (!selectedMonth) return;
    if (!newMateriTitle.trim()) {
      setNewMateriError('Mohon isi judul materi terlebih dahulu.');
      return;
    }
    const newItem = {
      id: `mat-${Date.now()}`,
      pekan: newMateriPekan.trim() || 'Pekan 1',
      judul: newMateriTitle.trim(),
      deskripsi:
        newMateriDesc.trim() ||
        'Pendampingan langsung dengan media kartu belajar dan latihan bertahap.',
      sudahDiajarkan: false,
    };
    setKurikulumList((prev) =>
      prev.map((m) =>
        m.id === selectedMonth.id
          ? { ...m, materiList: [...m.materiList, newItem] }
          : m
      )
    );
    setAddMateriModalVisible(false);
  };

  /* Kartu Absen handlers */
  const updateStudentField = (field, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === activeStudent.id ? { ...s, [field]: value } : s))
    );
  };

  const toggleMeetingStamp = (nomor) => {
    const today = formatTanggalHariIni();
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== activeStudent.id) return student;
        return {
          ...student,
          pertemuan: student.pertemuan.map((item) => {
            if (item.nomor !== nomor) return item;
            const nextHadir = !item.hadir;
            return {
              ...item,
              hadir: nextHadir,
              tanggal: nextHadir ? today : '',
            };
          }),
        };
      })
    );
  };

  const updateMeetingNote = (nomor, text) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== activeStudent.id) return student;
        return {
          ...student,
          pertemuan: student.pertemuan.map((item) =>
            item.nomor === nomor ? { ...item, catatan: text } : item
          ),
        };
      })
    );
  };

  const toggleMeetingTag = (nomor, tag) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== activeStudent.id) return student;
        return {
          ...student,
          pertemuan: student.pertemuan.map((item) => {
            if (item.nomor !== nomor) return item;
            const current = item.catatan;
            if (current.includes(tag)) {
              const cleaned = current
                .replace(tag, '')
                .replace(/\s{2,}/g, ' ')
                .trim();
              return { ...item, catatan: cleaned };
            }
            const next = current.trim() ? `${current.trim()} ${tag}` : tag;
            return { ...item, catatan: next };
          }),
        };
      })
    );
  };

  const handleOpenAddStudent = () => {
    setNewStudentName('');
    setNewStudentJenjang('TK');
    setNewStudentProgram(PROGRAM_OPTIONS[0]);
    setNewStudentPengajar(PENGAJAR_OPTIONS[0]);
    setNewStudentBulan(BULAN_OPTIONS[0]);
    setNewStudentError('');
    setAddStudentModalVisible(true);
  };

  const handleCreateStudent = () => {
    if (!newStudentName.trim()) {
      setNewStudentError('Mohon isi nama murid terlebih dahulu.');
      return;
    }
    const id = `murid-${Date.now()}`;
    const created = {
      id,
      nama: newStudentName.trim(),
      jenjang: newStudentJenjang,
      program: newStudentProgram.trim() || PROGRAM_OPTIONS[0],
      pengajar: newStudentPengajar.trim() || PENGAJAR_OPTIONS[0],
      bulan: newStudentBulan.trim() || BULAN_OPTIONS[0],
      pertemuan: createInitialPertemuan(),
    };
    setStudents((prev) => [...prev, created]);
    setActiveStudentId(id);
    setAddStudentModalVisible(false);
  };

  const handleDeleteStudent = () => {
    if (students.length <= 1) {
      setDeleteConfirmVisible(false);
      setInfoModal({
        visible: true,
        title: 'Minimal Satu Profil',
        message:
          'Sisakan minimal 1 profil murid aktif. Anda bisa mengubah datanya langsung pada formulir profil.',
      });
      return;
    }
    const remaining = students.filter((s) => s.id !== activeStudent.id);
    setStudents(remaining);
    setActiveStudentId(remaining[0].id);
    setDeleteConfirmVisible(false);
  };

  /* WhatsApp Linking */
  const openWhatsAppUrl = async (pesan) => {
    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(pesan);
    try {
      await Linking.openURL(url);
    } catch (error) {
      setInfoModal({
        visible: true,
        title: 'Tidak Dapat Membuka WhatsApp',
        message:
          'Pastikan aplikasi WhatsApp atau peramban tersedia di perangkat Anda. Anda dapat melihat isi pesan lewat tombol Pratinjau.',
      });
    }
  };

  const handleSendAttendanceReport = () => {
    if (!activeStudent.nama.trim()) {
      setInfoModal({
        visible: true,
        title: 'Nama Murid Kosong',
        message:
          'Mohon isi Nama Murid pada profil terlebih dahulu sebelum mengirim laporan.',
      });
      return;
    }
    openWhatsAppUrl(buildWhatsAppAttendanceReport(activeStudent));
  };

  const handleSendMonthlyReport = () => {
    if (!selectedMonth) return;
    openWhatsAppUrl(buildWhatsAppMonthlyReport(selectedMonth, activeStudent));
  };

  /* Saktah Play handlers */
  const quizStarCount = KUIS_SOAL_10.reduce(
    (sum, soal) => sum + (quizAnswers[soal.id] === soal.jawabanBenar ? 1 : 0),
    0
  );
  const currentQuestion = KUIS_SOAL_10[quizIndex];
  const selectedQuizChoice = quizAnswers[currentQuestion.id];

  const handleSelectQuizAnswer = (idx) => {
    if (selectedQuizChoice !== undefined) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
    if (idx === currentQuestion.jawabanBenar) {
      triggerStarAnimation();
    }
  };

  const handleNextQuizStep = () => {
    if (quizIndex < KUIS_SOAL_10.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      triggerCertificateAnimation();
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizFinished(false);
  };

  /* Render Top Header */
  const renderTopBanner = () => {
    if (showTentang) {
      return (
        <View
          style={[styles.subHeaderBanner, { paddingTop: androidTopInset + 12 }]}
        >
          <View style={styles.subHeaderInner}>
            <TouchableOpacity
              style={styles.headerBackBtn}
              activeOpacity={0.8}
              onPress={() => {
                setShowTentang(false);
                scrollToTop();
              }}
            >
              <Ionicons name="arrow-back" size={18} color={COLORS.ivory} />
            </TouchableOpacity>
            <View style={styles.subHeaderTextCol}>
              <Text style={[styles.subHeaderTitle, fonts.loraBold]}>
                Tentang Saktah Tarbiyah
              </Text>
              <Text style={[styles.subHeaderSubtitle, fonts.sansRegular]}>
                Filosofi Belajar, Jadwal & Konsultasi
              </Text>
            </View>
            <View style={styles.subLogoFrame}>
              <Image
                source={LOGO_SAKTAH}
                style={styles.subLogoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      );
    }

    if (activeTab === 'beranda') {
      return (
        <View style={[styles.heroBanner, { paddingTop: androidTopInset + 16 }]}>
          <View style={styles.heroInner}>
            <View style={styles.heroTopRow}>
              <View style={styles.logoFrame}>
                <Image
                  source={LOGO_SAKTAH}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTitleCol}>
                <Text style={[styles.heroTitle, fonts.loraBold]}>
                  Saktah Tarbiyah
                </Text>
                <Text style={[styles.heroTagline, fonts.loraSemi]}>
                  Ruang Tumbuh & Belajar yang Tenang
                </Text>
              </View>
              <TouchableOpacity
                style={styles.tentangHeaderBtn}
                activeOpacity={0.82}
                onPress={() => {
                  setShowTentang(true);
                  scrollToTop();
                }}
              >
                <Ionicons name="leaf-outline" size={15} color={COLORS.moss} />
                <Text style={[styles.tentangHeaderBtnText, fonts.sansBold]}>
                  Tentang
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroGreetingPaper}>
              <View style={styles.heroGreetingRow}>
                <Feather name="feather" size={16} color={COLORS.goldSoft} />
                <Text style={[styles.heroGreetingText, fonts.sansRegular]}>
                  Jurnal pendampingan belajar TK & SD yang hangat untuk
                  pengajar, orang tua, dan buah hati.
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    const headerMeta = {
      kurikulum: {
        title: selectedMonth ? 'Detail Kurikulum Bulan' : 'Kurikulum Bulanan',
        subtitle: selectedMonth
          ? selectedMonth.kode
          : 'Materi & Capaian Belajar Per Bulan',
        icon: 'layers-outline',
      },
      absen: {
        title: 'Kartu Absen Murid',
        subtitle: 'Stempel 12 Pertemuan & Catatan Harian',
        icon: 'calendar-outline',
      },
      play: {
        title: 'Saktah Play',
        subtitle: 'Kartu Lipat Doa & Kuis Bintang Ceria',
        icon: 'sparkles-outline',
      },
    }[activeTab];

    return (
      <View
        style={[styles.subHeaderBanner, { paddingTop: androidTopInset + 12 }]}
      >
        <View style={styles.subHeaderInner}>
          <View style={styles.subLogoFrame}>
            <Image
              source={LOGO_SAKTAH}
              style={styles.subLogoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.subHeaderTextCol}>
            <Text style={[styles.subHeaderTitle, fonts.loraBold]}>
              {headerMeta.title}
            </Text>
            <Text style={[styles.subHeaderSubtitle, fonts.sansRegular]}>
              {headerMeta.subtitle}
            </Text>
          </View>
          {activeTab === 'play' ? (
            <Animated.View
              style={[
                styles.headerStarPill,
                { transform: [{ scale: starPulse }] },
              ]}
            >
              <Ionicons name="star" size={14} color={COLORS.gold} />
              <Text style={[styles.headerStarText, fonts.sansBold]}>
                {quizStarCount}/10
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.headerIconPill}>
              <Ionicons
                name={headerMeta.icon}
                size={18}
                color={COLORS.ivory}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  /* Tab 1: Beranda */
  const renderBerandaTab = () => {
    const stages = SESI_TEMPLATES[sessionDuration];
    const completedStages = stages.filter((s) => checkedStages[s.id]).length;
    const activeHadir = countHadir(activeStudent);
    const totalKurikulumMateri = kurikulumList.reduce(
      (sum, m) => sum + m.materiList.length,
      0
    );
    const totalKurikulumDone = kurikulumList.reduce(
      (sum, m) => sum + m.materiList.filter((x) => x.sudahDiajarkan).length,
      0
    );

    return (
      <View style={styles.tabBody}>
        {/* Alur Sesi Mengajar Hari Ini */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Alur Sesi Mengajar Hari Ini
          </Text>
          <TouchableOpacity
            style={styles.resetTextBtn}
            activeOpacity={0.75}
            onPress={resetSessionStages}
          >
            <Feather name="rotate-ccw" size={13} color={COLORS.forest} />
            <Text style={[styles.resetTextLabel, fonts.sansBold]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
          <View style={styles.durationSwitchRow}>
            {[60, 90].map((minutes) => {
              const active = sessionDuration === minutes;
              return (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.durationBtn,
                    active && styles.durationBtnActive,
                  ]}
                  activeOpacity={0.82}
                  onPress={() => setSessionDuration(minutes)}
                >
                  <Feather
                    name="clock"
                    size={15}
                    color={active ? COLORS.ivory : COLORS.forest}
                  />
                  <Text
                    style={[
                      styles.durationBtnText,
                      fonts.sansBold,
                      active && styles.durationBtnTextActive,
                    ]}
                  >
                    {minutes} Menit
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sessionProgressRow}>
            <Text style={[styles.sessionProgressText, fonts.sansSemi]}>
              Tahapan Selesai: {completedStages} / {stages.length}
            </Text>
            <View style={styles.sessionMiniTrack}>
              <View
                style={[
                  styles.sessionMiniFill,
                  { width: `${(completedStages / stages.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {stages.map((stage, idx) => {
            const checked = Boolean(checkedStages[stage.id]);
            return (
              <TouchableOpacity
                key={stage.id}
                style={[
                  styles.stageItem,
                  checked && styles.stageItemChecked,
                  idx === stages.length - 1 && { marginBottom: 0 },
                ]}
                activeOpacity={0.8}
                onPress={() => toggleStageChecked(stage.id)}
              >
                <View
                  style={[
                    styles.stageCheckbox,
                    checked && styles.stageCheckboxChecked,
                  ]}
                >
                  {checked ? (
                    <Feather name="check" size={15} color={COLORS.ivory} />
                  ) : (
                    <Text style={[styles.stageIndexText, fonts.sansBold]}>
                      {idx + 1}
                    </Text>
                  )}
                </View>

                <View style={styles.stageContentCol}>
                  <View style={styles.stageTopLine}>
                    <Text
                      style={[
                        styles.stageTitle,
                        fonts.sansBold,
                        checked && styles.stageTitleDone,
                      ]}
                    >
                      {stage.judul}
                    </Text>
                    <View style={styles.stageDurationBadge}>
                      <Text style={[styles.stageDurationText, fonts.sansBold]}>
                        {stage.durasi}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.stageDesc, fonts.sansRegular]}>
                    {stage.deskripsi}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </PaperCard>

        {/* Pintasan Cepat */}
        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          Pintasan Cepat Mengajar
        </Text>

        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => navigateTab('kurikulum')}
        >
          <PaperCard variant="sage" layerColor={COLORS.forest}>
            <View style={styles.quickCardRow}>
              <View style={styles.quickIconBadge}>
                <Ionicons name="layers-outline" size={22} color={COLORS.ivory} />
              </View>
              <View style={styles.quickTextCol}>
                <Text style={[styles.quickTitle, fonts.loraBold]}>
                  Kurikulum Bulanan
                </Text>
                <Text style={[styles.quickSub, fonts.sansSemi]}>
                  {kurikulumList.length} bulan terstruktur • {totalKurikulumDone}/
                  {totalKurikulumMateri} materi diajarkan
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.forest}
              />
            </View>
          </PaperCard>
        </TouchableOpacity>

        <View style={styles.shortcutDualRow}>
          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('absen')}
          >
            <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
              <View style={styles.quickSmallIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.forest}
                />
              </View>
              <Text style={[styles.quickSmallTitle, fonts.loraBold]}>
                Kartu Absen
              </Text>
              <Text style={[styles.quickSmallDesc, fonts.sansRegular]}>
                {activeStudent.nama.split(' ')[0]} • {activeHadir}/12 Hadir
              </Text>
            </PaperCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('play')}
          >
            <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
              <View style={styles.quickSmallIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={20}
                  color={COLORS.forest}
                />
              </View>
              <Text style={[styles.quickSmallTitle, fonts.loraBold]}>
                Saktah Play
              </Text>
              <Text style={[styles.quickSmallDesc, fonts.sansRegular]}>
                Doa lipat & {quizStarCount}/10 Bintang
              </Text>
            </PaperCard>
          </TouchableOpacity>
        </View>

        {/* Kartu Tentang Saktah Tarbiyah */}
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => {
            setShowTentang(true);
            scrollToTop();
          }}
        >
          <PaperCard variant="forest" layerColor={COLORS.moss}>
            <View style={styles.aboutShortcutRow}>
              <View style={styles.aboutMiniLogoFrame}>
                <Image
                  source={LOGO_SAKTAH}
                  style={styles.aboutMiniLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.aboutShortcutCol}>
                <Text style={[styles.aboutShortcutTitle, fonts.loraBold]}>
                  Tentang Saktah Tarbiyah
                </Text>
                <Text style={[styles.aboutShortcutDesc, fonts.sansRegular]}>
                  Kenali filosofi belajar tanpa tergesa, jadwal kelas privat, &
                  konsultasi pendaftaran.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={COLORS.ivory} />
            </View>
          </PaperCard>
        </TouchableOpacity>
      </View>
    );
  };

  /* Halaman Tentang (dibuka dari Header / Kartu Tentang di Beranda) */
  const renderTentangPage = () => {
    return (
      <View style={styles.tabBody}>
        <TouchableOpacity
          style={styles.backToListBtn}
          activeOpacity={0.82}
          onPress={() => {
            setShowTentang(false);
            scrollToTop();
          }}
        >
          <Ionicons name="arrow-back" size={17} color={COLORS.forest} />
          <Text style={[styles.backToListText, fonts.sansBold]}>
            ← Kembali ke Beranda
          </Text>
        </TouchableOpacity>

        <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
          <View style={styles.aboutHeroRow}>
            <View style={styles.aboutLogoCircle}>
              <Image
                source={LOGO_SAKTAH}
                style={styles.aboutLogoImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.aboutHeroCol}>
              <Text style={[styles.aboutTitle, fonts.loraBold]}>
                Saktah Tarbiyah
              </Text>
              <Text style={[styles.aboutSub, fonts.sansSemi]}>
                Ruang Tumbuh & Belajar yang Tenang
              </Text>
            </View>
          </View>

          <Text style={[styles.aboutQuote, fonts.loraSemi]}>
            “Seperti makna saktah—jeda sejenak untuk mengambil napas dengan
            tenang—kami mendampingi anak TK & SD bertumbuh sesuai ritme terbaiknya,
            hangat, sabar, dan beradab.”
          </Text>
        </PaperCard>

        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          3 Pilar Pendampingan
        </Text>
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.philosophyRow}>
            <View style={styles.philosophyIcon}>
              <Feather name="edit-3" size={18} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Calistung & Tematik TK/SD
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Membaca suku kata, menulis rapi, serta berhitung benda konkret
                tanpa tekanan.
              </Text>
            </View>
          </View>

          <View style={styles.philosophyRow}>
            <View style={styles.philosophyIcon}>
              <Feather name="book-open" size={18} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Mengaji Iqra & Tahsin Anak
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Makhraj huruf hijaiyah, panjang-pendek bacaan, serta hafalan surat
                pendek pilihan.
              </Text>
            </View>
          </View>

          <View style={[styles.philosophyRow, { marginBottom: 0 }]}>
            <View style={styles.philosophyIcon}>
              <Ionicons name="heart-outline" size={19} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Adab & Doa Harian
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Pembiasaan tiga kata ajaib (tolong, maaf, terima kasih) serta doa
                sehari-hari.
              </Text>
            </View>
          </View>
        </PaperCard>

        <PaperCard variant="forest" layerColor={COLORS.moss}>
          <Text style={[styles.consultTitle, fonts.loraBold]}>
            Konsultasi Kelas Privat
          </Text>
          <Text style={[styles.consultDesc, fonts.sansRegular]}>
            Tersedia pilihan sesi 60 menit & 90 menit (Senin–Sabtu). Hubungi
            admin kami untuk mencocokkan jadwal belajar ananda.
          </Text>
          <TouchableOpacity
            style={styles.consultBtn}
            activeOpacity={0.82}
            onPress={() =>
              openWhatsAppUrl(
                'Assalamu’alaikum Kak Admin Saktah Tarbiyah, saya ingin berkonsultasi mengenai pendaftaran & jadwal belajar anak.'
              )
            }
          >
            <Ionicons name="logo-whatsapp" size={20} color={COLORS.forest} />
            <Text style={[styles.consultBtnText, fonts.sansBold]}>
              Konsultasi WhatsApp (081802899219)
            </Text>
          </TouchableOpacity>
        </PaperCard>
      </View>
    );
  };

  /* Tab 2: Kurikulum (Level 1 Daftar Bulan <-> Level 2 Detail Bulan) */
  const renderKurikulumTab = () => {
    if (selectedMonth) {
      const { total, done, percent } = getMonthProgress(selectedMonth);

      return (
        <View style={styles.tabBody}>
          {/* Tombol Kembali ke Level 1 */}
          <TouchableOpacity
            style={styles.backToListBtn}
            activeOpacity={0.82}
            onPress={handleBackToMonths}
          >
            <Ionicons name="arrow-back" size={17} color={COLORS.forest} />
            <Text style={[styles.backToListText, fonts.sansBold]}>
              ← Kembali ke Daftar Bulan
            </Text>
          </TouchableOpacity>

          {/* Header Bulan Terpilih */}
          <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
            <View style={styles.monthDetailHeaderRow}>
              <View style={styles.monthDetailTitleCol}>
                <Text style={[styles.microLabel, fonts.sansBold]}>
                  DETAIL PROGRAM BULANAN
                </Text>
                <Text style={[styles.monthDetailTitle, fonts.loraBold]}>
                  {selectedMonth.judul}
                </Text>
              </View>
              <View style={styles.monthPctPill}>
                <Text style={[styles.monthPctPillText, fonts.sansBold]}>
                  {percent}%
                </Text>
              </View>
            </View>

            <Text style={[styles.progressLabelLine, fonts.sansSemi]}>
              {done} dari {total} materi sudah diajarkan
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
          </PaperCard>

          {/* Kartu Target Capaian Bulan Ini (Editable) */}
          <PaperCard variant="ivory" layerColor={COLORS.moss}>
            <View style={styles.cardTitleIconRow}>
              <Feather name="target" size={18} color={COLORS.forest} />
              <Text style={[styles.cardHeading, fonts.loraBold, { marginBottom: 0 }]}>
                Target Capaian Bulan Ini
              </Text>
            </View>
            <Text style={[styles.cardSubtext, fonts.sansRegular, { marginTop: 4 }]}>
              Ketuk teks di bawah untuk menyesuaikan target capaian sesuai
              kebutuhan murid.
            </Text>
            <TextInput
              style={[styles.targetEditInput, fonts.sansRegular]}
              value={selectedMonth.targetCapaian}
              onChangeText={(text) =>
                updateSelectedMonthField('targetCapaian', text)
              }
              placeholder="Tulis target capaian bulan ini..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />
          </PaperCard>

          {/* Daftar Materi & Aktivitas Pekan 1-4 + Tambah Materi */}
          <View style={styles.sectionHeadingRow}>
            <Text style={[styles.sectionTitle, fonts.loraBold]}>
              Materi & Aktivitas Pekan 1–4
            </Text>
            <TouchableOpacity
              style={styles.addSmallBtn}
              activeOpacity={0.82}
              onPress={handleOpenAddMateri}
            >
              <Feather name="plus" size={15} color={COLORS.ivory} />
              <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
                Tambah Materi
              </Text>
            </TouchableOpacity>
          </View>

          {selectedMonth.materiList.map((mat) => {
            const doneStatus = mat.sudahDiajarkan;
            return (
              <PaperCard
                key={mat.id}
                variant={doneStatus ? 'sage' : 'ivory'}
                layerColor={doneStatus ? COLORS.forest : COLORS.sageDark}
              >
                <View style={styles.materiTopRow}>
                  <View style={styles.pekanBadge}>
                    <Text style={[styles.pekanBadgeText, fonts.sansBold]}>
                      {mat.pekan}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.materiStatusTag,
                      doneStatus
                        ? styles.materiStatusTagDone
                        : styles.materiStatusTagPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.materiStatusTagText,
                        fonts.sansBold,
                        doneStatus && { color: COLORS.ivory },
                      ]}
                    >
                      {doneStatus ? 'Sudah Diajarkan' : 'Belum Diajarkan'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.materiJudul, fonts.loraBold]}>
                  {mat.judul}
                </Text>
                <Text style={[styles.materiDesc, fonts.sansRegular]}>
                  {mat.deskripsi}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.materiCheckBtn,
                    doneStatus && styles.materiCheckBtnActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleMateriDone(mat.id)}
                >
                  <Ionicons
                    name={doneStatus ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={doneStatus ? COLORS.ivory : COLORS.forest}
                  />
                  <Text
                    style={[
                      styles.materiCheckBtnText,
                      fonts.sansBold,
                      doneStatus && styles.materiCheckBtnTextActive,
                    ]}
                  >
                    {doneStatus
                      ? 'Sudah Diajarkan ✓'
                      : 'Tandai Sudah Diajarkan'}
                  </Text>
                </TouchableOpacity>
              </PaperCard>
            );
          })}

          {/* Catatan Capaian Anak Bulan Ini + Predikat + Bagikan Rapor WA */}
          <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
            <View style={styles.cardTitleIconRow}>
              <Feather name="award" size={19} color={COLORS.forest} />
              <Text style={[styles.cardHeading, fonts.loraBold, { marginBottom: 0 }]}>
                Catatan Capaian Anak Bulan Ini
              </Text>
            </View>

            <Text style={[styles.inputLabel, fonts.sansBold, { marginTop: 12 }]}>
              Pilih Predikat Capaian
            </Text>
            <View style={styles.predikatCol}>
              {PREDIKAT_OPTIONS.map((pred) => {
                const active = selectedMonth.predikat === pred;
                return (
                  <TouchableOpacity
                    key={pred}
                    style={[
                      styles.predikatBtn,
                      active && styles.predikatBtnActive,
                    ]}
                    activeOpacity={0.82}
                    onPress={() => updateSelectedMonthField('predikat', pred)}
                  >
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={active ? COLORS.ivory : COLORS.forest}
                    />
                    <Text
                      style={[
                        styles.predikatBtnText,
                        fonts.sansBold,
                        active && styles.predikatBtnTextActive,
                      ]}
                    >
                      {pred}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.inputLabel, fonts.sansBold]}>
              Catatan Pengajar untuk Orang Tua
            </Text>
            <TextInput
              style={[styles.noteTextInput, fonts.sansRegular]}
              value={selectedMonth.catatanBulanan}
              onChangeText={(text) =>
                updateSelectedMonthField('catatanBulanan', text)
              }
              placeholder="Tuliskan perkembangan sikap, fokus, dan kemajuan belajar ananda bulan ini..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.waPrimaryBtn, { marginTop: 14 }]}
              activeOpacity={0.82}
              onPress={handleSendMonthlyReport}
            >
              <Ionicons name="logo-whatsapp" size={20} color={COLORS.ivory} />
              <Text style={[styles.waPrimaryBtnText, fonts.sansBold]}>
                Bagikan Rapor Bulanan ke WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.waPreviewBtn}
              activeOpacity={0.82}
              onPress={() =>
                setWaPreviewModal({
                  visible: true,
                  title: 'Pratinjau Rapor Bulanan',
                  text: buildWhatsAppMonthlyReport(selectedMonth, activeStudent),
                })
              }
            >
              <Ionicons name="eye-outline" size={18} color={COLORS.forest} />
              <Text style={[styles.waPreviewBtnText, fonts.sansBold]}>
                Pratinjau Rapor Bulanan
              </Text>
            </TouchableOpacity>
          </PaperCard>
        </View>
      );
    }

    /* Level 1: Daftar Bulan */
    return (
      <View style={styles.tabBody}>
        <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
          <View style={styles.playIntroRow}>
            <Ionicons name="layers-outline" size={22} color={COLORS.forest} />
            <View style={styles.playIntroTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Peta Kurikulum & Capaian Per Bulan
              </Text>
              <Text
                style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
              >
                Ketuk kartu bulan untuk membuka target capaian, ceklis materi
                pekanan, dan rapor bulanan.
              </Text>
            </View>
          </View>
        </PaperCard>

        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Daftar Bulan ({kurikulumList.length})
          </Text>
          <TouchableOpacity
            style={styles.addSmallBtn}
            activeOpacity={0.82}
            onPress={handleOpenAddMonth}
          >
            <Feather name="plus" size={15} color={COLORS.ivory} />
            <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
              Tambah Bulan Baru
            </Text>
          </TouchableOpacity>
        </View>

        {kurikulumList.map((month, idx) => {
          const { total, done, percent } = getMonthProgress(month);
          return (
            <TouchableOpacity
              key={month.id}
              activeOpacity={0.84}
              onPress={() => handleOpenMonthDetail(month.id)}
            >
              <PaperCard
                variant={idx % 2 === 0 ? 'ivory' : 'sage'}
                layerColor={idx % 2 === 0 ? COLORS.moss : COLORS.forest}
              >
                <View style={styles.monthCardTopRow}>
                  <View style={styles.monthCodePill}>
                    <Text style={[styles.monthCodeText, fonts.sansBold]}>
                      {month.kode.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.monthStatsChip}>
                    <Text style={[styles.monthStatsText, fonts.sansBold]}>
                      {done}/{total} Materi • {percent}%
                    </Text>
                  </View>
                </View>

                <Text style={[styles.monthCardTitle, fonts.loraBold]}>
                  {month.judul}
                </Text>
                <Text style={[styles.monthCardTarget, fonts.sansRegular]}>
                  {month.targetCapaian}
                </Text>

                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${percent}%` }]}
                  />
                </View>

                <View style={styles.monthCardFooter}>
                  <View style={styles.predikatSmallBadge}>
                    <Feather name="award" size={13} color={COLORS.forest} />
                    <Text style={[styles.predikatSmallText, fonts.sansBold]}>
                      {month.predikat}
                    </Text>
                  </View>
                  <View style={styles.monthOpenCue}>
                    <Text style={[styles.monthOpenCueText, fonts.sansBold]}>
                      Buka Pekan 1–4
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={15}
                      color={COLORS.forest}
                    />
                  </View>
                </View>
              </PaperCard>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  /* Tab 3: Kartu Absen */
  const renderKartuAbsenTab = () => {
    const totalHadir = countHadir(activeStudent);
    const pct = Math.round((totalHadir / 12) * 100);

    return (
      <View style={styles.tabBody}>
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Daftar Murid
          </Text>
          <TouchableOpacity
            style={styles.addSmallBtn}
            activeOpacity={0.82}
            onPress={handleOpenAddStudent}
          >
            <Ionicons name="person-add-outline" size={15} color={COLORS.ivory} />
            <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
              Tambah Murid
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.memberSwitchScroll}
        >
          {students.map((student) => {
            const selected = student.id === activeStudent.id;
            const hadirCount = countHadir(student);
            return (
              <TouchableOpacity
                key={student.id}
                style={[
                  styles.memberPill,
                  selected && styles.memberPillActive,
                ]}
                activeOpacity={0.82}
                onPress={() => setActiveStudentId(student.id)}
              >
                <View style={styles.memberPillTop}>
                  <Text
                    style={[
                      styles.memberPillName,
                      fonts.sansBold,
                      selected && styles.memberPillNameActive,
                    ]}
                  >
                    {student.nama.trim() || 'Murid Baru'}
                  </Text>
                  <View
                    style={[
                      styles.memberJenjangChip,
                      selected && styles.memberJenjangChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.memberJenjangText,
                        fonts.sansBold,
                        selected && styles.memberJenjangTextActive,
                      ]}
                    >
                      {student.jenjang}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.memberPillCount,
                    fonts.sansSemi,
                    selected && styles.memberPillCountActive,
                  ]}
                >
                  {hadirCount}/12 Pertemuan
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Kartu Profil Murid */}
        <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
          <View style={styles.memberCardTopBand}>
            <View style={styles.memberCardBrandLeft}>
              <View style={styles.memberCardLogoWrap}>
                <Image
                  source={LOGO_SAKTAH}
                  style={styles.memberCardLogo}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={[styles.memberCardOrg, fonts.loraBold]}>
                  SAKTAH TARBIYAH
                </Text>
                <Text style={[styles.memberCardLabel, fonts.sansBold]}>
                  KARTU PROFIL MURID
                </Text>
              </View>
            </View>
            <View style={styles.memberCardBadge}>
              <Text style={[styles.memberCardBadgeText, fonts.sansBold]}>
                {activeStudent.jenjang}
              </Text>
            </View>
          </View>

          <View style={styles.memberCardDivider} />

          <Text style={[styles.memberCardName, fonts.loraBold]}>
            {activeStudent.nama.trim() || 'Nama Murid Belum Diisi'}
          </Text>
          <View style={styles.memberCardMetaGrid}>
            <View style={styles.memberCardMetaItem}>
              <Text style={[styles.metaKey, fonts.sansSemi]}>Program</Text>
              <Text style={[styles.metaVal, fonts.sansBold]}>
                {activeStudent.program || '-'}
              </Text>
            </View>
            <View style={styles.memberCardMetaItem}>
              <Text style={[styles.metaKey, fonts.sansSemi]}>Pengajar</Text>
              <Text style={[styles.metaVal, fonts.sansBold]}>
                {activeStudent.pengajar || '-'}
              </Text>
            </View>
            <View style={styles.memberCardMetaItem}>
              <Text style={[styles.metaKey, fonts.sansSemi]}>Bulan</Text>
              <Text style={[styles.metaVal, fonts.sansBold]}>
                {activeStudent.bulan || '-'}
              </Text>
            </View>
            <View style={styles.memberCardMetaItem}>
              <Text style={[styles.metaKey, fonts.sansSemi]}>Kehadiran</Text>
              <Text style={[styles.metaValAccent, fonts.sansBold]}>
                {totalHadir} / 12 Hadir
              </Text>
            </View>
          </View>

          <View style={styles.memberCardActionsRow}>
            <TouchableOpacity
              style={styles.editProfileToggleBtn}
              activeOpacity={0.8}
              onPress={() => setProfileFormOpen((prev) => !prev)}
            >
              <Feather
                name={profileFormOpen ? 'chevron-up' : 'edit-3'}
                size={15}
                color={COLORS.forest}
              />
              <Text style={[styles.editProfileToggleText, fonts.sansBold]}>
                {profileFormOpen ? 'Tutup Form Profil' : 'Ubah Data Profil'}
              </Text>
            </TouchableOpacity>

            {students.length > 1 && (
              <TouchableOpacity
                style={styles.deleteProfileBtn}
                activeOpacity={0.8}
                onPress={() => setDeleteConfirmVisible(true)}
              >
                <Ionicons
                  name="trash-outline"
                  size={15}
                  color={COLORS.dangerText}
                />
                <Text style={[styles.deleteProfileBtnText, fonts.sansBold]}>
                  Hapus
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {profileFormOpen && (
            <View style={styles.inlineProfileForm}>
              <Text style={[styles.inputLabel, fonts.sansBold]}>Nama Murid</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={activeStudent.nama}
                onChangeText={(text) => updateStudentField('nama', text)}
                placeholder="Nama lengkap anak"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Jenjang Pendidikan
              </Text>
              <View style={styles.chipWrap}>
                {JENJANG_OPTIONS.map((jjg) => {
                  const selected = activeStudent.jenjang === jjg;
                  return (
                    <TouchableOpacity
                      key={jjg}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => updateStudentField('jenjang', jjg)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansBold,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        Jenjang {jjg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Program</Text>
              <View style={styles.chipWrap}>
                {PROGRAM_OPTIONS.map((prog) => {
                  const selected = activeStudent.program === prog;
                  return (
                    <TouchableOpacity
                      key={prog}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => updateStudentField('program', prog)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansSemi,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {prog}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={activeStudent.program}
                onChangeText={(text) => updateStudentField('program', text)}
                placeholder="Nama program belajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Pengajar</Text>
              <View style={styles.chipWrap}>
                {PENGAJAR_OPTIONS.map((guru) => {
                  const selected = activeStudent.pengajar === guru;
                  return (
                    <TouchableOpacity
                      key={guru}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => updateStudentField('pengajar', guru)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansSemi,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {guru}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={activeStudent.pengajar}
                onChangeText={(text) => updateStudentField('pengajar', text)}
                placeholder="Nama pengajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Bulan</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bulanScroll}
              >
                {BULAN_OPTIONS.map((bln) => {
                  const selected = activeStudent.bulan === bln;
                  return (
                    <TouchableOpacity
                      key={bln}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => updateStudentField('bulan', bln)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansSemi,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {bln}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TextInput
                style={[styles.textInput, fonts.sansRegular, { marginBottom: 0 }]}
                value={activeStudent.bulan}
                onChangeText={(text) => updateStudentField('bulan', text)}
                placeholder="Contoh: November 2026"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          )}
        </PaperCard>

        {/* Grid 12 Pertemuan Stempel Melingkar */}
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.progressHeaderRow}>
            <View style={styles.progressTitleCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Stempel Kehadiran 12 Pertemuan
              </Text>
              <Text style={[styles.cardSubtext, fonts.sansRegular]}>
                Ketuk stempel melingkar untuk menandai Hadir & tanggal otomatis
              </Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={[styles.progressBadgeText, fonts.sansBold]}>
                {totalHadir} / 12
              </Text>
            </View>
          </View>

          <Text style={[styles.progressLabelLine, fonts.sansBold]}>
            {totalHadir} / 12 Pertemuan Tercapai ({pct}%)
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>

          <View style={styles.stampGrid}>
            {activeStudent.pertemuan.map((item) => {
              const isHadir = item.hadir;
              return (
                <TouchableOpacity
                  key={item.nomor}
                  style={[
                    styles.ticketCell,
                    isHadir && styles.ticketCellHadir,
                  ]}
                  activeOpacity={0.78}
                  onPress={() => toggleMeetingStamp(item.nomor)}
                >
                  <Text style={[styles.ticketNoText, fonts.sansBold]}>
                    PERT. {item.nomor}
                  </Text>

                  <View
                    style={[
                      styles.circularStamp,
                      isHadir
                        ? styles.circularStampHadir
                        : styles.circularStampEmpty,
                    ]}
                  >
                    {isHadir ? (
                      <>
                        <Ionicons
                          name="checkmark-done"
                          size={18}
                          color={COLORS.ivory}
                        />
                        <Text style={[styles.stampCapText, fonts.sansBold]}>
                          HADIR
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.stampNumberText, fonts.loraBold]}>
                        {item.nomor}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.ticketDateLabel,
                      fonts.sansSemi,
                      isHadir && styles.ticketDateLabelHadir,
                    ]}
                  >
                    {isHadir && item.tanggal ? item.tanggal : 'Ketuk Cap'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </PaperCard>

        {/* Catatan Perkembangan Pertemuan 1-12 */}
        <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
          <Text style={[styles.cardHeading, fonts.loraBold]}>
            Catatan Perkembangan Pertemuan
          </Text>
          <Text style={[styles.cardSubtext, fonts.sansRegular]}>
            Ketuk tag cepat atau tulis langsung materi dan capaian anak (1–12).
          </Text>

          {activeStudent.pertemuan.map((item) => (
            <View
              key={item.nomor}
              style={[
                styles.noteCardItem,
                item.hadir && styles.noteCardItemHadir,
              ]}
            >
              <View style={styles.noteTopRow}>
                <View style={styles.noteTitleGroup}>
                  <View
                    style={[
                      styles.noteRoundNum,
                      item.hadir && styles.noteRoundNumHadir,
                    ]}
                  >
                    <Text
                      style={[
                        styles.noteRoundNumText,
                        fonts.sansBold,
                        item.hadir && styles.noteRoundNumTextHadir,
                      ]}
                    >
                      {item.nomor}
                    </Text>
                  </View>
                  <Text style={[styles.noteItemTitle, fonts.sansBold]}>
                    Pertemuan {item.nomor}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.noteStampBtn,
                    item.hadir && styles.noteStampBtnHadir,
                  ]}
                  activeOpacity={0.78}
                  onPress={() => toggleMeetingStamp(item.nomor)}
                >
                  <Ionicons
                    name={item.hadir ? 'checkmark-circle' : 'ellipse-outline'}
                    size={15}
                    color={item.hadir ? COLORS.ivory : COLORS.forest}
                  />
                  <Text
                    style={[
                      styles.noteStampBtnText,
                      fonts.sansBold,
                      item.hadir && styles.noteStampBtnTextHadir,
                    ]}
                  >
                    {item.hadir ? item.tanggal || 'Hadir' : 'Cap Hadir'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tagRow}>
                {CAPAIAN_TAGS.map((tag) => {
                  const hasTag = item.catatan.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, hasTag && styles.tagChipActive]}
                      activeOpacity={0.78}
                      onPress={() => toggleMeetingTag(item.nomor, tag)}
                    >
                      <Text
                        style={[
                          styles.tagChipText,
                          fonts.sansSemi,
                          hasTag && styles.tagChipTextActive,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={[styles.noteTextInput, fonts.sansRegular]}
                value={item.catatan}
                onChangeText={(text) => updateMeetingNote(item.nomor, text)}
                placeholder={`Tulis catatan perkembangan pertemuan ${item.nomor}...`}
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}
        </PaperCard>

        {/* Kirim Rekap ke WhatsApp */}
        <PaperCard variant="sage" layerColor={COLORS.moss}>
          <View style={styles.waHeaderRow}>
            <View style={styles.waIconBadge}>
              <Ionicons name="logo-whatsapp" size={22} color={COLORS.ivory} />
            </View>
            <View style={styles.waHeaderTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Kirim Rekap ke WhatsApp
              </Text>
              <Text
                style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
              >
                Rangkuman kehadiran ({totalHadir}/12) dan catatan terbaru murid.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.waPrimaryBtn}
            activeOpacity={0.82}
            onPress={handleSendAttendanceReport}
          >
            <Ionicons name="logo-whatsapp" size={20} color={COLORS.ivory} />
            <Text style={[styles.waPrimaryBtnText, fonts.sansBold]}>
              Kirim Rekap Kartu Absen ke WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.waPreviewBtn}
            activeOpacity={0.82}
            onPress={() =>
              setWaPreviewModal({
                visible: true,
                title: 'Pratinjau Rekap Kartu Absen',
                text: buildWhatsAppAttendanceReport(activeStudent),
              })
            }
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.forest} />
            <Text style={[styles.waPreviewBtnText, fonts.sansBold]}>
              Lihat Pratinjau Rekap
            </Text>
          </TouchableOpacity>
        </PaperCard>
      </View>
    );
  };

  /* Tab 4: Saktah Play */
  const renderKartuLipatSection = () => {
    const filteredCards =
      doaFilter === 'Semua'
        ? DOA_ADAB_CARDS
        : DOA_ADAB_CARDS.filter((item) => item.kategori === doaFilter);

    return (
      <View>
        <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
          <View style={styles.playIntroRow}>
            <Feather name="book-open" size={22} color={COLORS.forest} />
            <View style={styles.playIntroTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Kartu Lipat Doa Harian & Adab
              </Text>
              <Text
                style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
              >
                Ketuk kartu untuk membuka bacaan latin, arti lembut, dan
                tantangan praktik baik hari ini.
              </Text>
            </View>
          </View>
        </PaperCard>

        <View style={styles.chipWrap}>
          {['Semua', 'Doa Harian', 'Adab Anak'].map((cat) => {
            const active = doaFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.8}
                onPress={() => setDoaFilter(cat)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    fonts.sansBold,
                    active && styles.filterPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredCards.map((card, idx) => {
          const isOpen = Boolean(openDoaIds[card.id]);
          const isDone = Boolean(doneChallenges[card.id]);
          return (
            <PaperCard
              key={card.id}
              variant={idx % 2 === 0 ? 'ivory' : 'sage'}
              layerColor={idx % 2 === 0 ? COLORS.sageDark : COLORS.forest}
            >
              <TouchableOpacity
                style={styles.foldFrontTouch}
                activeOpacity={0.82}
                onPress={() =>
                  setOpenDoaIds((prev) => ({
                    ...prev,
                    [card.id]: !prev[card.id],
                  }))
                }
              >
                <View style={styles.foldIconCircle}>
                  <Ionicons name={card.ikon} size={22} color={COLORS.forest} />
                </View>
                <View style={styles.foldFrontTextCol}>
                  <View style={styles.foldBadgeRow}>
                    <View style={styles.foldCategoryChip}>
                      <Text style={[styles.foldCategoryText, fonts.sansBold]}>
                        {card.kategori}
                      </Text>
                    </View>
                    {isDone && (
                      <View style={styles.foldDoneChip}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color={COLORS.ivory}
                        />
                        <Text style={[styles.foldDoneText, fonts.sansBold]}>
                          Dipraktikkan
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.foldTitle, fonts.loraBold]}>
                    {card.judul}
                  </Text>
                  <Text style={[styles.foldTeaser, fonts.sansRegular]}>
                    {card.teaser}
                  </Text>
                </View>

                <View style={styles.foldChevronBox}>
                  <Feather
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={COLORS.forest}
                  />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.foldInnerPanel}>
                  <View style={styles.foldDivider} />
                  <Text style={[styles.foldSectionLabel, fonts.sansBold]}>
                    BACAAN LATIN
                  </Text>
                  <Text style={[styles.foldLatinText, fonts.loraBold]}>
                    {card.lafazLatin}
                  </Text>

                  <Text style={[styles.foldSectionLabel, fonts.sansBold]}>
                    ARTI LEMBUT
                  </Text>
                  <Text style={[styles.foldMeaningText, fonts.sansRegular]}>
                    {card.artiLembut}
                  </Text>

                  <View style={styles.challengeBox}>
                    <View style={styles.challengeHeader}>
                      <Ionicons
                        name="sparkles-outline"
                        size={16}
                        color={COLORS.forest}
                      />
                      <Text style={[styles.challengeLabel, fonts.sansBold]}>
                        TANTANGAN PRAKTIK BAIK
                      </Text>
                    </View>
                    <Text style={[styles.challengeText, fonts.sansRegular]}>
                      {card.tantangan}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.challengeBtn,
                        isDone && styles.challengeBtnDone,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setDoneChallenges((prev) => ({
                          ...prev,
                          [card.id]: !prev[card.id],
                        }))
                      }
                    >
                      <Ionicons
                        name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                        size={17}
                        color={isDone ? COLORS.ivory : COLORS.forest}
                      />
                      <Text
                        style={[
                          styles.challengeBtnText,
                          fonts.sansBold,
                          isDone && styles.challengeBtnTextDone,
                        ]}
                      >
                        {isDone
                          ? 'Alhamdulillah, Sudah Dipraktikkan'
                          : 'Tandai Tantangan Selesai'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </PaperCard>
          );
        })}
      </View>
    );
  };

  const renderKuisBintangSection = () => {
    if (quizFinished) {
      let subtitleCert =
        'MasyaAllah! Terus berlatih dengan tenang bersama Ayah, Bunda, dan Kakak Pengajar.';
      if (quizStarCount >= 8) {
        subtitleCert =
          'Luar biasa teliti dalam Calistung, pengenalan huruf, doa harian, dan adab anak!';
      } else if (quizStarCount >= 5) {
        subtitleCert =
          'Kemajuan yang hebat! Sedikit latihan lagi semua bintang akan terisi penuh.';
      }

      return (
        <Animated.View style={{ transform: [{ scale: certScale }] }}>
          <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
            <View style={styles.certContainer}>
              <View style={styles.certTopRibbon}>
                <Feather name="award" size={32} color={COLORS.gold} />
              </View>

              <Text style={[styles.certOrgTag, fonts.sansBold]}>
                SERTIFIKAT APRESIASI SAKTAH PLAY
              </Text>

              <Text style={[styles.certHeadline, fonts.loraBold]}>
                Hebat! Kamu meraih {quizStarCount} Bintang Hari Ini
              </Text>

              <Text style={[styles.certRecipient, fonts.sansSemi]}>
                Untuk {activeStudent.nama || 'Sahabat Saktah'}
              </Text>

              <View style={styles.certStarsGrid}>
                {KUIS_SOAL_10.map((soal) => {
                  const earned = quizAnswers[soal.id] === soal.jawabanBenar;
                  return (
                    <View
                      key={soal.id}
                      style={[
                        styles.certStarChip,
                        earned
                          ? styles.certStarChipEarned
                          : styles.certStarChipEmpty,
                      ]}
                    >
                      <Ionicons
                        name={earned ? 'star' : 'star-outline'}
                        size={18}
                        color={earned ? COLORS.gold : COLORS.textMuted}
                      />
                    </View>
                  );
                })}
              </View>

              <Text style={[styles.certMessage, fonts.sansRegular]}>
                {subtitleCert}
              </Text>

              <TouchableOpacity
                style={styles.quizPrimaryBtn}
                activeOpacity={0.82}
                onPress={handleRestartQuiz}
              >
                <Ionicons name="refresh" size={18} color={COLORS.ivory} />
                <Text style={[styles.quizPrimaryBtnText, fonts.sansBold]}>
                  Main Kuis Bintang Lagi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quizSecondaryBtn}
                activeOpacity={0.82}
                onPress={() => setPlayMode('lipat')}
              >
                <Feather name="book-open" size={17} color={COLORS.forest} />
                <Text style={[styles.quizSecondaryBtnText, fonts.sansBold]}>
                  Buka Kartu Lipat Doa & Adab
                </Text>
              </TouchableOpacity>
            </View>
          </PaperCard>
        </Animated.View>
      );
    }

    const isAnswered = selectedQuizChoice !== undefined;
    const isCorrect = selectedQuizChoice === currentQuestion.jawabanBenar;
    const letters = ['A', 'B', 'C', 'D'];

    return (
      <View>
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.quizTopBar}>
            <Text style={[styles.quizProgressLabel, fonts.sansBold]}>
              Soal {quizIndex + 1} dari {KUIS_SOAL_10.length}
            </Text>
            <Animated.View
              style={[
                styles.quizStarCounter,
                { transform: [{ scale: starPulse }] },
              ]}
            >
              <Ionicons name="star" size={15} color={COLORS.gold} />
              <Text style={[styles.quizStarCounterText, fonts.sansBold]}>
                {quizStarCount} Bintang
              </Text>
            </Animated.View>
          </View>

          <View style={styles.quizTenStarsRow}>
            {KUIS_SOAL_10.map((soal, idx) => {
              const ans = quizAnswers[soal.id];
              const answered = ans !== undefined;
              const right = ans === soal.jawabanBenar;
              const current = idx === quizIndex;
              return (
                <View
                  key={soal.id}
                  style={[
                    styles.miniStarNode,
                    answered && right && styles.miniStarNodeRight,
                    answered && !right && styles.miniStarNodeWrong,
                    current && !answered && styles.miniStarNodeCurrent,
                  ]}
                >
                  {answered && right ? (
                    <Ionicons name="star" size={13} color={COLORS.gold} />
                  ) : (
                    <Text
                      style={[
                        styles.miniStarNum,
                        fonts.sansBold,
                        answered && !right && { color: COLORS.dangerText },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </PaperCard>

        <PaperCard variant="ivory" layerColor={COLORS.moss}>
          <View style={styles.levelBadge}>
            <Text style={[styles.levelBadgeText, fonts.sansBold]}>
              {currentQuestion.level}
            </Text>
          </View>

          <Text style={[styles.questionText, fonts.loraBold]}>
            {currentQuestion.pertanyaan}
          </Text>

          {currentQuestion.pilihan.map((opt, idx) => {
            const isChosen = selectedQuizChoice === idx;
            const isRight = idx === currentQuestion.jawabanBenar;

            let optBg = COLORS.cream;
            let optBorder = COLORS.forest;
            let letterBg = COLORS.forest;
            let textColor = COLORS.textPrimary;

            if (isAnswered) {
              if (isRight) {
                optBg = COLORS.sage;
                optBorder = COLORS.forest;
                letterBg = COLORS.forest;
                textColor = COLORS.forest;
              } else if (isChosen) {
                optBg = COLORS.dangerBg;
                optBorder = COLORS.dangerText;
                letterBg = COLORS.dangerText;
                textColor = COLORS.dangerText;
              }
            }

            return (
              <TouchableOpacity
                key={`${currentQuestion.id}-${idx}`}
                style={[
                  styles.quizOptionBtn,
                  { backgroundColor: optBg, borderColor: optBorder },
                ]}
                activeOpacity={isAnswered ? 1 : 0.8}
                disabled={isAnswered}
                onPress={() => handleSelectQuizAnswer(idx)}
              >
                <View
                  style={[styles.quizOptionLetter, { backgroundColor: letterBg }]}
                >
                  <Text style={[styles.quizOptionLetterText, fonts.sansBold]}>
                    {letters[idx]}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.quizOptionLabel,
                    fonts.sansSemi,
                    { color: textColor },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}

          {isAnswered && (
            <View
              style={[
                styles.quizFeedbackCard,
                isCorrect
                  ? styles.quizFeedbackRight
                  : styles.quizFeedbackTryAgain,
              ]}
            >
              <View style={styles.quizFeedbackHeader}>
                <Ionicons
                  name={isCorrect ? 'star' : 'bulb-outline'}
                  size={18}
                  color={isCorrect ? COLORS.gold : COLORS.forest}
                />
                <Text style={[styles.quizFeedbackHeading, fonts.sansBold]}>
                  {isCorrect
                    ? 'MasyaAllah, Benar! +1 Bintang'
                    : 'Hampir tepat, ayo ingat penjelasannya:'}
                </Text>
              </View>
              <Text style={[styles.quizFeedbackBody, fonts.sansRegular]}>
                {currentQuestion.penjelasan}
              </Text>

              <TouchableOpacity
                style={styles.quizPrimaryBtn}
                activeOpacity={0.82}
                onPress={handleNextQuizStep}
              >
                <Text style={[styles.quizPrimaryBtnText, fonts.sansBold]}>
                  {quizIndex < KUIS_SOAL_10.length - 1
                    ? 'Lanjut ke Soal Berikutnya'
                    : 'Buka Sertifikat Apresiasi'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.ivory} />
              </TouchableOpacity>
            </View>
          )}
        </PaperCard>
      </View>
    );
  };

  const renderSaktahPlayTab = () => {
    return (
      <View style={styles.tabBody}>
        <View style={styles.playModePillWrap}>
          <TouchableOpacity
            style={[
              styles.playModeBtn,
              playMode === 'lipat' && styles.playModeBtnActive,
            ]}
            activeOpacity={0.82}
            onPress={() => setPlayMode('lipat')}
          >
            <Feather
              name="book-open"
              size={16}
              color={playMode === 'lipat' ? COLORS.ivory : COLORS.textPrimary}
            />
            <Text
              style={[
                styles.playModeBtnText,
                fonts.sansBold,
                playMode === 'lipat' && styles.playModeBtnTextActive,
              ]}
            >
              Kartu Lipat Doa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playModeBtn,
              playMode === 'kuis' && styles.playModeBtnActive,
            ]}
            activeOpacity={0.82}
            onPress={() => setPlayMode('kuis')}
          >
            <Ionicons
              name="star-outline"
              size={17}
              color={playMode === 'kuis' ? COLORS.ivory : COLORS.textPrimary}
            />
            <Text
              style={[
                styles.playModeBtnText,
                fonts.sansBold,
                playMode === 'kuis' && styles.playModeBtnTextActive,
              ]}
            >
              Kuis Bintang (10)
            </Text>
          </TouchableOpacity>
        </View>

        {playMode === 'lipat'
          ? renderKartuLipatSection()
          : renderKuisBintangSection()}
      </View>
    );
  };

  /* Floating Bottom Bar (4 Tab Utama) */
  const renderFloatingBottomBar = () => {
    const tabs = [
      {
        key: 'beranda',
        label: 'Beranda',
        icon: 'home-outline',
        activeIcon: 'home',
      },
      {
        key: 'kurikulum',
        label: 'Kurikulum',
        icon: 'layers-outline',
        activeIcon: 'layers',
      },
      {
        key: 'absen',
        label: 'Absen',
        icon: 'calendar-outline',
        activeIcon: 'calendar',
      },
      {
        key: 'play',
        label: 'Play',
        icon: 'sparkles-outline',
        activeIcon: 'sparkles',
      },
    ];

    return (
      <View style={styles.floatingDockOuter} pointerEvents="box-none">
        <View style={styles.floatingPillWrap}>
          <View style={styles.floatingPillBackLayer} />
          <View style={styles.floatingPill}>
            {tabs.map((tab) => {
              const active = !showTentang && activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.floatingTabItem,
                    active && styles.floatingTabItemActive,
                  ]}
                  activeOpacity={0.82}
                  onPress={() => navigateTab(tab.key)}
                >
                  <Ionicons
                    name={active ? tab.activeIcon : tab.icon}
                    size={20}
                    color={active ? COLORS.moss : COLORS.cream}
                  />
                  <Text
                    style={[
                      styles.floatingTabLabel,
                      fonts.sansBold,
                      active && styles.floatingTabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.screenShell}>
          {renderTopBanner()}

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.responsiveColumn}>
              {showTentang ? (
                renderTentangPage()
              ) : (
                <>
                  {activeTab === 'beranda' && renderBerandaTab()}
                  {activeTab === 'kurikulum' && renderKurikulumTab()}
                  {activeTab === 'absen' && renderKartuAbsenTab()}
                  {activeTab === 'play' && renderSaktahPlayTab()}
                </>
              )}
            </View>
          </ScrollView>

          {renderFloatingBottomBar()}
        </View>
      </KeyboardAvoidingView>

      {/* Modal Tambah Bulan Baru (Kurikulum Level 1) */}
      <Modal
        visible={addMonthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMonthModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                Tambah Bulan Kurikulum Baru
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Buat tema bulanan baru lengkap dengan materi pekanan yang bisa
                dicentang.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Judul Bulan & Tema *
              </Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newMonthTitle}
                onChangeText={(text) => {
                  setNewMonthTitle(text);
                  if (newMonthError) setNewMonthError('');
                }}
                placeholder="Contoh: Bulan 4 — Membaca Cerita & Perkalian Awal"
                placeholderTextColor={COLORS.textMuted}
              />
              {newMonthError ? (
                <Text style={[styles.errorText, fonts.sansBold]}>
                  {newMonthError}
                </Text>
              ) : null}

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Target Capaian Bulan Ini
              </Text>
              <TextInput
                style={[styles.noteTextInput, fonts.sansRegular]}
                value={newMonthTarget}
                onChangeText={setNewMonthTarget}
                placeholder="Tuliskan target kemampuan yang ingin dicapai ananda..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
                activeOpacity={0.82}
                onPress={handleSaveNewMonth}
              >
                <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                  Simpan & Buka Detail Bulan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                onPress={() => setAddMonthModalVisible(false)}
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Materi Baru (Kurikulum Level 2) */}
      <Modal
        visible={addMateriModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMateriModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                Tambah Materi Belajar
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Tambahkan aktivitas baru ke {selectedMonth?.kode || 'bulan ini'}.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Pekan</Text>
              <View style={styles.chipWrap}>
                {PEKAN_OPTIONS.map((pk) => {
                  const selected = newMateriPekan === pk;
                  return (
                    <TouchableOpacity
                      key={pk}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setNewMateriPekan(pk)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansBold,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {pk}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Judul Materi *
              </Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newMateriTitle}
                onChangeText={(text) => {
                  setNewMateriTitle(text);
                  if (newMateriError) setNewMateriError('');
                }}
                placeholder="Contoh: Menulis Huruf Sambung & Hafalan An-Nas"
                placeholderTextColor={COLORS.textMuted}
              />
              {newMateriError ? (
                <Text style={[styles.errorText, fonts.sansBold]}>
                  {newMateriError}
                </Text>
              ) : null}

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Deskripsi Kegiatan / Media Belajar
              </Text>
              <TextInput
                style={[styles.noteTextInput, fonts.sansRegular]}
                value={newMateriDesc}
                onChangeText={setNewMateriDesc}
                placeholder="Contoh: Menggunakan kartu suku kata bergambar & papan tulis mini"
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
                activeOpacity={0.82}
                onPress={handleSaveNewMateri}
              >
                <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                  Tambahkan ke Daftar Materi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                onPress={() => setAddMateriModalVisible(false)}
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Murid Baru */}
      <Modal
        visible={addStudentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddStudentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                Tambah Kartu Murid Baru
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Buat profil murid lengkap dengan 12 stempel pertemuan.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Nama Murid *
              </Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newStudentName}
                onChangeText={(text) => {
                  setNewStudentName(text);
                  if (newStudentError) setNewStudentError('');
                }}
                placeholder="Contoh: Fatimah Az-Zahra"
                placeholderTextColor={COLORS.textMuted}
              />
              {newStudentError ? (
                <Text style={[styles.errorText, fonts.sansBold]}>
                  {newStudentError}
                </Text>
              ) : null}

              <Text style={[styles.inputLabel, fonts.sansBold]}>Jenjang</Text>
              <View style={styles.chipWrap}>
                {JENJANG_OPTIONS.map((jjg) => {
                  const selected = newStudentJenjang === jjg;
                  return (
                    <TouchableOpacity
                      key={jjg}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setNewStudentJenjang(jjg)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansBold,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {jjg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Program</Text>
              <View style={styles.chipWrap}>
                {PROGRAM_OPTIONS.map((prog) => {
                  const selected = newStudentProgram === prog;
                  return (
                    <TouchableOpacity
                      key={prog}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setNewStudentProgram(prog)}
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansSemi,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {prog}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Pengajar</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newStudentPengajar}
                onChangeText={setNewStudentPengajar}
                placeholder="Nama pengajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Bulan</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newStudentBulan}
                onChangeText={setNewStudentBulan}
                placeholder="Contoh: November 2026"
                placeholderTextColor={COLORS.textMuted}
              />

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                activeOpacity={0.82}
                onPress={handleCreateStudent}
              >
                <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                  Simpan Kartu Murid
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                onPress={() => setAddStudentModalVisible(false)}
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Pratinjau WhatsApp */}
      <Modal
        visible={waPreviewModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setWaPreviewModal({ visible: false, title: '', text: '' })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                {waPreviewModal.title}
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Tujuan: +{WHATSAPP_NUMBER}
              </Text>

              <View style={styles.waPreviewBox}>
                <Text style={[styles.waPreviewText, fonts.sansRegular]}>
                  {waPreviewModal.text}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                activeOpacity={0.82}
                onPress={() => {
                  const textToSend = waPreviewModal.text;
                  setWaPreviewModal({ visible: false, title: '', text: '' });
                  openWhatsAppUrl(textToSend);
                }}
              >
                <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                  Kirim ke WhatsApp Sekarang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                onPress={() =>
                  setWaPreviewModal({ visible: false, title: '', text: '' })
                }
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Tutup
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, fonts.loraBold]}>
              Hapus Profil Murid?
            </Text>
            <Text style={[styles.modalBody, fonts.sansRegular]}>
              Kartu absen milik “{activeStudent.nama || 'Murid Baru'}” akan
              dihapus dari daftar sesi ini.
            </Text>

            <TouchableOpacity
              style={styles.modalDangerBtn}
              activeOpacity={0.82}
              onPress={handleDeleteStudent}
            >
              <Text style={[styles.modalDangerBtnText, fonts.sansBold]}>
                Ya, Hapus Profil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              activeOpacity={0.82}
              onPress={() => setDeleteConfirmVisible(false)}
            >
              <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Informasi Umum */}
      <Modal
        visible={infoModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setInfoModal({ visible: false, title: '', message: '' })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, fonts.loraBold]}>
              {infoModal.title}
            </Text>
            <Text style={[styles.modalBody, fonts.sansRegular]}>
              {infoModal.message}
            </Text>
            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              activeOpacity={0.82}
              onPress={() =>
                setInfoModal({ visible: false, title: '', message: '' })
              }
            >
              <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                Mengerti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.forest,
  },
  screenShell: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 112,
  },
  responsiveColumn: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  tabBody: {
    width: '100%',
  },

  /* Scrapbook / Paper-cut Card */
  paperWrap: {
    position: 'relative',
    paddingRight: 4,
    paddingBottom: 5,
    marginBottom: 16,
  },
  paperBackLayer: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.forest,
  },
  paperFrontCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    padding: 16,
    position: 'relative',
  },
  washiTape: {
    alignSelf: 'center',
    width: 68,
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.tape,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    marginTop: -22,
    marginBottom: 10,
  },

  /* Headers */
  heroBanner: {
    backgroundColor: COLORS.forest,
    paddingHorizontal: 18,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.moss,
  },
  heroInner: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoFrame: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.ivory,
    borderWidth: 1.8,
    borderColor: COLORS.goldBorder,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  heroTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  heroTitle: {
    fontSize: 22,
    color: COLORS.ivory,
  },
  heroTagline: {
    fontSize: 13,
    color: COLORS.goldSoft,
    marginTop: 2,
  },
  tentangHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.ivory,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minHeight: 36,
  },
  tentangHeaderBtnText: {
    fontSize: 12,
    color: COLORS.moss,
  },
  heroGreetingPaper: {
    backgroundColor: COLORS.moss,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 247, 237, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  heroGreetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  heroGreetingText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.cream,
    lineHeight: 19,
  },

  subHeaderBanner: {
    backgroundColor: COLORS.forest,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.moss,
  },
  subHeaderInner: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subLogoFrame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.ivory,
    borderWidth: 1.4,
    borderColor: COLORS.goldBorder,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subLogoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTextCol: {
    flex: 1,
  },
  subHeaderTitle: {
    fontSize: 18,
    color: COLORS.ivory,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.cream,
    marginTop: 1,
  },
  headerStarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldSoft,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  headerStarText: {
    fontSize: 13,
    color: COLORS.moss,
  },
  headerIconPill: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Headings & Helpers */
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.moss,
    marginBottom: 8,
  },
  microLabel: {
    fontSize: 10,
    letterSpacing: 0.9,
    color: COLORS.textMuted,
  },
  cardHeading: {
    fontSize: 16.5,
    color: COLORS.moss,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardTitleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  /* Beranda */
  resetTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.sage,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.forest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  resetTextLabel: {
    fontSize: 12,
    color: COLORS.forest,
  },
  durationSwitchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  durationBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    backgroundColor: COLORS.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 10,
  },
  durationBtnActive: {
    backgroundColor: COLORS.forest,
  },
  durationBtnText: {
    fontSize: 13.5,
    color: COLORS.forest,
  },
  durationBtnTextActive: {
    color: COLORS.ivory,
  },
  sessionProgressRow: {
    marginBottom: 14,
  },
  sessionProgressText: {
    fontSize: 12.5,
    color: COLORS.textBody,
    marginBottom: 6,
  },
  sessionMiniTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.creamDark,
    overflow: 'hidden',
  },
  sessionMiniFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.forest,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  stageItemChecked: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.forest,
  },
  stageCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    backgroundColor: COLORS.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stageCheckboxChecked: {
    backgroundColor: COLORS.forest,
  },
  stageIndexText: {
    fontSize: 12,
    color: COLORS.forest,
  },
  stageContentCol: {
    flex: 1,
  },
  stageTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  stageTitle: {
    fontSize: 14.5,
    color: COLORS.moss,
  },
  stageTitleDone: {
    color: COLORS.forest,
  },
  stageDurationBadge: {
    backgroundColor: COLORS.ivory,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.forest,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stageDurationText: {
    fontSize: 11,
    color: COLORS.forest,
  },
  stageDesc: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  quickCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextCol: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 16.5,
    color: COLORS.moss,
  },
  quickSub: {
    fontSize: 12.5,
    color: COLORS.forest,
    marginTop: 2,
  },
  shortcutDualRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutHalfWrap: {
    flex: 1,
  },
  quickSmallIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.sage,
    borderWidth: 1,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickSmallTitle: {
    fontSize: 15.5,
    color: COLORS.moss,
  },
  quickSmallDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 17,
  },
  aboutShortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutMiniLogoFrame: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.ivory,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutMiniLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  aboutShortcutCol: {
    flex: 1,
  },
  aboutShortcutTitle: {
    fontSize: 16,
    color: COLORS.ivory,
  },
  aboutShortcutDesc: {
    fontSize: 12.5,
    color: COLORS.cream,
    marginTop: 2,
    lineHeight: 18,
  },

  /* Kurikulum Tab */
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.forest,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    minHeight: 40,
    marginBottom: 8,
  },
  addSmallBtnText: {
    fontSize: 12.5,
    color: COLORS.ivory,
  },
  monthCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  monthCodePill: {
    backgroundColor: COLORS.forest,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthCodeText: {
    fontSize: 10.5,
    color: COLORS.ivory,
    letterSpacing: 0.7,
  },
  monthStatsChip: {
    backgroundColor: COLORS.goldSoft,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthStatsText: {
    fontSize: 11.5,
    color: COLORS.moss,
  },
  monthCardTitle: {
    fontSize: 17,
    color: COLORS.moss,
    lineHeight: 24,
    marginBottom: 6,
  },
  monthCardTarget: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 19,
    marginBottom: 12,
  },
  monthCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  predikatSmallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  predikatSmallText: {
    fontSize: 11.5,
    color: COLORS.forest,
  },
  monthOpenCue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  monthOpenCueText: {
    fontSize: 12.5,
    color: COLORS.forest,
  },

  /* Kurikulum Level 2 */
  backToListBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: COLORS.ivory,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 44,
    marginBottom: 14,
  },
  backToListText: {
    fontSize: 13.5,
    color: COLORS.forest,
  },
  monthDetailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  monthDetailTitleCol: {
    flex: 1,
  },
  monthDetailTitle: {
    fontSize: 18,
    color: COLORS.moss,
    lineHeight: 25,
    marginTop: 3,
  },
  monthPctPill: {
    backgroundColor: COLORS.forest,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  monthPctPillText: {
    fontSize: 14,
    color: COLORS.ivory,
  },
  targetEditInput: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 13,
    paddingVertical: 11,
    minHeight: 74,
    fontSize: 13.5,
    color: COLORS.moss,
    lineHeight: 20,
  },
  materiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  pekanBadge: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.forest,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pekanBadgeText: {
    fontSize: 11.5,
    color: COLORS.moss,
  },
  materiStatusTag: {
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  materiStatusTagDone: {
    backgroundColor: COLORS.forest,
  },
  materiStatusTagPending: {
    backgroundColor: COLORS.goldSoft,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  materiStatusTagText: {
    fontSize: 11,
    color: COLORS.moss,
  },
  materiJudul: {
    fontSize: 16,
    color: COLORS.moss,
    marginBottom: 4,
  },
  materiDesc: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 19,
    marginBottom: 12,
  },
  materiCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    backgroundColor: COLORS.cream,
    paddingHorizontal: 14,
  },
  materiCheckBtnActive: {
    backgroundColor: COLORS.forest,
  },
  materiCheckBtnText: {
    fontSize: 13,
    color: COLORS.forest,
  },
  materiCheckBtnTextActive: {
    color: COLORS.ivory,
  },
  predikatCol: {
    gap: 8,
    marginBottom: 12,
  },
  predikatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cream,
    borderRadius: 13,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  predikatBtnActive: {
    backgroundColor: COLORS.forest,
  },
  predikatBtnText: {
    fontSize: 13.5,
    color: COLORS.moss,
  },
  predikatBtnTextActive: {
    color: COLORS.ivory,
  },

  /* Kartu Absen */
  memberSwitchScroll: {
    paddingBottom: 14,
    gap: 10,
  },
  memberPill: {
    backgroundColor: COLORS.ivory,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 152,
  },
  memberPillActive: {
    backgroundColor: COLORS.forest,
  },
  memberPillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  memberPillName: {
    fontSize: 13.5,
    color: COLORS.moss,
  },
  memberPillNameActive: {
    color: COLORS.ivory,
  },
  memberJenjangChip: {
    backgroundColor: COLORS.sage,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  memberJenjangChipActive: {
    backgroundColor: COLORS.goldSoft,
  },
  memberJenjangText: {
    fontSize: 10.5,
    color: COLORS.forest,
  },
  memberJenjangTextActive: {
    color: COLORS.moss,
  },
  memberPillCount: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  memberPillCountActive: {
    color: COLORS.cream,
  },

  memberCardTopBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  memberCardBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  memberCardLogoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cream,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCardLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  memberCardOrg: {
    fontSize: 13,
    color: COLORS.forest,
    letterSpacing: 0.6,
  },
  memberCardLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.9,
  },
  memberCardBadge: {
    backgroundColor: COLORS.forest,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  memberCardBadgeText: {
    fontSize: 12,
    color: COLORS.ivory,
  },
  memberCardDivider: {
    height: 1,
    backgroundColor: COLORS.sageDark,
    marginVertical: 12,
  },
  memberCardName: {
    fontSize: 20,
    color: COLORS.moss,
    marginBottom: 10,
  },
  memberCardMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  memberCardMetaItem: {
    width: '47%',
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaKey: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  metaVal: {
    fontSize: 13,
    color: COLORS.moss,
    marginTop: 2,
  },
  metaValAccent: {
    fontSize: 13,
    color: COLORS.forest,
    marginTop: 2,
  },
  memberCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  editProfileToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS.sage,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.forest,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  editProfileToggleText: {
    fontSize: 13,
    color: COLORS.forest,
  },
  deleteProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.dangerText,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  deleteProfileBtnText: {
    fontSize: 12.5,
    color: COLORS.dangerText,
  },
  inlineProfileForm: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.sageDark,
  },

  inputLabel: {
    fontSize: 12.5,
    color: COLORS.moss,
    marginBottom: 6,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 13,
    paddingVertical: 10,
    minHeight: 46,
    fontSize: 14,
    color: COLORS.moss,
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  bulanScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  choiceChip: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.forest,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 38,
    justifyContent: 'center',
  },
  choiceChipActive: {
    backgroundColor: COLORS.forest,
  },
  choiceChipText: {
    fontSize: 12.5,
    color: COLORS.moss,
  },
  choiceChipTextActive: {
    color: COLORS.ivory,
  },

  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  progressTitleCol: {
    flex: 1,
  },
  progressBadge: {
    backgroundColor: COLORS.forest,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  progressBadgeText: {
    fontSize: 13,
    color: COLORS.ivory,
  },
  progressLabelLine: {
    fontSize: 12.5,
    color: COLORS.forest,
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ivory,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.forest,
    borderRadius: 5,
  },

  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ticketCell: {
    width: '31.8%',
    backgroundColor: COLORS.ivory,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.sageDark,
    paddingVertical: 9,
    paddingHorizontal: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  ticketCellHadir: {
    borderColor: COLORS.forest,
    backgroundColor: COLORS.cream,
  },
  ticketNoText: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  circularStamp: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circularStampEmpty: {
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.forest,
  },
  circularStampHadir: {
    backgroundColor: COLORS.forest,
    borderWidth: 2,
    borderColor: COLORS.moss,
  },
  stampNumberText: {
    fontSize: 18,
    color: COLORS.forest,
  },
  stampCapText: {
    fontSize: 9,
    color: COLORS.ivory,
    letterSpacing: 0.7,
    marginTop: 1,
  },
  ticketDateLabel: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  ticketDateLabelHadir: {
    color: COLORS.moss,
  },

  noteCardItem: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    padding: 12,
    marginBottom: 12,
  },
  noteCardItemHadir: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.forest,
  },
  noteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  noteTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteRoundNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.ivory,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteRoundNumHadir: {
    backgroundColor: COLORS.forest,
  },
  noteRoundNumText: {
    fontSize: 12.5,
    color: COLORS.forest,
  },
  noteRoundNumTextHadir: {
    color: COLORS.ivory,
  },
  noteItemTitle: {
    fontSize: 14,
    color: COLORS.moss,
  },
  noteStampBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.ivory,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.forest,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  noteStampBtnHadir: {
    backgroundColor: COLORS.forest,
  },
  noteStampBtnText: {
    fontSize: 11.5,
    color: COLORS.forest,
  },
  noteStampBtnTextHadir: {
    color: COLORS.ivory,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: COLORS.ivory,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagChipActive: {
    backgroundColor: COLORS.forest,
    borderColor: COLORS.forest,
  },
  tagChipText: {
    fontSize: 11.5,
    color: COLORS.textBody,
  },
  tagChipTextActive: {
    color: COLORS.ivory,
  },
  noteTextInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 58,
    fontSize: 13.5,
    color: COLORS.moss,
    lineHeight: 20,
  },

  waHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  waIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waHeaderTextCol: {
    flex: 1,
  },
  waPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: COLORS.forest,
    borderRadius: 15,
    minHeight: 54,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  waPrimaryBtnText: {
    fontSize: 14,
    color: COLORS.ivory,
    textAlign: 'center',
  },
  waPreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.ivory,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  waPreviewBtnText: {
    fontSize: 13.5,
    color: COLORS.forest,
  },

  /* Saktah Play */
  playModePillWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.creamDark,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    padding: 4,
    gap: 6,
    marginBottom: 16,
  },
  playModeBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 10,
  },
  playModeBtnActive: {
    backgroundColor: COLORS.forest,
  },
  playModeBtnText: {
    fontSize: 13.5,
    color: COLORS.moss,
  },
  playModeBtnTextActive: {
    color: COLORS.ivory,
  },
  playIntroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  playIntroTextCol: {
    flex: 1,
  },
  filterPill: {
    backgroundColor: COLORS.ivory,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: COLORS.forest,
  },
  filterPillText: {
    fontSize: 13,
    color: COLORS.moss,
  },
  filterPillTextActive: {
    color: COLORS.ivory,
  },

  foldFrontTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foldIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.goldSoft,
    borderWidth: 1.2,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foldFrontTextCol: {
    flex: 1,
  },
  foldBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  foldCategoryChip: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  foldCategoryText: {
    fontSize: 10.5,
    color: COLORS.forest,
  },
  foldDoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.forest,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  foldDoneText: {
    fontSize: 10.5,
    color: COLORS.ivory,
  },
  foldTitle: {
    fontSize: 16,
    color: COLORS.moss,
  },
  foldTeaser: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  foldChevronBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foldInnerPanel: {
    marginTop: 12,
  },
  foldDivider: {
    height: 1,
    backgroundColor: COLORS.sageDark,
    marginBottom: 12,
  },
  foldSectionLabel: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  foldLatinText: {
    fontSize: 15.5,
    color: COLORS.forest,
    lineHeight: 23,
    marginBottom: 12,
  },
  foldMeaningText: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeBox: {
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.forest,
    padding: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  challengeLabel: {
    fontSize: 11,
    color: COLORS.forest,
    letterSpacing: 0.6,
  },
  challengeText: {
    fontSize: 13.5,
    color: COLORS.moss,
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 12,
  },
  challengeBtnDone: {
    backgroundColor: COLORS.forest,
  },
  challengeBtnText: {
    fontSize: 13,
    color: COLORS.forest,
  },
  challengeBtnTextDone: {
    color: COLORS.ivory,
  },

  /* Quiz */
  quizTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quizProgressLabel: {
    fontSize: 14,
    color: COLORS.moss,
  },
  quizStarCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.goldSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  quizStarCounterText: {
    fontSize: 13,
    color: COLORS.moss,
  },
  quizTenStarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  miniStarNode: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: COLORS.ivory,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStarNodeCurrent: {
    borderColor: COLORS.forest,
    borderWidth: 1.8,
  },
  miniStarNodeRight: {
    backgroundColor: COLORS.goldSoft,
    borderColor: COLORS.gold,
  },
  miniStarNodeWrong: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerText,
  },
  miniStarNum: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.sage,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  levelBadgeText: {
    fontSize: 11.5,
    color: COLORS.forest,
  },
  questionText: {
    fontSize: 17.5,
    color: COLORS.moss,
    lineHeight: 26,
    marginBottom: 16,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 56,
    marginBottom: 10,
    gap: 12,
  },
  quizOptionLetter: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionLetterText: {
    fontSize: 13.5,
    color: COLORS.ivory,
  },
  quizOptionLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  quizFeedbackCard: {
    borderRadius: 14,
    borderWidth: 1.2,
    padding: 14,
    marginTop: 6,
  },
  quizFeedbackRight: {
    backgroundColor: COLORS.sage,
    borderColor: COLORS.forest,
  },
  quizFeedbackTryAgain: {
    backgroundColor: COLORS.goldSoft,
    borderColor: COLORS.goldBorder,
  },
  quizFeedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  quizFeedbackHeading: {
    fontSize: 14.5,
    color: COLORS.moss,
  },
  quizFeedbackBody: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 19,
    marginBottom: 12,
  },
  quizPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.forest,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 16,
    width: '100%',
  },
  quizPrimaryBtnText: {
    fontSize: 14.5,
    color: COLORS.ivory,
  },
  quizSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    minHeight: 48,
    paddingHorizontal: 16,
    width: '100%',
    marginTop: 10,
  },
  quizSecondaryBtnText: {
    fontSize: 14,
    color: COLORS.forest,
  },

  /* Certificate */
  certContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  certTopRibbon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: COLORS.goldSoft,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  certOrgTag: {
    fontSize: 10.5,
    letterSpacing: 1,
    color: COLORS.forest,
    marginBottom: 6,
  },
  certHeadline: {
    fontSize: 21,
    color: COLORS.moss,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 6,
  },
  certRecipient: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  certStarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 14,
  },
  certStarChip: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certStarChipEarned: {
    backgroundColor: COLORS.goldSoft,
    borderColor: COLORS.goldBorder,
  },
  certStarChipEmpty: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.sageDark,
  },
  certMessage: {
    fontSize: 13.5,
    color: COLORS.textBody,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },

  /* Halaman Tentang */
  aboutHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  aboutLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: COLORS.forest,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutLogoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  aboutHeroCol: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 20,
    color: COLORS.moss,
  },
  aboutSub: {
    fontSize: 13,
    color: COLORS.forest,
    marginTop: 2,
  },
  aboutQuote: {
    fontSize: 14.5,
    color: COLORS.textBody,
    lineHeight: 22,
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    padding: 13,
  },
  philosophyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  philosophyIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.ivory,
    borderWidth: 1,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  philosophyTextCol: {
    flex: 1,
  },
  philosophyTitle: {
    fontSize: 15,
    color: COLORS.moss,
    marginBottom: 2,
  },
  philosophyDesc: {
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 19,
  },
  consultTitle: {
    fontSize: 18,
    color: COLORS.ivory,
    marginBottom: 4,
  },
  consultDesc: {
    fontSize: 13,
    color: COLORS.cream,
    lineHeight: 19,
    marginBottom: 14,
  },
  consultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.ivory,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  consultBtnText: {
    fontSize: 13.5,
    color: COLORS.forest,
  },

  /* Floating Bottom Bar */
  floatingDockOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'android' ? 14 : 12,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  floatingPillWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 540,
    paddingRight: 3,
    paddingBottom: 4,
  },
  floatingPillBackLayer: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: COLORS.forest,
  },
  floatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.moss,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.forest,
    padding: 6,
    gap: 4,
  },
  floatingTabItem: {
    flex: 1,
    minHeight: 52,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  floatingTabItemActive: {
    backgroundColor: COLORS.ivory,
  },
  floatingTabLabel: {
    fontSize: 11,
    color: COLORS.cream,
    marginTop: 3,
    textAlign: 'center',
  },
  floatingTabLabelActive: {
    color: COLORS.moss,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '86%',
    backgroundColor: COLORS.ivory,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.forest,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18.5,
    color: COLORS.moss,
  },
  modalSub: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 14,
  },
  modalPrimaryBtn: {
    backgroundColor: COLORS.forest,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  modalPrimaryBtnText: {
    fontSize: 14.5,
    color: COLORS.ivory,
  },
  modalDangerBtn: {
    backgroundColor: COLORS.dangerText,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  modalDangerBtnText: {
    fontSize: 14.5,
    color: COLORS.white,
  },
  modalSecondaryBtn: {
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalSecondaryBtnText: {
    fontSize: 14,
    color: COLORS.moss,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.dangerText,
    marginTop: -4,
    marginBottom: 10,
  },
  waPreviewBox: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.sageDark,
    padding: 12,
    marginBottom: 14,
  },
  waPreviewText: {
    fontSize: 13,
    color: COLORS.moss,
    lineHeight: 20,
  },
});
