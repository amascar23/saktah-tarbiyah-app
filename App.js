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
  sageDark: '#cfd8c2',
  textPrimary: '#131b15',
  textBody: '#28382b',
  textMuted: '#536656',
  gold: '#c88d21',
  goldSoft: '#fbf1d4',
  goldBorder: '#dfc176',
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

const PENGAJAR_OPTIONS = ['Kak Rahma', 'Ustadzah Nisa', 'Kak Fahmi'];

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

const SESI_TEMPLATES = {
  60: [
    {
      id: 'ice',
      judul: 'Ice Breaking & Doa',
      durasi: '10 Menit',
      ikon: 'sunny-outline',
      deskripsi: 'Sapaan hangat, senam jari ceria, dan doa sebelum belajar.',
    },
    {
      id: 'inti',
      judul: 'Inti Calistung / Tematik',
      durasi: '30 Menit',
      ikon: 'book-outline',
      deskripsi: 'Materi utama membaca, menulis, berhitung, atau mengaji Iqra.',
    },
    {
      id: 'jeda',
      judul: 'Jeda Cerita / Istirahat',
      durasi: '10 Menit',
      ikon: 'cafe-outline',
      deskripsi: 'Kisah adab ringan, minum air, dan peregangan tubuh sejenak.',
    },
    {
      id: 'eval',
      judul: 'Evaluasi Bintang',
      durasi: '10 Menit',
      ikon: 'star-outline',
      deskripsi: 'Apresiasi bintang, penguatan 1 hal baru, dan doa penutup.',
    },
  ],
  90: [
    {
      id: 'ice',
      judul: 'Ice Breaking & Doa',
      durasi: '15 Menit',
      ikon: 'sunny-outline',
      deskripsi: 'Koneksi hati anak, murojaah ringan, dan doa sebelum belajar.',
    },
    {
      id: 'inti',
      judul: 'Inti Calistung / Tematik',
      durasi: '45 Menit',
      ikon: 'book-outline',
      deskripsi: 'Pendampingan terpadu Calistung, Iqra/Tahsin, & tugas sekolah.',
    },
    {
      id: 'jeda',
      judul: 'Jeda Cerita / Istirahat',
      durasi: '15 Menit',
      ikon: 'cafe-outline',
      deskripsi: 'Membuka Kartu Lipat Doa & Adab serta istirahat santai.',
    },
    {
      id: 'eval',
      judul: 'Evaluasi Bintang',
      durasi: '15 Menit',
      ikon: 'star-outline',
      deskripsi: 'Kuis Bintang Ceria, cap stempel hadir, dan catatan orang tua.',
    },
  ],
};

const PILAR_PROGRAM = [
  {
    id: 'calistung',
    ikon: 'edit-3',
    judul: 'Calistung & Tematik',
    subjudul: 'TK & SD • Tempo Tenang',
    bgVariant: 'ivory',
    ringkasan:
      'Membangun fondasi membaca, menulis rapi, berhitung konkret, dan pendampingan tugas tematik sekolah tanpa tergesa.',
    poin: [
      'Membaca suku kata dan kalimat bertahap dengan kartu visual ramah anak.',
      'Latihan menulis rapi dan berhitung menggunakan benda di sekitar.',
      'Pendampingan tematik SD dengan pendekatan diskusi ringan.',
    ],
    target: 'Anak tumbuh percaya diri dan nyaman saat belajar mandiri.',
  },
  {
    id: 'iqra',
    ikon: 'book-open',
    judul: 'Mengaji Iqra & Tahsin',
    subjudul: 'Huruf Hijaiyah & Tartil',
    bgVariant: 'sage',
    ringkasan:
      'Mengenalkan huruf hijaiyah, makhraj yang tepat, panjang-pendek bacaan, serta hafalan surat pendek juz 30.',
    poin: [
      'Pelafalan makharijul huruf yang jelas dan berulang dengan sabar.',
      'Pemahaman harakat, mad thabi’i, sukun, dan tasydid secara bertahap.',
      'Pembiasaan tilawah tenang sebelum atau sesudah sesi belajar.',
    ],
    target: 'Anak mencintai Al-Qur’an dan terbiasa membaca dengan tartil.',
  },
  {
    id: 'adab',
    ikon: 'heart',
    judul: 'Adab & Doa Harian',
    subjudul: 'Karakter & Kebiasaan Baik',
    bgVariant: 'ivory',
    ringkasan:
      'Membiasakan doa sehari-hari, adab kepada orang tua dan guru, serta tata krama berbicara lembut di setiap pertemuan.',
    poin: [
      'Hafalan doa harian lengkap dengan arti lembut yang mudah dipahami.',
      'Praktik langsung kata tolong, maaf, terima kasih, dan jujur.',
      'Kebiasaan merapikan alat belajar sebagai latihan tanggung jawab.',
    ],
    target: 'Ilmu yang dipelajari berakar kuat pada akhlak mulia.',
  },
];

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
    level: 'Level 1 • Calistung',
    pertanyaan:
      'Di keranjang ada 3 apel merah dan 2 apel hijau. Berapa jumlah seluruh apel di keranjang?',
    pilihan: ['4 apel', '5 apel', '6 apel', '7 apel'],
    jawabanBenar: 1,
    penjelasan: '3 apel merah + 2 apel hijau = 5 apel.',
  },
  {
    id: 2,
    level: 'Level 1 • Tebak Kata',
    pertanyaan:
      'Susunan suku kata “bu - ku” jika dibaca bersambung menjadi kata...',
    pilihan: ['baku', 'kuku', 'buku', 'batu'],
    jawabanBenar: 2,
    penjelasan: 'Suku kata “bu” ditambah “ku” dibaca “buku”.',
  },
  {
    id: 3,
    level: 'Level 1 • Doa Harian',
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
    level: 'Level 2 • Adab Anak',
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
    level: 'Level 2 • Berhitung Benda',
    pertanyaan:
      'Zaid memiliki 8 kelereng. Sebanyak 3 kelereng diberikan kepada adiknya. Sisa kelereng Zaid adalah...',
    pilihan: ['4 kelereng', '5 kelereng', '6 kelereng', '7 kelereng'],
    jawabanBenar: 1,
    penjelasan: '8 kelereng dikurangi 3 kelereng = 5 kelereng.',
  },
  {
    id: 6,
    level: 'Level 2 • Tebak Huruf & Kata',
    pertanyaan:
      'Kata berikut yang diawali dengan huruf “S” dan berarti tempat belajar yang tenang adalah...',
    pilihan: ['Rumah', 'Saktah', 'Taman', 'Pasar'],
    jawabanBenar: 1,
    penjelasan: '“Saktah” diawali huruf S dan berarti jeda tenang.',
  },
  {
    id: 7,
    level: 'Level 2 • Adab Makan',
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
    level: 'Level 3 • Berhitung Cerita',
    pertanyaan:
      'Setiap hari Senin dan Rabu, Aisyah membaca 6 halaman Iqra. Berapa total halaman yang dibaca dalam 2 hari itu?',
    pilihan: ['10 halaman', '11 halaman', '12 halaman', '14 halaman'],
    jawabanBenar: 2,
    penjelasan: '6 halaman + 6 halaman = 12 halaman.',
  },
  {
    id: 9,
    level: 'Level 3 • Doa & Makna',
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
    level: 'Level 3 • Tebak Kata & Adab',
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
      pengajar: 'Ustadzah Nisa',
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
      pengajar: 'Kak Rahma',
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

function buildWhatsAppReport(student) {
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
    '*SAKTAH TARBIYAH — LAPORAN PERKEMBANGAN BELAJAR*',
    '----------------------------------------',
    `Nama Murid : ${nama} (${jenjang})`,
    `Program    : ${program}`,
    `Pengajar   : ${pengajar}`,
    `Periode    : ${bulan}`,
    `Capaian    : ${totalHadir} / 12 Pertemuan Tercapai`,
    '',
  ];

  if (latestMeeting) {
    lines.push('*Sorotan Pertemuan Terbaru:*');
    const dateInfo = latestMeeting.tanggal ? ` (${latestMeeting.tanggal})` : '';
    const statusText = latestMeeting.hadir ? 'Hadir' : 'Catatan Tersimpan';
    lines.push(`Pertemuan ke-${latestMeeting.nomor}${dateInfo} • ${statusText}`);
    lines.push(
      latestMeeting.catatan.trim() || 'Ananda mengikuti sesi dengan tenang dan antusias.'
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
    'Terima kasih atas kebersamaan Ayah & Bunda mendampingi ananda di rumah. Wassalamu’alaikum warahmatullahi wabarakatuh.'
  );

  return lines.join('\n');
}

function PaperCard({
  children,
  variant = 'ivory',
  style,
  layerColor = COLORS.sageDark,
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

  const [activeTab, setActiveTab] = useState('beranda');

  // Beranda: Alur Sesi Belajar Hari Ini
  const [sessionDuration, setSessionDuration] = useState(60); // 60 | 90
  const [checkedStages, setCheckedStages] = useState({
    ice: true,
    inti: false,
    jeda: false,
    eval: false,
  });
  const [selectedPilar, setSelectedPilar] = useState(null);

  // Kartu Absen: Multi-Murid
  const [students, setStudents] = useState(createInitialStudents);
  const [activeStudentId, setActiveStudentId] = useState('murid-1');
  const [profileFormOpen, setProfileFormOpen] = useState(true);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newJenjang, setNewJenjang] = useState('TK');
  const [newProgram, setNewProgram] = useState(PROGRAM_OPTIONS[0]);
  const [newPengajar, setNewPengajar] = useState(PENGAJAR_OPTIONS[0]);
  const [newBulan, setNewBulan] = useState(BULAN_OPTIONS[0]);
  const [newNameError, setNewNameError] = useState('');

  const [waPreviewVisible, setWaPreviewVisible] = useState(false);
  const [waPreviewText, setWaPreviewText] = useState('');
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

  const androidTopInset =
    Platform.OS === 'android' ? RNStatusBar.currentHeight || 28 : 0;

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

  const handleOpenAddModal = () => {
    setNewName('');
    setNewJenjang('TK');
    setNewProgram(PROGRAM_OPTIONS[0]);
    setNewPengajar(PENGAJAR_OPTIONS[0]);
    setNewBulan(BULAN_OPTIONS[0]);
    setNewNameError('');
    setAddModalVisible(true);
  };

  const handleCreateStudent = () => {
    if (!newName.trim()) {
      setNewNameError('Mohon isi nama murid terlebih dahulu.');
      return;
    }
    const id = `murid-${Date.now()}`;
    const created = {
      id,
      nama: newName.trim(),
      jenjang: newJenjang,
      program: newProgram.trim() || PROGRAM_OPTIONS[0],
      pengajar: newPengajar.trim() || PENGAJAR_OPTIONS[0],
      bulan: newBulan.trim() || BULAN_OPTIONS[0],
      pertemuan: createInitialPertemuan(),
    };
    setStudents((prev) => [...prev, created]);
    setActiveStudentId(id);
    setAddModalVisible(false);
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
          'Pastikan aplikasi WhatsApp atau peramban tersedia di perangkat Anda. Anda tetap dapat menyalin isi laporan melalui tombol Pratinjau.',
      });
    }
  };

  const handleSendAttendanceReport = () => {
    if (!activeStudent.nama.trim()) {
      setInfoModal({
        visible: true,
        title: 'Nama Murid Masih Kosong',
        message:
          'Isi Nama Murid pada Kartu Profil terlebih dahulu sebelum mengirim laporan.',
      });
      return;
    }
    openWhatsAppUrl(buildWhatsAppReport(activeStudent));
  };

  const handleOpenReportPreview = () => {
    setWaPreviewText(buildWhatsAppReport(activeStudent));
    setWaPreviewVisible(true);
  };

  const handleConsultWhatsApp = () => {
    const pesan = [
      'Assalamu’alaikum Kak Admin Saktah Tarbiyah,',
      'Saya ingin berkonsultasi mengenai jadwal & pendaftaran kelas privat untuk ananda.',
      '',
      'Nama Orang Tua / Anak:',
      'Jenjang (TK/SD):',
      'Program yang diminati:',
    ].join('\n');
    openWhatsAppUrl(pesan);
  };

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

  const renderTopBanner = () => {
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
            </View>

            <View style={styles.heroGreetingPaper}>
              <View style={styles.heroGreetingRow}>
                <Ionicons
                  name="leaf-outline"
                  size={18}
                  color={COLORS.goldSoft}
                />
                <Text style={[styles.heroGreetingText, fonts.sansRegular]}>
                  Pendampingan lembut TK & SD bersama pengajar dan orang tua
                  dalam ilmu, adab, serta keceriaan.
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    const headerMeta = {
      absen: {
        title: 'Kartu Absen Murid',
        subtitle: 'Stempel 12 Pertemuan & Laporan Orang Tua',
        icon: 'calendar-outline',
      },
      play: {
        title: 'Saktah Play',
        subtitle: 'Kartu Lipat Doa & Kuis Bintang Ceria',
        icon: 'sparkles-outline',
      },
      tentang: {
        title: 'Tentang Saktah Tarbiyah',
        subtitle: 'Filosofi Belajar, Jadwal & Konsultasi',
        icon: 'leaf-outline',
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

  const renderBerandaTab = () => {
    const stages = SESI_TEMPLATES[sessionDuration];
    const completedStages = stages.filter((s) => checkedStages[s.id]).length;
    const activeHadir = countHadir(activeStudent);

    return (
      <View style={styles.tabBody}>
        {/* Strip Murid Aktif */}
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => setActiveTab('absen')}
        >
          <PaperCard variant="sage" layerColor={COLORS.forest}>
            <View style={styles.activeStudentStrip}>
              <View style={styles.activeStudentIconBox}>
                <Feather name="users" size={20} color={COLORS.forest} />
              </View>
              <View style={styles.activeStudentInfo}>
                <Text style={[styles.microLabel, fonts.sansBold]}>
                  PROFIL AKTIF DI KARTU ABSEN
                </Text>
                <Text style={[styles.activeStudentName, fonts.loraBold]}>
                  {activeStudent.nama} ({activeStudent.jenjang})
                </Text>
                <Text style={[styles.activeStudentMeta, fonts.sansSemi]}>
                  {activeHadir} / 12 Pertemuan Tercapai • {activeStudent.program}
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={COLORS.forest}
              />
            </View>
          </PaperCard>
        </TouchableOpacity>

        {/* Alur Sesi Belajar Hari Ini */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Alur Sesi Belajar Hari Ini
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

        <PaperCard variant="ivory" layerColor={COLORS.moss}>
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
                    Mode {minutes} Menit
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sessionProgressRow}>
            <Text style={[styles.sessionProgressText, fonts.sansSemi]}>
              Progres Mengajar: {completedStages} / {stages.length} Tahap Selesai
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

        {/* Ringkasan 3 Pilar Program */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            3 Pilar Program Belajar
          </Text>
          <Text style={[styles.sectionHint, fonts.sansSemi]}>
            Ketuk kartu untuk detail
          </Text>
        </View>

        {PILAR_PROGRAM.map((pilar) => (
          <TouchableOpacity
            key={pilar.id}
            activeOpacity={0.84}
            onPress={() => setSelectedPilar(pilar)}
          >
            <PaperCard
              variant={pilar.bgVariant}
              layerColor={
                pilar.bgVariant === 'sage' ? COLORS.forest : COLORS.sageDark
              }
            >
              <View style={styles.pilarTopRow}>
                <View style={styles.pilarIconFrame}>
                  <Feather name={pilar.ikon} size={20} color={COLORS.forest} />
                </View>
                <View style={styles.pilarTitleCol}>
                  <Text style={[styles.pilarTitle, fonts.loraBold]}>
                    {pilar.judul}
                  </Text>
                  <Text style={[styles.pilarSub, fonts.sansSemi]}>
                    {pilar.subjudul}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.forest}
                />
              </View>
              <Text style={[styles.pilarDesc, fonts.sansRegular]}>
                {pilar.ringkasan}
              </Text>
            </PaperCard>
          </TouchableOpacity>
        ))}

        {/* Tombol Pintas ke Saktah Play */}
        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => setActiveTab('play')}
        >
          <PaperCard variant="forest" layerColor={COLORS.moss}>
            <View style={styles.ctaBannerRow}>
              <View style={styles.ctaBannerIcon}>
                <Ionicons name="sparkles" size={22} color={COLORS.forest} />
              </View>
              <View style={styles.ctaBannerTextCol}>
                <Text style={[styles.ctaBannerTitle, fonts.loraBold]}>
                  Ajak Ananda Main di Saktah Play
                </Text>
                <Text style={[styles.ctaBannerSub, fonts.sansRegular]}>
                  Kartu Lipat Doa & Adab serta 10 soal Kuis Bintang Ceria.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={COLORS.ivory} />
            </View>
          </PaperCard>
        </TouchableOpacity>
      </View>
    );
  };

  const renderKartuAbsenTab = () => {
    const totalHadir = countHadir(activeStudent);
    const pct = Math.round((totalHadir / 12) * 100);

    return (
      <View style={styles.tabBody}>
        {/* Bar Pemilihan Multi-Murid */}
        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Daftar Murid
          </Text>
          <TouchableOpacity
            style={styles.addMemberBtn}
            activeOpacity={0.82}
            onPress={handleOpenAddModal}
          >
            <Ionicons name="person-add-outline" size={16} color={COLORS.ivory} />
            <Text style={[styles.addMemberBtnText, fonts.sansBold]}>
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

        {/* Kartu Profil Murid Bergaya Kartu Anggota Fisik */}
        <PaperCard variant="ivory" layerColor={COLORS.moss}>
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
                  KARTU ANGGOTA BELAJAR
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

          <View style={styles.memberCardBody}>
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
                placeholder="Nama Kakak Pengajar / Ustadzah"
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

        {/* Grid 12 Pertemuan Stempel / Tiket Melingkar */}
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.progressHeaderRow}>
            <View style={styles.progressTitleCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Stempel Kehadiran 12 Pertemuan
              </Text>
              <Text style={[styles.cardSubtext, fonts.sansRegular]}>
                Ketuk tiket melingkar untuk mengecap hadir & tanggal otomatis
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
                  <View style={styles.ticketNotchRow}>
                    <Text style={[styles.ticketNoText, fonts.sansBold]}>
                      TIKET {item.nomor}
                    </Text>
                  </View>

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

        {/* Catatan Perkembangan & Capaian Anak (1-12) */}
        <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
          <Text style={[styles.cardHeading, fonts.loraBold]}>
            Catatan Perkembangan & Capaian Anak
          </Text>
          <Text style={[styles.cardSubtext, fonts.sansRegular]}>
            Ketuk tag cepat di setiap pertemuan untuk mencatat capaian dengan
            praktis.
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
                placeholder={`Tulis capaian & catatan kecil pertemuan ${item.nomor}...`}
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}
        </PaperCard>

        {/* Kirim Laporan Estetik ke WhatsApp */}
        <PaperCard variant="sage" layerColor={COLORS.moss}>
          <View style={styles.waHeaderRow}>
            <View style={styles.waIconBadge}>
              <Ionicons name="logo-whatsapp" size={22} color={COLORS.ivory} />
            </View>
            <View style={styles.waHeaderTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Laporan untuk Orang Tua
              </Text>
              <Text style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}>
                Rangkuman kehadiran ({totalHadir}/12) & catatan terbaru siap
                dikirim.
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
              Kirim Laporan Estetik ke WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.waPreviewBtn}
            activeOpacity={0.82}
            onPress={handleOpenReportPreview}
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.forest} />
            <Text style={[styles.waPreviewBtnText, fonts.sansBold]}>
              Pratinjau Pesan Laporan
            </Text>
          </TouchableOpacity>
        </PaperCard>
      </View>
    );
  };

  const renderKartuLipatSection = () => {
    const filteredCards =
      doaFilter === 'Semua'
        ? DOA_ADAB_CARDS
        : DOA_ADAB_CARDS.filter((item) => item.kategori === doaFilter);

    return (
      <View>
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.playIntroRow}>
            <Feather name="book-open" size={22} color={COLORS.forest} />
            <View style={styles.playIntroTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Kartu Lipat Doa & Adab
              </Text>
              <Text style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}>
                Ketuk kartu untuk membuka lipatan lafaz latin, arti lembut, dan
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
                          Selesai
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
                    LAFAZ LATIN
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
                        TANTANGAN PRAKTIK BAIK HARI INI
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
          'Luar biasa teliti dalam berhitung, membaca kata, adab, dan doa harian!';
      } else if (quizStarCount >= 5) {
        subtitleCert =
          'Kemajuan yang bagus sekali! Sedikit latihan lagi semua bintang akan penuh.';
      }

      return (
        <Animated.View style={{ transform: [{ scale: certScale }] }}>
          <PaperCard variant="ivory" layerColor={COLORS.moss}>
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
                Diberikan untuk {activeStudent.nama || 'Sahabat Saktah'}
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

  const renderTentangTab = () => {
    return (
      <View style={styles.tabBody}>
        {/* Kartu Identitas & Filosofi */}
        <PaperCard variant="ivory" layerColor={COLORS.moss}>
          <View style={styles.aboutHeroRow}>
            <View style={styles.aboutLogoFrame}>
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
                Belajar Tanpa Tergesa, Hangat & Ramah Anak
              </Text>
            </View>
          </View>

          <Text style={[styles.aboutQuote, fonts.loraSemi]}>
            “Seperti arti kata saktah—jeda sejenak untuk mengambil napas dengan
            tenang—kami percaya setiap anak bertumbuh paling baik dalam ruang
            yang sabar, hangat, dan penuh kasih.”
          </Text>
        </PaperCard>

        {/* Filosofi Belajar */}
        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          Filosofi Pendampingan
        </Text>
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.philosophyItem}>
            <View style={styles.philosophyIcon}>
              <Ionicons name="leaf-outline" size={20} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Menghargai Ritme Unik Anak
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Pendekatan belajar TK & SD disesuaikan dengan kesiapan emosi dan
                daya serap tiap anak, tanpa membanding-bandingkan.
              </Text>
            </View>
          </View>

          <View style={styles.philosophyItem}>
            <View style={styles.philosophyIcon}>
              <Ionicons name="heart-outline" size={20} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Adab Lebih Dahulu Sebelum Ilmu
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Pembiasaan doa, berkata lembut, dan kemandirian disisipkan alami
                dalam setiap pertemuan Calistung maupun Mengaji.
              </Text>
            </View>
          </View>

          <View style={[styles.philosophyItem, { marginBottom: 0 }]}>
            <View style={styles.philosophyIcon}>
              <Feather name="users" size={19} color={COLORS.forest} />
            </View>
            <View style={styles.philosophyTextCol}>
              <Text style={[styles.philosophyTitle, fonts.loraBold]}>
                Jembatan Hangat dengan Orang Tua
              </Text>
              <Text style={[styles.philosophyDesc, fonts.sansRegular]}>
                Setiap 12 pertemuan dicatat rapi dalam Kartu Absen agar Ayah &
                Bunda terus terhubung dengan perkembangan ananda.
              </Text>
            </View>
          </View>
        </PaperCard>

        {/* Informasi Jadwal Kelas Privat */}
        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          Jadwal Kelas Privat
        </Text>
        <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleBadge}>
              <Feather name="clock" size={16} color={COLORS.ivory} />
              <Text style={[styles.scheduleBadgeText, fonts.sansBold]}>
                60 Menit
              </Text>
            </View>
            <View style={styles.scheduleInfoCol}>
              <Text style={[styles.scheduleTitle, fonts.sansBold]}>
                Sesi Fokus TK / PAUD / Awal Mengaji
              </Text>
              <Text style={[styles.scheduleDesc, fonts.sansRegular]}>
                Ideal untuk usia 4–6 tahun dengan durasi bermain sambil belajar
                yang pas.
              </Text>
            </View>
          </View>

          <View style={styles.scheduleDivider} />

          <View style={styles.scheduleRow}>
            <View style={styles.scheduleBadge}>
              <Feather name="clock" size={16} color={COLORS.ivory} />
              <Text style={[styles.scheduleBadgeText, fonts.sansBold]}>
                90 Menit
              </Text>
            </View>
            <View style={styles.scheduleInfoCol}>
              <Text style={[styles.scheduleTitle, fonts.sansBold]}>
                Sesi Terpadu SD (Calistung + Iqra + PR)
              </Text>
              <Text style={[styles.scheduleDesc, fonts.sansRegular]}>
                Cocok untuk siswa SD yang memadukan tematik sekolah, mengaji, dan
                jeda cerita.
              </Text>
            </View>
          </View>

          <View style={styles.scheduleTimeBox}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.forest} />
            <View style={styles.scheduleTimeTextCol}>
              <Text style={[styles.scheduleTimeHeading, fonts.sansBold]}>
                Senin – Sabtu (Fleksibel sesuai kesepakatan)
              </Text>
              <Text style={[styles.scheduleTimeSub, fonts.sansRegular]}>
                Sesi Pagi: 08.00 – 11.30 WIB • Sesi Siang/Sore: 13.30 – 17.30 WIB
              </Text>
            </View>
          </View>
        </PaperCard>

        {/* Tombol Konsultasi Pendaftaran WhatsApp */}
        <PaperCard variant="forest" layerColor={COLORS.moss}>
          <Text style={[styles.consultTitle, fonts.loraBold]}>
            Konsultasi & Pendaftaran Kelas
          </Text>
          <Text style={[styles.consultDesc, fonts.sansRegular]}>
            Ingin menanyakan ketersediaan pengajar atau mencocokkan jadwal
            terbaik untuk ananda? Hubungi admin kami langsung.
          </Text>

          <TouchableOpacity
            style={styles.consultBtn}
            activeOpacity={0.84}
            onPress={handleConsultWhatsApp}
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

  const renderFloatingBottomBar = () => {
    const tabs = [
      {
        key: 'beranda',
        label: 'Beranda',
        icon: 'home-outline',
        activeIcon: 'home',
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
      {
        key: 'tentang',
        label: 'Tentang',
        icon: 'leaf-outline',
        activeIcon: 'leaf',
      },
    ];

    return (
      <View style={styles.floatingDockOuter} pointerEvents="box-none">
        <View style={styles.floatingPillWrap}>
          <View style={styles.floatingPillBackLayer} />
          <View style={styles.floatingPill}>
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.floatingTabItem,
                    active && styles.floatingTabItemActive,
                  ]}
                  activeOpacity={0.82}
                  onPress={() => setActiveTab(tab.key)}
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
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.responsiveColumn}>
              {activeTab === 'beranda' && renderBerandaTab()}
              {activeTab === 'absen' && renderKartuAbsenTab()}
              {activeTab === 'play' && renderSaktahPlayTab()}
              {activeTab === 'tentang' && renderTentangTab()}
            </View>
          </ScrollView>

          {renderFloatingBottomBar()}
        </View>
      </KeyboardAvoidingView>

      {/* Modal Rincian Pilar Program */}
      <Modal
        visible={Boolean(selectedPilar)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPilar(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedPilar && (
                <>
                  <View style={styles.modalTopRow}>
                    <View style={styles.pilarIconFrame}>
                      <Feather
                        name={selectedPilar.ikon}
                        size={22}
                        color={COLORS.forest}
                      />
                    </View>
                    <View style={styles.modalTitleWrap}>
                      <Text style={[styles.modalTitle, fonts.loraBold]}>
                        {selectedPilar.judul}
                      </Text>
                      <Text style={[styles.modalSub, fonts.sansSemi]}>
                        {selectedPilar.subjudul}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.modalBody, fonts.sansRegular]}>
                    {selectedPilar.ringkasan}
                  </Text>

                  <Text style={[styles.modalSectionHead, fonts.sansBold]}>
                    Fokus Pendampingan:
                  </Text>
                  {selectedPilar.poin.map((pt) => (
                    <View key={pt} style={styles.modalBulletRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.forest}
                      />
                      <Text style={[styles.modalBulletText, fonts.sansRegular]}>
                        {pt}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.modalTargetBox}>
                    <Text style={[styles.modalTargetLabel, fonts.sansBold]}>
                      HARAPAN CAPAIAN
                    </Text>
                    <Text style={[styles.modalTargetText, fonts.sansSemi]}>
                      {selectedPilar.target}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalPrimaryBtn}
                    activeOpacity={0.82}
                    onPress={() => {
                      setSelectedPilar(null);
                      setActiveTab('absen');
                    }}
                  >
                    <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                      Buka Kartu Absen Murid
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalSecondaryBtn}
                    activeOpacity={0.82}
                    onPress={() => setSelectedPilar(null)}
                  >
                    <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                      Tutup
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Murid Baru */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
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
                Buat profil baru lengkap dengan 12 tiket stempel pertemuan.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Nama Murid *
              </Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newName}
                onChangeText={(text) => {
                  setNewName(text);
                  if (newNameError) setNewNameError('');
                }}
                placeholder="Contoh: Fatimah Az-Zahra"
                placeholderTextColor={COLORS.textMuted}
              />
              {newNameError ? (
                <Text style={[styles.errorText, fonts.sansBold]}>
                  {newNameError}
                </Text>
              ) : null}

              <Text style={[styles.inputLabel, fonts.sansBold]}>Jenjang</Text>
              <View style={styles.chipWrap}>
                {JENJANG_OPTIONS.map((jjg) => {
                  const selected = newJenjang === jjg;
                  return (
                    <TouchableOpacity
                      key={jjg}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setNewJenjang(jjg)}
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
                  const selected = newProgram === prog;
                  return (
                    <TouchableOpacity
                      key={prog}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setNewProgram(prog)}
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
                value={newPengajar}
                onChangeText={setNewPengajar}
                placeholder="Nama pengajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Bulan</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={newBulan}
                onChangeText={setNewBulan}
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
                onPress={() => setAddModalVisible(false)}
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
        visible={waPreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWaPreviewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                Pratinjau Laporan WhatsApp
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Tujuan: +{WHATSAPP_NUMBER}
              </Text>

              <View style={styles.waPreviewBox}>
                <Text style={[styles.waPreviewText, fonts.sansRegular]}>
                  {waPreviewText}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                activeOpacity={0.82}
                onPress={() => {
                  setWaPreviewVisible(false);
                  openWhatsAppUrl(waPreviewText);
                }}
              >
                <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                  Kirim ke WhatsApp Sekarang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                onPress={() => setWaPreviewVisible(false)}
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

  /* Paper-cut Layered Card */
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
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.ivory,
    borderWidth: 2,
    borderColor: COLORS.goldBorder,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  heroTitleCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 23,
    color: COLORS.ivory,
  },
  heroTagline: {
    fontSize: 13.5,
    color: COLORS.goldSoft,
    marginTop: 2,
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
    borderWidth: 1.5,
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

  /* Section Headings */
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.moss,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textMuted,
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

  /* Beranda */
  activeStudentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeStudentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.ivory,
    borderWidth: 1,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStudentInfo: {
    flex: 1,
  },
  activeStudentName: {
    fontSize: 16,
    color: COLORS.moss,
    marginTop: 2,
  },
  activeStudentMeta: {
    fontSize: 12.5,
    color: COLORS.forest,
    marginTop: 2,
  },

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

  pilarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  pilarIconFrame: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pilarTitleCol: {
    flex: 1,
  },
  pilarTitle: {
    fontSize: 16.5,
    color: COLORS.moss,
  },
  pilarSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  pilarDesc: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 20,
  },

  ctaBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBannerTextCol: {
    flex: 1,
  },
  ctaBannerTitle: {
    fontSize: 16,
    color: COLORS.ivory,
  },
  ctaBannerSub: {
    fontSize: 12.5,
    color: COLORS.cream,
    marginTop: 2,
    lineHeight: 18,
  },

  /* Kartu Absen */
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.forest,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    minHeight: 40,
  },
  addMemberBtnText: {
    fontSize: 12.5,
    color: COLORS.ivory,
  },
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

  /* Physical Membership Card */
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
  memberCardBody: {
    marginBottom: 12,
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

  /* Stamp Grid */
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
    marginBottom: 14,
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
  ticketNotchRow: {
    marginBottom: 6,
  },
  ticketNoText: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
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

  /* Notes List */
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

  /* WhatsApp Report Action */
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
    fontSize: 14.5,
    color: COLORS.ivory,
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

  /* Fold Cards */
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

  /* Tentang Tab */
  aboutHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  aboutLogoFrame: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    borderRadius: 25,
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
  philosophyItem: {
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
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  scheduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.forest,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  scheduleBadgeText: {
    fontSize: 12,
    color: COLORS.ivory,
  },
  scheduleInfoCol: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    color: COLORS.moss,
    marginBottom: 2,
  },
  scheduleDesc: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: COLORS.sageDark,
    marginVertical: 12,
  },
  scheduleTimeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.sage,
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  scheduleTimeTextCol: {
    flex: 1,
  },
  scheduleTimeHeading: {
    fontSize: 13,
    color: COLORS.moss,
  },
  scheduleTimeSub: {
    fontSize: 12,
    color: COLORS.textBody,
    marginTop: 2,
    lineHeight: 18,
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
    fontSize: 14,
    color: COLORS.forest,
  },

  /* Floating Bottom Pill Tab Bar */
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
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalTitleWrap: {
    flex: 1,
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
    marginBottom: 14,
  },
  modalSectionHead: {
    fontSize: 13,
    color: COLORS.forest,
    marginBottom: 8,
  },
  modalBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 7,
  },
  modalBulletText: {
    flex: 1,
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 19,
  },
  modalTargetBox: {
    backgroundColor: COLORS.sage,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  modalTargetLabel: {
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: COLORS.forest,
    marginBottom: 3,
  },
  modalTargetText: {
    fontSize: 13,
    color: COLORS.moss,
    lineHeight: 19,
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
