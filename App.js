import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const API_URL =
  'https://script.google.com/macros/s/AKfycbz-k-NwStCklTxBF_zR_nKVGqVh8BU9_SfWq57SdVXea6u-3GcX408pqqu-xKDWpZbu/exec';
const SESSION_STORAGE_KEY = '@saktah_tarbiyah_session_v1';
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
  overlay: 'rgba(19, 27, 21, 0.62)',
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

const STATUS_HADIR_OPTIONS = ['Hadir', 'Izin', 'Sakit', 'Alpa'];
const PENGAJAR_OPTIONS = ['Kak Annisa', 'Kak Burhan'];
const CAPAIAN_TAGS = [
  '#LancarMembaca',
  '#FokusBaik',
  '#HafalDoaBaru',
  '#BerhitungTeliti',
  '#AdabTerpuji',
];
const MINGGU_OPTIONS = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];

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
      deskripsi: 'Kuis Bintang Ceria, pencatatan progres, dan doa penutup.',
    },
  ],
};

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

function generateId(prefix) {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function normalizeAkunRow(row) {
  return {
    Kode_Masuk: normalizeText(row.Kode_Masuk ?? row.kode_masuk).trim(),
    Peran: normalizeText(row.Peran ?? row.peran).trim().toLowerCase(),
    Nama_User: normalizeText(row.Nama_User ?? row.nama_user).trim(),
    Nama_Anak: normalizeText(row.Nama_Anak ?? row.nama_anak).trim(),
  };
}

function normalizeKurikulumRow(row) {
  return {
    ID: normalizeText(row.ID ?? row.id),
    Bulan: normalizeText(row.Bulan ?? row.bulan),
    Minggu: normalizeText(row.Minggu ?? row.minggu),
    Judul_Materi: normalizeText(row.Judul_Materi ?? row.judul_materi),
    Deskripsi: normalizeText(row.Deskripsi ?? row.deskripsi),
  };
}

function normalizeProgresRow(row) {
  return {
    ID: normalizeText(row.ID ?? row.id),
    Tanggal: normalizeText(row.Tanggal ?? row.tanggal),
    Nama_Anak: normalizeText(row.Nama_Anak ?? row.nama_anak),
    Status_Hadir: normalizeText(row.Status_Hadir ?? row.status_hadir) || 'Hadir',
    Catatan_Perkembangan: normalizeText(
      row.Catatan_Perkembangan ?? row.catatan_perkembangan
    ),
    Pengajar: normalizeText(row.Pengajar ?? row.pengajar),
  };
}

function normalizeSaranRow(row) {
  return {
    ID: normalizeText(row.ID ?? row.id),
    Tanggal: normalizeText(row.Tanggal ?? row.tanggal),
    Nama_Wali: normalizeText(row.Nama_Wali ?? row.nama_wali),
    Nama_Anak: normalizeText(row.Nama_Anak ?? row.nama_anak),
    Isi_Saran: normalizeText(row.Isi_Saran ?? row.isi_saran),
    Status_Baca:
      normalizeText(row.Status_Baca ?? row.status_baca) || 'Belum Dibaca',
  };
}

async function fetchSpreadsheetData() {
  const response = await fetch(API_URL, { method: 'GET' });
  const rawText = await response.text();
  let json;
  try {
    json = JSON.parse(rawText);
  } catch (err) {
    throw new Error(
      'Server Google Apps Script tidak mengembalikan JSON yang valid. Pastikan tab Akun, Kurikulum, Progres, dan Saran tersedia.'
    );
  }
  if (!response.ok) {
    throw new Error(`Gagal memuat data (${response.status}).`);
  }
  return {
    akun: Array.isArray(json.akun) ? json.akun.map(normalizeAkunRow) : [],
    kurikulum: Array.isArray(json.kurikulum)
      ? json.kurikulum.map(normalizeKurikulumRow)
      : [],
    progres: Array.isArray(json.progres)
      ? json.progres.map(normalizeProgresRow)
      : [],
    saran: Array.isArray(json.saran) ? json.saran.map(normalizeSaranRow) : [],
  };
}

async function postSpreadsheetAction(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });
  const rawText = await response.text();
  let json;
  try {
    json = JSON.parse(rawText);
  } catch (err) {
    throw new Error(
      'Server Google Apps Script gagal memproses perubahan data.'
    );
  }
  if (json && json.status && json.status !== 'success' && json.error) {
    throw new Error(String(json.error));
  }
  return json;
}

function buildProgresWhatsAppReport(studentName, records) {
  const hadirCount = records.filter(
    (r) => r.Status_Hadir.toLowerCase() === 'hadir'
  ).length;
  const lines = [
    '*SAKTAH TARBIYAH — REKAP PROGRES BELAJAR*',
    '----------------------------------------',
    `Nama Murid : ${studentName}`,
    `Kehadiran  : ${hadirCount} Pertemuan Hadir (dari ${records.length} catatan)`,
    '',
    '*Catatan Perkembangan Terbaru:*',
  ];

  if (records.length === 0) {
    lines.push('Belum ada catatan progres.');
  } else {
    records.slice(0, 12).forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.Tanggal || '-'} • ${item.Status_Hadir} (${
          item.Pengajar || 'Pengajar'
        })`
      );
      if (item.Catatan_Perkembangan) {
        lines.push(`   ${item.Catatan_Perkembangan}`);
      }
    });
  }

  lines.push('');
  lines.push(
    'Terima kasih atas pendampingan Ayah & Bunda di rumah. Wassalamu’alaikum.'
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

  // Auth & AsyncStorage Session State
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginCode, setLoginCode] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Live Google Sheets Data
  const [akunList, setAkunList] = useState([]);
  const [kurikulumList, setKurikulumList] = useState([]);
  const [progresList, setProgresList] = useState([]);
  const [saranList, setSaranList] = useState([]);
  const [syncingData, setSyncingData] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [mutating, setMutating] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'kurikulum' | 'progres' | 'saran' | 'play'
  const [showTentang, setShowTentang] = useState(false);

  // Beranda Teaching Flow (Admin)
  const [sessionDuration, setSessionDuration] = useState(60);
  const [checkedStages, setCheckedStages] = useState({
    ice: true,
    inti: false,
    jeda: false,
    eval: false,
  });

  // Kurikulum Drill-down & Modal
  const [selectedBulan, setSelectedBulan] = useState(null);
  const [kurikulumModal, setKurikulumModal] = useState({
    visible: false,
    mode: 'add', // 'add' | 'edit'
    id: '',
    bulan: '',
    minggu: 'Minggu 1',
    judul: '',
    deskripsi: '',
    error: '',
  });

  // Progres Filter & Modal
  const [selectedAnakFilter, setSelectedAnakFilter] = useState('Semua');
  const [progresModal, setProgresModal] = useState({
    visible: false,
    mode: 'add',
    id: '',
    tanggal: '',
    namaAnak: '',
    statusHadir: 'Hadir',
    catatan: '',
    pengajar: 'Kak Annisa',
    error: '',
  });

  // Saran Filter & Wali Form
  const [saranFilter, setSaranFilter] = useState('Semua');
  const [newSaranText, setNewSaranText] = useState('');
  const [saranFeedback, setSaranFeedback] = useState('');

  // Confirm & Info Modals
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    visible: false,
    sheet: '',
    id: '',
    label: '',
  });
  const [infoModal, setInfoModal] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Saktah Play
  const [playMode, setPlayMode] = useState('lipat');
  const [doaFilter, setDoaFilter] = useState('Semua');
  const [openDoaIds, setOpenDoaIds] = useState({ 'doa-belajar': true });
  const [doneChallenges, setDoneChallenges] = useState({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const starPulse = useRef(new Animated.Value(1)).current;
  const certScale = useRef(new Animated.Value(1)).current;

  const isAdmin = currentUser?.Peran === 'admin';
  const isWali = currentUser?.Peran === 'wali';

  const androidTopInset =
    Platform.OS === 'android' ? RNStatusBar.currentHeight || 28 : 0;

  const scrollToTop = () => {
    if (
      scrollViewRef.current &&
      typeof scrollViewRef.current.scrollTo === 'function'
    ) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const refreshLiveData = useCallback(async () => {
    setSyncingData(true);
    setSyncError('');
    try {
      const data = await fetchSpreadsheetData();
      setAkunList(data.akun);
      setKurikulumList(data.kurikulum);
      setProgresList(data.progres);
      setSaranList(data.saran);
      return data;
    } catch (err) {
      setSyncError(err.message || 'Gagal terhubung ke server Google Sheets.');
      return null;
    } finally {
      setSyncingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrapSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (stored && active) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.Kode_Masuk && parsed.Peran) {
            setCurrentUser(parsed);
            await refreshLiveData();
          }
        }
      } catch (err) {
        // Ignore corrupted session and stay on Login screen
      } finally {
        if (active) setCheckingSession(false);
      }
    };
    bootstrapSession();
    return () => {
      active = false;
    };
  }, [refreshLiveData]);

  const handleLogin = async () => {
    const cleanCode = loginCode.trim();
    if (!cleanCode) {
      setLoginError('Masukkan Kode Masuk terlebih dahulu.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    try {
      const data = await fetchSpreadsheetData();
      setAkunList(data.akun);
      setKurikulumList(data.kurikulum);
      setProgresList(data.progres);
      setSaranList(data.saran);

      const matched = data.akun.find(
        (acc) => acc.Kode_Masuk.toLowerCase() === cleanCode.toLowerCase()
      );
      if (!matched) {
        setLoginError(
          'Kode Masuk tidak ditemukan di data Akun. Silakan periksa kembali.'
        );
        return;
      }

      const normalizedRole = matched.Peran === 'admin' ? 'admin' : 'wali';
      const userSession = {
        ...matched,
        Peran: normalizedRole,
      };
      await AsyncStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(userSession)
      );
      setCurrentUser(userSession);
      setLoginCode('');
      setActiveTab('beranda');
      setShowTentang(false);
      setSelectedBulan(null);
    } catch (err) {
      setLoginError(
        err.message || 'Tidak dapat memverifikasi Kode Masuk saat ini.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      // Proceed clearing state
    }
    setCurrentUser(null);
    setActiveTab('beranda');
    setShowTentang(false);
    setSelectedBulan(null);
    setSyncError('');
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

  const openWhatsAppUrl = async (pesan) => {
    const url =
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(pesan);
    try {
      await Linking.openURL(url);
    } catch (err) {
      setInfoModal({
        visible: true,
        title: 'Tidak Dapat Membuka WhatsApp',
        message: 'Pastikan aplikasi WhatsApp atau peramban tersedia di perangkat Anda.',
      });
    }
  };

  /* CRUD: Kurikulum (Admin Only) */
  const openAddKurikulum = (prefillBulan = '') => {
    setKurikulumModal({
      visible: true,
      mode: 'add',
      id: '',
      bulan: prefillBulan || selectedBulan || 'Bulan 1',
      minggu: 'Minggu 1',
      judul: '',
      deskripsi: '',
      error: '',
    });
  };

  const openEditKurikulum = (item) => {
    setKurikulumModal({
      visible: true,
      mode: 'edit',
      id: item.ID,
      bulan: item.Bulan,
      minggu: item.Minggu || 'Minggu 1',
      judul: item.Judul_Materi,
      deskripsi: item.Deskripsi,
      error: '',
    });
  };

  const handleSubmitKurikulum = async () => {
    if (!kurikulumModal.bulan.trim() || !kurikulumModal.judul.trim()) {
      setKurikulumModal((prev) => ({
        ...prev,
        error: 'Bulan dan Judul Materi wajib diisi.',
      }));
      return;
    }

    setMutating(true);
    try {
      const id =
        kurikulumModal.mode === 'edit'
          ? kurikulumModal.id
          : generateId('KUR');
      const row = [
        id,
        kurikulumModal.bulan.trim(),
        kurikulumModal.minggu.trim() || 'Minggu 1',
        kurikulumModal.judul.trim(),
        kurikulumModal.deskripsi.trim(),
      ];

      await postSpreadsheetAction(
        kurikulumModal.mode === 'edit'
          ? { sheet: 'Kurikulum', action: 'update', id, row }
          : { sheet: 'Kurikulum', action: 'add', row }
      );

      setKurikulumModal((prev) => ({ ...prev, visible: false }));
      await refreshLiveData();
    } catch (err) {
      setKurikulumModal((prev) => ({
        ...prev,
        error: err.message || 'Gagal menyimpan data Kurikulum.',
      }));
    } finally {
      setMutating(false);
    }
  };

  /* CRUD: Progres (Admin Only) */
  const studentNamesPool = useMemo(() => {
    const names = new Set();
    akunList.forEach((a) => {
      if (a.Nama_Anak) names.add(a.Nama_Anak);
    });
    progresList.forEach((p) => {
      if (p.Nama_Anak) names.add(p.Nama_Anak);
    });
    return Array.from(names);
  }, [akunList, progresList]);

  const openAddProgres = () => {
    const defaultStudent =
      selectedAnakFilter !== 'Semua'
        ? selectedAnakFilter
        : studentNamesPool[0] || '';
    const defaultPengajar =
      currentUser?.Nama_User &&
      PENGAJAR_OPTIONS.some((p) =>
        p.toLowerCase().includes(currentUser.Nama_User.toLowerCase())
      )
        ? currentUser.Nama_User
        : currentUser?.Nama_User || PENGAJAR_OPTIONS[0];

    setProgresModal({
      visible: true,
      mode: 'add',
      id: '',
      tanggal: formatTanggalHariIni(),
      namaAnak: defaultStudent,
      statusHadir: 'Hadir',
      catatan: '',
      pengajar: defaultPengajar,
      error: '',
    });
  };

  const openEditProgres = (item) => {
    setProgresModal({
      visible: true,
      mode: 'edit',
      id: item.ID,
      tanggal: item.Tanggal || formatTanggalHariIni(),
      namaAnak: item.Nama_Anak,
      statusHadir: item.Status_Hadir || 'Hadir',
      catatan: item.Catatan_Perkembangan,
      pengajar: item.Pengajar || currentUser?.Nama_User || PENGAJAR_OPTIONS[0],
      error: '',
    });
  };

  const toggleProgresTag = (tag) => {
    setProgresModal((prev) => {
      const current = prev.catatan;
      if (current.includes(tag)) {
        const cleaned = current
          .replace(tag, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return { ...prev, catatan: cleaned };
      }
      return {
        ...prev,
        catatan: current.trim() ? `${current.trim()} ${tag}` : tag,
      };
    });
  };

  const handleSubmitProgres = async () => {
    if (!progresModal.namaAnak.trim() || !progresModal.tanggal.trim()) {
      setProgresModal((prev) => ({
        ...prev,
        error: 'Tanggal dan Nama Anak wajib diisi.',
      }));
      return;
    }

    setMutating(true);
    try {
      const id =
        progresModal.mode === 'edit' ? progresModal.id : generateId('PRG');
      const row = [
        id,
        progresModal.tanggal.trim(),
        progresModal.namaAnak.trim(),
        progresModal.statusHadir,
        progresModal.catatan.trim(),
        progresModal.pengajar.trim() || PENGAJAR_OPTIONS[0],
      ];

      await postSpreadsheetAction(
        progresModal.mode === 'edit'
          ? { sheet: 'Progres', action: 'update', id, row }
          : { sheet: 'Progres', action: 'add', row }
      );

      setProgresModal((prev) => ({ ...prev, visible: false }));
      await refreshLiveData();
    } catch (err) {
      setProgresModal((prev) => ({
        ...prev,
        error: err.message || 'Gagal menyimpan data Progres.',
      }));
    } finally {
      setMutating(false);
    }
  };

  /* Delete Handler (Admin Only for Kurikulum & Progres) */
  const handleConfirmDelete = async () => {
    const { sheet, id } = deleteConfirmModal;
    setMutating(true);
    try {
      await postSpreadsheetAction({
        sheet,
        action: 'delete',
        id,
      });
      setDeleteConfirmModal({ visible: false, sheet: '', id: '', label: '' });
      await refreshLiveData();
    } catch (err) {
      setDeleteConfirmModal({ visible: false, sheet: '', id: '', label: '' });
      setInfoModal({
        visible: true,
        title: 'Gagal Menghapus Data',
        message: err.message || 'Terjadi kendala saat menghapus data.',
      });
    } finally {
      setMutating(false);
    }
  };

  /* Saran Handlers */
  const handleToggleSaranRead = async (item) => {
    if (!isAdmin || mutating) return;
    const isRead = item.Status_Baca.toLowerCase() === 'sudah dibaca';
    const nextStatus = isRead ? 'Belum Dibaca' : 'Sudah Dibaca';

    setMutating(true);
    try {
      await postSpreadsheetAction({
        sheet: 'Saran',
        action: 'update',
        id: item.ID,
        row: [
          item.ID,
          item.Tanggal,
          item.Nama_Wali,
          item.Nama_Anak,
          item.Isi_Saran,
          nextStatus,
        ],
      });
      await refreshLiveData();
    } catch (err) {
      setInfoModal({
        visible: true,
        title: 'Gagal Memperbarui Status Baca',
        message: err.message || 'Tidak dapat mengubah status baca pesan.',
      });
    } finally {
      setMutating(false);
    }
  };

  const handleSendSaranWali = async () => {
    const cleanText = newSaranText.trim();
    if (!cleanText) {
      setSaranFeedback('Mohon tuliskan masukan atau saran terlebih dahulu.');
      return;
    }

    setMutating(true);
    setSaranFeedback('');
    try {
      const id = generateId('SRN');
      const row = [
        id,
        formatTanggalHariIni(),
        currentUser?.Nama_User || 'Orang Tua / Wali',
        currentUser?.Nama_Anak || '-',
        cleanText,
        'Belum Dibaca',
      ];
      await postSpreadsheetAction({
        sheet: 'Saran',
        action: 'add',
        row,
      });
      setNewSaranText('');
      setSaranFeedback('Alhamdulillah, masukan Anda berhasil dikirim ke pengajar.');
      await refreshLiveData();
    } catch (err) {
      setSaranFeedback(
        err.message || 'Gagal mengirim masukan. Silakan coba lagi.'
      );
    } finally {
      setMutating(false);
    }
  };

  /* Grouped Kurikulum by Bulan */
  const kurikulumByMonth = useMemo(() => {
    const map = {};
    kurikulumList.forEach((item) => {
      const bulanKey = item.Bulan.trim() || 'Lainnya';
      if (!map[bulanKey]) map[bulanKey] = [];
      map[bulanKey].push(item);
    });
    return Object.keys(map).map((bulan) => ({
      bulan,
      items: map[bulan],
    }));
  }, [kurikulumList]);

  /* Filtered Progres based on Role */
  const visibleProgres = useMemo(() => {
    if (isWali) {
      const targetAnak = (currentUser?.Nama_Anak || '').trim().toLowerCase();
      return progresList.filter(
        (item) => item.Nama_Anak.trim().toLowerCase() === targetAnak
      );
    }
    if (selectedAnakFilter === 'Semua') return progresList;
    return progresList.filter(
      (item) =>
        item.Nama_Anak.trim().toLowerCase() ===
        selectedAnakFilter.trim().toLowerCase()
    );
  }, [isWali, currentUser, progresList, selectedAnakFilter]);

  /* Filtered Saran based on Role */
  const visibleSaran = useMemo(() => {
    if (isWali) {
      const targetAnak = (currentUser?.Nama_Anak || '').trim().toLowerCase();
      const targetWali = (currentUser?.Nama_User || '').trim().toLowerCase();
      return saranList.filter(
        (item) =>
          (targetAnak && item.Nama_Anak.trim().toLowerCase() === targetAnak) ||
          (targetWali && item.Nama_Wali.trim().toLowerCase() === targetWali)
      );
    }
    if (saranFilter === 'Belum Dibaca') {
      return saranList.filter(
        (s) => s.Status_Baca.toLowerCase() !== 'sudah dibaca'
      );
    }
    if (saranFilter === 'Sudah Dibaca') {
      return saranList.filter(
        (s) => s.Status_Baca.toLowerCase() === 'sudah dibaca'
      );
    }
    return saranList;
  }, [isWali, currentUser, saranList, saranFilter]);

  const unreadSaranCount = useMemo(
    () =>
      saranList.filter((s) => s.Status_Baca.toLowerCase() !== 'sudah dibaca')
        .length,
    [saranList]
  );

  /* Saktah Play */
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

  /* Session Splash While Checking AsyncStorage */
  if (checkingSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.splashContainer}>
          <View style={styles.splashLogoWrap}>
            <Image
              source={LOGO_SAKTAH}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.splashTitle, fonts.loraBold]}>
            Saktah Tarbiyah
          </Text>
          <Text style={[styles.splashSub, fonts.sansRegular]}>
            Memeriksa sesi masuk...
          </Text>
          <ActivityIndicator
            size="large"
            color={COLORS.forest}
            style={{ marginTop: 18 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /* Login Screen */
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.loginScrollContent,
              { paddingTop: androidTopInset + 30 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.responsiveColumn}>
              <View style={styles.loginBrandHeader}>
                <View style={styles.loginLogoCircle}>
                  <Image
                    source={LOGO_SAKTAH}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.loginTitle, fonts.loraBold]}>
                  Saktah Tarbiyah
                </Text>
                <Text style={[styles.loginSubtitle, fonts.loraSemi]}>
                  Ruang Tumbuh & Belajar yang Tenang
                </Text>
              </View>

              <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
                <Text style={[styles.loginCardHeading, fonts.loraBold]}>
                  Masuk ke Jurnal Belajar
                </Text>
                <Text style={[styles.loginCardDesc, fonts.sansRegular]}>
                  Masukkan Kode Masuk yang terdaftar untuk pengajar atau orang
                  tua/wali murid.
                </Text>

                <Text style={[styles.inputLabel, fonts.sansBold]}>
                  Kode Masuk
                </Text>
                <View style={styles.loginInputRow}>
                  <Ionicons
                    name="key-outline"
                    size={19}
                    color={COLORS.forest}
                  />
                  <TextInput
                    style={[styles.loginTextInput, fonts.sansBold]}
                    value={loginCode}
                    onChangeText={(text) => {
                      setLoginCode(text);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="Contoh: ADMIN-ANNISA atau WALI-AISYAH"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="characters"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                </View>

                {loginError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={17}
                      color={COLORS.dangerText}
                    />
                    <Text style={[styles.errorBannerText, fonts.sansSemi]}>
                      {loginError}
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.loginSubmitBtn,
                    loginLoading && { opacity: 0.7 },
                  ]}
                  activeOpacity={0.82}
                  disabled={loginLoading}
                  onPress={handleLogin}
                >
                  {loginLoading ? (
                    <ActivityIndicator size="small" color={COLORS.ivory} />
                  ) : (
                    <>
                      <Ionicons
                        name="log-in-outline"
                        size={20}
                        color={COLORS.ivory}
                      />
                      <Text style={[styles.loginSubmitText, fonts.sansBold]}>
                        Masuk Sekarang
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </PaperCard>

              <PaperCard variant="sage" layerColor={COLORS.forest}>
                <View style={styles.loginInfoRow}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={COLORS.forest}
                  />
                  <View style={styles.loginInfoTextCol}>
                    <Text style={[styles.loginInfoTitle, fonts.sansBold]}>
                      Akses Sesuai Peran
                    </Text>
                    <Text style={[styles.loginInfoDesc, fonts.sansRegular]}>
                      Pengajar/Admin dapat mengelola kurikulum, progres, dan kotak
                      saran. Orang Tua/Wali melihat kurikulum, progres ananda,
                      serta mengirim saran.
                    </Text>
                  </View>
                </View>
              </PaperCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /* Authenticated UI Components */
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
                Filosofi Belajar & Konsultasi
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
        <View style={[styles.heroBanner, { paddingTop: androidTopInset + 14 }]}>
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
                  {isAdmin
                    ? 'Panel Pengajar / Admin'
                    : `Wali dari ${currentUser.Nama_Anak || 'Ananda'}`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logoutPillBtn}
                activeOpacity={0.82}
                onPress={() => setLogoutModalVisible(true)}
              >
                <Ionicons
                  name="log-out-outline"
                  size={15}
                  color={COLORS.moss}
                />
                <Text style={[styles.logoutPillText, fonts.sansBold]}>
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroGreetingPaper}>
              <View style={styles.heroGreetingRow}>
                <Ionicons
                  name={isAdmin ? 'ribbon-outline' : 'heart-outline'}
                  size={18}
                  color={COLORS.goldSoft}
                />
                <View style={styles.flexOne}>
                  <Text style={[styles.heroUserGreeting, fonts.sansBold]}>
                    Assalamu’alaikum, {currentUser.Nama_User || currentUser.Kode_Masuk}
                  </Text>
                  <Text style={[styles.heroGreetingText, fonts.sansRegular]}>
                    {isAdmin
                      ? 'Terhubung real-time ke Google Sheets untuk mencatat kurikulum, progres murid, & kotak saran.'
                      : `Pantau kurikulum belajar serta perkembangan ananda ${
                          currentUser.Nama_Anak || ''
                        } secara langsung.`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    const headerMeta = {
      kurikulum: {
        title: selectedBulan ? `Kurikulum • ${selectedBulan}` : 'Kurikulum Bulanan',
        subtitle: isAdmin
          ? 'Kelola materi mingguan (Admin)'
          : 'Daftar materi belajar (Mode Baca)',
        icon: 'layers-outline',
      },
      progres: {
        title: isAdmin ? 'Progres & Absensi Murid' : 'Progres Belajar Ananda',
        subtitle: isAdmin
          ? 'Catat kehadiran & perkembangan'
          : `Catatan khusus ${currentUser.Nama_Anak || 'Ananda'}`,
        icon: 'calendar-outline',
      },
      saran: {
        title: isAdmin ? 'Kotak Masuk Saran' : 'Kotak Masukan & Saran',
        subtitle: isAdmin
          ? `${unreadSaranCount} pesan belum dibaca`
          : 'Kirim pesan hangat untuk pengajar',
        icon: 'chatbubble-ellipses-outline',
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

          <TouchableOpacity
            style={styles.headerRefreshBtn}
            activeOpacity={0.8}
            disabled={syncingData}
            onPress={refreshLiveData}
          >
            {syncingData ? (
              <ActivityIndicator size="small" color={COLORS.ivory} />
            ) : (
              <Ionicons name="refresh" size={18} color={COLORS.ivory} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSyncBanner = () => {
    if (!syncError) return null;
    return (
      <PaperCard variant="ivory" layerColor={COLORS.dangerText}>
        <View style={styles.syncErrorRow}>
          <Ionicons
            name="cloud-offline-outline"
            size={20}
            color={COLORS.dangerText}
          />
          <View style={styles.flexOne}>
            <Text style={[styles.syncErrorTitle, fonts.sansBold]}>
              Koneksi Google Sheets Terkendala
            </Text>
            <Text style={[styles.syncErrorDesc, fonts.sansRegular]}>
              {syncError}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.syncRetryBtn}
            activeOpacity={0.8}
            onPress={refreshLiveData}
          >
            <Text style={[styles.syncRetryText, fonts.sansBold]}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </PaperCard>
    );
  };

  /* Tab 1: Beranda */
  const renderBerandaTab = () => {
    const stages = SESI_TEMPLATES[sessionDuration];
    const completedStages = stages.filter((s) => checkedStages[s.id]).length;

    return (
      <View style={styles.tabBody}>
        {/* Status Sinkronisasi Real-Time */}
        <PaperCard variant="sage" layerColor={COLORS.forest}>
          <View style={styles.syncStripRow}>
            <View style={styles.syncStripLeft}>
              <View style={styles.liveDotRow}>
                <View style={styles.liveDot} />
                <Text style={[styles.microLabel, fonts.sansBold]}>
                  SINKRONISASI REAL-TIME
                </Text>
              </View>
              <Text style={[styles.syncStripTitle, fonts.loraBold]}>
                {kurikulumList.length} Materi • {visibleProgres.length} Progres
                {isAdmin ? ` • ${unreadSaranCount} Saran Baru` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.syncNowBtn}
              activeOpacity={0.8}
              disabled={syncingData}
              onPress={refreshLiveData}
            >
              {syncingData ? (
                <ActivityIndicator size="small" color={COLORS.ivory} />
              ) : (
                <>
                  <Ionicons name="refresh" size={14} color={COLORS.ivory} />
                  <Text style={[styles.syncNowText, fonts.sansBold]}>
                    Segarkan
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </PaperCard>

        {isAdmin && (
          <>
            <View style={styles.sectionHeadingRow}>
              <Text style={[styles.sectionTitle, fonts.loraBold]}>
                Alur Sesi Mengajar Hari Ini
              </Text>
              <TouchableOpacity
                style={styles.resetTextBtn}
                activeOpacity={0.75}
                onPress={() =>
                  setCheckedStages({
                    ice: false,
                    inti: false,
                    jeda: false,
                    eval: false,
                  })
                }
              >
                <Feather name="rotate-ccw" size={13} color={COLORS.forest} />
                <Text style={[styles.resetTextLabel, fonts.sansBold]}>
                  Reset
                </Text>
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
                    onPress={() =>
                      setCheckedStages((prev) => ({
                        ...prev,
                        [stage.id]: !prev[stage.id],
                      }))
                    }
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
                        <Text style={[styles.stageTitle, fonts.sansBold]}>
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
          </>
        )}

        {/* Pintasan Cepat */}
        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          Menu Utama
        </Text>

        <View style={styles.shortcutDualRow}>
          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('kurikulum')}
          >
            <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
              <View style={styles.quickSmallIcon}>
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={COLORS.forest}
                />
              </View>
              <Text style={[styles.quickSmallTitle, fonts.loraBold]}>
                Kurikulum
              </Text>
              <Text style={[styles.quickSmallDesc, fonts.sansRegular]}>
                {kurikulumByMonth.length} bulan • {kurikulumList.length} materi
              </Text>
            </PaperCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('progres')}
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
                Progres
              </Text>
              <Text style={[styles.quickSmallDesc, fonts.sansRegular]}>
                {visibleProgres.length} catatan tersimpan
              </Text>
            </PaperCard>
          </TouchableOpacity>
        </View>

        <View style={styles.shortcutDualRow}>
          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('saran')}
          >
            <PaperCard variant="sage" layerColor={COLORS.forest}>
              <View style={styles.quickSmallIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={COLORS.forest}
                />
              </View>
              <Text style={[styles.quickSmallTitle, fonts.loraBold]}>
                {isAdmin ? 'Kotak Saran' : 'Kirim Saran'}
              </Text>
              <Text style={[styles.quickSmallDesc, fonts.sansRegular]}>
                {isAdmin
                  ? `${unreadSaranCount} belum dibaca`
                  : 'Masukan untuk pengajar'}
              </Text>
            </PaperCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutHalfWrap}
            activeOpacity={0.84}
            onPress={() => navigateTab('play')}
          >
            <PaperCard variant="sage" layerColor={COLORS.forest}>
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

        {/* Tentang & Logout */}
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
                  Filosofi belajar tenang, jadwal kelas privat, & konsultasi WA.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={COLORS.ivory} />
            </View>
          </PaperCard>
        </TouchableOpacity>
      </View>
    );
  };

  /* Halaman Tentang */
  const renderTentangPage = () => (
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
          “Seperti makna saktah—jeda sejenak untuk mengambil napas dengan tenang—kami
          mendampingi anak TK & SD bertumbuh sesuai ritme terbaiknya, hangat,
          sabar, dan beradab.”
        </Text>
      </PaperCard>

      <PaperCard variant="forest" layerColor={COLORS.moss}>
        <Text style={[styles.consultTitle, fonts.loraBold]}>
          Konsultasi Kelas Privat
        </Text>
        <Text style={[styles.consultDesc, fonts.sansRegular]}>
          Tersedia sesi 60 & 90 menit (Senin–Sabtu). Hubungi admin Saktah Tarbiyah
          untuk informasi jadwal atau penyesuaian program ananda.
        </Text>
        <TouchableOpacity
          style={styles.consultBtn}
          activeOpacity={0.82}
          onPress={() =>
            openWhatsAppUrl(
              'Assalamu’alaikum Kak Admin Saktah Tarbiyah, saya ingin berkonsultasi mengenai kelas belajar anak.'
            )
          }
        >
          <Ionicons name="logo-whatsapp" size={20} color={COLORS.forest} />
          <Text style={[styles.consultBtnText, fonts.sansBold]}>
            Hubungi WhatsApp (081802899219)
          </Text>
        </TouchableOpacity>
      </PaperCard>
    </View>
  );

  /* Tab 2: Kurikulum (Admin: CRUD, Wali: Read-Only) */
  const renderKurikulumTab = () => {
    if (selectedBulan) {
      const monthItems = kurikulumList.filter(
        (m) => (m.Bulan.trim() || 'Lainnya') === selectedBulan
      );

      return (
        <View style={styles.tabBody}>
          <View style={styles.sectionHeadingRow}>
            <TouchableOpacity
              style={styles.backToListBtn}
              activeOpacity={0.82}
              onPress={() => {
                setSelectedBulan(null);
                scrollToTop();
              }}
            >
              <Ionicons name="arrow-back" size={17} color={COLORS.forest} />
              <Text style={[styles.backToListText, fonts.sansBold]}>
                ← Daftar Bulan
              </Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                style={styles.addSmallBtn}
                activeOpacity={0.82}
                onPress={() => openAddKurikulum(selectedBulan)}
              >
                <Feather name="plus" size={15} color={COLORS.ivory} />
                <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
                  Tambah Materi
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
            <Text style={[styles.microLabel, fonts.sansBold]}>
              {isWali ? 'KURIKULUM (MODE BACA)' : 'KELOLA KURIKULUM'}
            </Text>
            <Text style={[styles.monthDetailTitle, fonts.loraBold]}>
              {selectedBulan}
            </Text>
            <Text style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}>
              Terdapat {monthItems.length} materi terjadwal pada periode ini.
            </Text>
          </PaperCard>

          {monthItems.length === 0 ? (
            <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
              <Text style={[styles.emptyStateText, fonts.sansRegular]}>
                Belum ada materi untuk {selectedBulan}.
              </Text>
            </PaperCard>
          ) : (
            monthItems.map((item) => (
              <PaperCard
                key={item.ID || `${item.Bulan}-${item.Minggu}-${item.Judul_Materi}`}
                variant="ivory"
                layerColor={COLORS.moss}
              >
                <View style={styles.materiTopRow}>
                  <View style={styles.pekanBadge}>
                    <Text style={[styles.pekanBadgeText, fonts.sansBold]}>
                      {item.Minggu || 'Minggu'}
                    </Text>
                  </View>
                  {item.ID ? (
                    <Text style={[styles.idTinyText, fonts.sansSemi]}>
                      {item.ID}
                    </Text>
                  ) : null}
                </View>

                <Text style={[styles.materiJudul, fonts.loraBold]}>
                  {item.Judul_Materi}
                </Text>
                <Text style={[styles.materiDesc, fonts.sansRegular]}>
                  {item.Deskripsi || '-'}
                </Text>

                {isAdmin && (
                  <View style={styles.adminActionRow}>
                    <TouchableOpacity
                      style={styles.adminEditBtn}
                      activeOpacity={0.8}
                      onPress={() => openEditKurikulum(item)}
                    >
                      <Feather name="edit-3" size={15} color={COLORS.forest} />
                      <Text style={[styles.adminEditBtnText, fonts.sansBold]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.adminDeleteBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        setDeleteConfirmModal({
                          visible: true,
                          sheet: 'Kurikulum',
                          id: item.ID,
                          label: item.Judul_Materi,
                        })
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color={COLORS.dangerText}
                      />
                      <Text style={[styles.adminDeleteBtnText, fonts.sansBold]}>
                        Hapus
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </PaperCard>
            ))
          )}
        </View>
      );
    }

    return (
      <View style={styles.tabBody}>
        <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
          <View style={styles.playIntroRow}>
            <Ionicons name="layers-outline" size={22} color={COLORS.forest} />
            <View style={styles.playIntroTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Kurikulum Belajar Saktah Tarbiyah
              </Text>
              <Text
                style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
              >
                {isAdmin
                  ? 'Ketuk kartu bulan untuk melihat, mengedit, atau menghapus materi mingguan.'
                  : 'Ketuk kartu bulan untuk melihat rencana materi belajar ananda (Mode Baca).'}
              </Text>
            </View>
          </View>
        </PaperCard>

        <View style={styles.sectionHeadingRow}>
          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Daftar Bulan ({kurikulumByMonth.length})
          </Text>
          {isAdmin && (
            <TouchableOpacity
              style={styles.addSmallBtn}
              activeOpacity={0.82}
              onPress={() => openAddKurikulum('')}
            >
              <Feather name="plus" size={15} color={COLORS.ivory} />
              <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
                Tambah Materi
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {kurikulumByMonth.length === 0 ? (
          <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
            <Text style={[styles.emptyStateText, fonts.sansRegular]}>
              Belum ada data kurikulum dari Google Sheets.
              {isAdmin ? ' Tekan "Tambah Materi" untuk memulai.' : ''}
            </Text>
          </PaperCard>
        ) : (
          kurikulumByMonth.map((group, idx) => (
            <TouchableOpacity
              key={group.bulan}
              activeOpacity={0.84}
              onPress={() => {
                setSelectedBulan(group.bulan);
                scrollToTop();
              }}
            >
              <PaperCard
                variant={idx % 2 === 0 ? 'ivory' : 'sage'}
                layerColor={idx % 2 === 0 ? COLORS.moss : COLORS.forest}
              >
                <View style={styles.monthCardTopRow}>
                  <View style={styles.monthCodePill}>
                    <Text style={[styles.monthCodeText, fonts.sansBold]}>
                      {group.items.length} MATERI
                    </Text>
                  </View>
                  <View style={styles.monthOpenCue}>
                    <Text style={[styles.monthOpenCueText, fonts.sansBold]}>
                      Buka Detail
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={15}
                      color={COLORS.forest}
                    />
                  </View>
                </View>

                <Text style={[styles.monthCardTitle, fonts.loraBold]}>
                  {group.bulan}
                </Text>

                {group.items.slice(0, 2).map((sub) => (
                  <View key={sub.ID || sub.Judul_Materi} style={styles.previewRow}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color={COLORS.forest}
                    />
                    <Text style={[styles.previewRowText, fonts.sansRegular]}>
                      {sub.Minggu}: {sub.Judul_Materi}
                    </Text>
                  </View>
                ))}
              </PaperCard>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  /* Tab 3: Progres (Admin: CRUD semua murid, Wali: Read-Only Nama_Anak) */
  const renderProgresTab = () => {
    const hadirTotal = visibleProgres.filter(
      (p) => p.Status_Hadir.toLowerCase() === 'hadir'
    ).length;
    const progressTarget = 12;
    const progressPct = Math.min(
      100,
      Math.round((hadirTotal / progressTarget) * 100)
    );

    return (
      <View style={styles.tabBody}>
        {/* Header Ringkasan Kehadiran */}
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
              <View style={styles.flexOne}>
                <Text style={[styles.memberCardOrg, fonts.loraBold]}>
                  {isWali
                    ? currentUser.Nama_Anak || 'Ananda'
                    : selectedAnakFilter === 'Semua'
                    ? 'Semua Murid'
                    : selectedAnakFilter}
                </Text>
                <Text style={[styles.memberCardLabel, fonts.sansBold]}>
                  {isWali ? 'LAPORAN PROGRES ANANDA (READ-ONLY)' : 'REKAP PROGRES MURID'}
                </Text>
              </View>
            </View>
            <View style={styles.progressBadge}>
              <Text style={[styles.progressBadgeText, fonts.sansBold]}>
                {hadirTotal} Hadir
              </Text>
            </View>
          </View>

          <Text style={[styles.progressLabelLine, fonts.sansBold, { marginTop: 12 }]}>
            {hadirTotal} / {progressTarget} Pertemuan Hadir ({progressPct}%)
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          {/* Stempel Pertemuan dari Progres */}
          <View style={styles.stampMiniWrap}>
            {Array.from({ length: 12 }, (_, idx) => {
              const rec = visibleProgres[idx];
              const isHadir =
                rec && rec.Status_Hadir.toLowerCase() === 'hadir';
              return (
                <View
                  key={idx}
                  style={[
                    styles.stampMiniCircle,
                    isHadir
                      ? styles.stampMiniCircleActive
                      : styles.stampMiniCircleIdle,
                  ]}
                >
                  {isHadir ? (
                    <Ionicons
                      name="checkmark-done"
                      size={14}
                      color={COLORS.ivory}
                    />
                  ) : (
                    <Text style={[styles.stampMiniNum, fonts.sansBold]}>
                      {idx + 1}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </PaperCard>

        {/* Filter Anak & Tombol Tambah (Admin) */}
        {isAdmin && (
          <>
            <View style={styles.sectionHeadingRow}>
              <Text style={[styles.sectionTitle, fonts.loraBold]}>
                Filter Murid
              </Text>
              <TouchableOpacity
                style={styles.addSmallBtn}
                activeOpacity={0.82}
                onPress={openAddProgres}
              >
                <Feather name="plus" size={15} color={COLORS.ivory} />
                <Text style={[styles.addSmallBtnText, fonts.sansBold]}>
                  Catat Progres
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.memberSwitchScroll}
            >
              {['Semua', ...studentNamesPool].map((name) => {
                const active = selectedAnakFilter === name;
                return (
                  <TouchableOpacity
                    key={name}
                    style={[
                      styles.filterPill,
                      active && styles.filterPillActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedAnakFilter(name)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        fonts.sansBold,
                        active && styles.filterPillTextActive,
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Daftar Catatan Progres */}
        <Text style={[styles.sectionTitle, fonts.loraBold]}>
          Catatan Pertemuan ({visibleProgres.length})
        </Text>

        {visibleProgres.length === 0 ? (
          <PaperCard variant="sage" layerColor={COLORS.forest}>
            <Text style={[styles.emptyStateText, fonts.sansRegular]}>
              {isWali
                ? `Belum ada catatan progres untuk ${
                    currentUser.Nama_Anak || 'Ananda'
                  }.`
                : 'Belum ada data progres untuk filter ini.'}
            </Text>
          </PaperCard>
        ) : (
          visibleProgres.map((item) => {
            const isHadir = item.Status_Hadir.toLowerCase() === 'hadir';
            return (
              <PaperCard
                key={item.ID || `${item.Tanggal}-${item.Nama_Anak}`}
                variant={isHadir ? 'sage' : 'ivory'}
                layerColor={isHadir ? COLORS.forest : COLORS.sageDark}
              >
                <View style={styles.progresCardTop}>
                  <View style={styles.progresDateBadge}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={COLORS.forest}
                    />
                    <Text style={[styles.progresDateText, fonts.sansBold]}>
                      {item.Tanggal || '-'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusHadirPill,
                      isHadir
                        ? styles.statusHadirYes
                        : styles.statusHadirOther,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusHadirText,
                        fonts.sansBold,
                        isHadir && { color: COLORS.ivory },
                      ]}
                    >
                      {item.Status_Hadir}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.progresAnakName, fonts.loraBold]}>
                  {item.Nama_Anak}
                </Text>
                <Text style={[styles.progresCatatan, fonts.sansRegular]}>
                  {item.Catatan_Perkembangan || 'Tidak ada catatan tambahan.'}
                </Text>

                <View style={styles.progresMetaFooter}>
                  <View style={styles.pengajarBadge}>
                    <Feather name="user" size={12} color={COLORS.textMuted} />
                    <Text style={[styles.pengajarBadgeText, fonts.sansSemi]}>
                      Pengajar: {item.Pengajar || '-'}
                    </Text>
                  </View>
                </View>

                {isAdmin && (
                  <View style={styles.adminActionRow}>
                    <TouchableOpacity
                      style={styles.adminEditBtn}
                      activeOpacity={0.8}
                      onPress={() => openEditProgres(item)}
                    >
                      <Feather name="edit-3" size={15} color={COLORS.forest} />
                      <Text style={[styles.adminEditBtnText, fonts.sansBold]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.adminDeleteBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        setDeleteConfirmModal({
                          visible: true,
                          sheet: 'Progres',
                          id: item.ID,
                          label: `${item.Nama_Anak} (${item.Tanggal})`,
                        })
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color={COLORS.dangerText}
                      />
                      <Text style={[styles.adminDeleteBtnText, fonts.sansBold]}>
                        Hapus
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </PaperCard>
            );
          })
        )}

        {isAdmin && visibleProgres.length > 0 && (
          <TouchableOpacity
            style={styles.waPrimaryBtn}
            activeOpacity={0.82}
            onPress={() =>
              openWhatsAppUrl(
                buildProgresWhatsAppReport(
                  selectedAnakFilter === 'Semua'
                    ? 'Murid Saktah Tarbiyah'
                    : selectedAnakFilter,
                  visibleProgres
                )
              )
            }
          >
            <Ionicons name="logo-whatsapp" size={20} color={COLORS.ivory} />
            <Text style={[styles.waPrimaryBtnText, fonts.sansBold]}>
              Bagikan Rekap Progres ke WhatsApp
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /* Tab 4: Saran (Admin: Kotak Masuk + Ubah Status_Baca, Wali: Kirim Saran) */
  const renderSaranTab = () => {
    if (isWali) {
      return (
        <View style={styles.tabBody}>
          <PaperCard variant="ivory" layerColor={COLORS.moss} showTape>
            <View style={styles.playIntroRow}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={COLORS.forest}
              />
              <View style={styles.playIntroTextCol}>
                <Text style={[styles.cardHeading, fonts.loraBold]}>
                  Kotak Masukan & Saran
                </Text>
                <Text
                  style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
                >
                  Sampaikan pertanyaan, catatan khusus di rumah, atau masukan
                  untuk Kak Annisa & Kak Burhan.
                </Text>
              </View>
            </View>

            <View style={styles.waliSenderInfo}>
              <Text style={[styles.waliSenderText, fonts.sansSemi]}>
                Pengirim: {currentUser.Nama_User || 'Wali'} • Ananda:{' '}
                {currentUser.Nama_Anak || '-'}
              </Text>
            </View>

            <Text style={[styles.inputLabel, fonts.sansBold]}>
              Tulis Masukan atau Saran
            </Text>
            <TextInput
              style={[styles.saranTextArea, fonts.sansRegular]}
              value={newSaranText}
              onChangeText={(text) => {
                setNewSaranText(text);
                if (saranFeedback) setSaranFeedback('');
              }}
              placeholder="Contoh: Mohon minggu depan ananda dibantu mengulang huruf hijaiyah sambung..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              textAlignVertical="top"
            />

            {saranFeedback ? (
              <View style={styles.saranFeedbackBox}>
                <Text style={[styles.saranFeedbackText, fonts.sansSemi]}>
                  {saranFeedback}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.waPrimaryBtn, mutating && { opacity: 0.7 }]}
              activeOpacity={0.82}
              disabled={mutating}
              onPress={handleSendSaranWali}
            >
              {mutating ? (
                <ActivityIndicator size="small" color={COLORS.ivory} />
              ) : (
                <>
                  <Feather name="send" size={17} color={COLORS.ivory} />
                  <Text style={[styles.waPrimaryBtnText, fonts.sansBold]}>
                    Kirim Masukan ke Pengajar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </PaperCard>

          <Text style={[styles.sectionTitle, fonts.loraBold]}>
            Riwayat Pesan Anda ({visibleSaran.length})
          </Text>

          {visibleSaran.length === 0 ? (
            <PaperCard variant="sage" layerColor={COLORS.forest}>
              <Text style={[styles.emptyStateText, fonts.sansRegular]}>
                Anda belum pernah mengirim masukan melalui kotak saran.
              </Text>
            </PaperCard>
          ) : (
            visibleSaran.map((item) => {
              const isRead =
                item.Status_Baca.toLowerCase() === 'sudah dibaca';
              return (
                <PaperCard
                  key={item.ID || `${item.Tanggal}-${item.Isi_Saran}`}
                  variant="sage"
                  layerColor={COLORS.forest}
                >
                  <View style={styles.progresCardTop}>
                    <Text style={[styles.progresDateText, fonts.sansBold]}>
                      {item.Tanggal}
                    </Text>
                    <View
                      style={[
                        styles.statusHadirPill,
                        isRead
                          ? styles.statusHadirYes
                          : styles.statusHadirOther,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusHadirText,
                          fonts.sansBold,
                          isRead && { color: COLORS.ivory },
                        ]}
                      >
                        {item.Status_Baca}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.progresCatatan, fonts.sansRegular]}>
                    {item.Isi_Saran}
                  </Text>
                </PaperCard>
              );
            })
          )}
        </View>
      );
    }

    /* Admin Inbox Saran */
    return (
      <View style={styles.tabBody}>
        <PaperCard variant="sage" layerColor={COLORS.forest} showTape>
          <View style={styles.playIntroRow}>
            <Ionicons
              name="mail-unread-outline"
              size={22}
              color={COLORS.forest}
            />
            <View style={styles.playIntroTextCol}>
              <Text style={[styles.cardHeading, fonts.loraBold]}>
                Kotak Masuk Orang Tua / Wali
              </Text>
              <Text
                style={[styles.cardSubtext, fonts.sansRegular, { marginBottom: 0 }]}
              >
                Baca masukan dari wali murid dan tandai status baca secara
                real-time.
              </Text>
            </View>
          </View>
        </PaperCard>

        <View style={styles.chipWrap}>
          {['Semua', 'Belum Dibaca', 'Sudah Dibaca'].map((flt) => {
            const active = saranFilter === flt;
            return (
              <TouchableOpacity
                key={flt}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.8}
                onPress={() => setSaranFilter(flt)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    fonts.sansBold,
                    active && styles.filterPillTextActive,
                  ]}
                >
                  {flt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {visibleSaran.length === 0 ? (
          <PaperCard variant="ivory" layerColor={COLORS.sageDark}>
            <Text style={[styles.emptyStateText, fonts.sansRegular]}>
              Belum ada pesan pada filter “{saranFilter}”.
            </Text>
          </PaperCard>
        ) : (
          visibleSaran.map((item) => {
            const isRead = item.Status_Baca.toLowerCase() === 'sudah dibaca';
            return (
              <PaperCard
                key={item.ID || `${item.Tanggal}-${item.Nama_Wali}`}
                variant={isRead ? 'ivory' : 'sage'}
                layerColor={isRead ? COLORS.sageDark : COLORS.forest}
              >
                <View style={styles.progresCardTop}>
                  <View style={styles.progresDateBadge}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={COLORS.forest}
                    />
                    <Text style={[styles.progresDateText, fonts.sansBold]}>
                      {item.Tanggal || '-'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusHadirPill,
                      isRead
                        ? styles.statusHadirYes
                        : styles.statusHadirOther,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusHadirText,
                        fonts.sansBold,
                        isRead && { color: COLORS.ivory },
                      ]}
                    >
                      {item.Status_Baca}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.progresAnakName, fonts.loraBold]}>
                  {item.Nama_Wali || 'Orang Tua'} • Wali dari{' '}
                  {item.Nama_Anak || '-'}
                </Text>
                <Text style={[styles.progresCatatan, fonts.sansRegular]}>
                  {item.Isi_Saran}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.materiCheckBtn,
                    isRead && styles.materiCheckBtnActive,
                  ]}
                  activeOpacity={0.8}
                  disabled={mutating}
                  onPress={() => handleToggleSaranRead(item)}
                >
                  <Ionicons
                    name={isRead ? 'mail-open-outline' : 'checkmark-done'}
                    size={17}
                    color={isRead ? COLORS.ivory : COLORS.forest}
                  />
                  <Text
                    style={[
                      styles.materiCheckBtnText,
                      fonts.sansBold,
                      isRead && styles.materiCheckBtnTextActive,
                    ]}
                  >
                    {isRead
                      ? 'Tandai Belum Dibaca'
                      : 'Tandai Sudah Dibaca'}
                  </Text>
                </TouchableOpacity>
              </PaperCard>
            );
          })
        )}
      </View>
    );
  };

  /* Tab 5: Saktah Play */
  const renderSaktahPlayTab = () => {
    const filteredCards =
      doaFilter === 'Semua'
        ? DOA_ADAB_CARDS
        : DOA_ADAB_CARDS.filter((item) => item.kategori === doaFilter);

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

        {playMode === 'lipat' ? (
          <View>
            <View style={styles.chipWrap}>
              {['Semua', 'Doa Harian', 'Adab Anak'].map((cat) => {
                const active = doaFilter === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterPill,
                      active && styles.filterPillActive,
                    ]}
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
                      <Ionicons
                        name={card.ikon}
                        size={22}
                        color={COLORS.forest}
                      />
                    </View>
                    <View style={styles.foldFrontTextCol}>
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
                        <Text style={[styles.challengeLabel, fonts.sansBold]}>
                          TANTANGAN PRAKTIK BAIK
                        </Text>
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
                            name={
                              isDone ? 'checkmark-circle' : 'ellipse-outline'
                            }
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
        ) : quizFinished ? (
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
                  Untuk{' '}
                  {currentUser.Nama_Anak ||
                    currentUser.Nama_User ||
                    'Sahabat Saktah'}
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
              </View>
            </PaperCard>
          </Animated.View>
        ) : (
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
                const isAnswered = selectedQuizChoice !== undefined;
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
                      style={[
                        styles.quizOptionLetter,
                        { backgroundColor: letterBg },
                      ]}
                    >
                      <Text style={[styles.quizOptionLetterText, fonts.sansBold]}>
                        {['A', 'B', 'C', 'D'][idx]}
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

              {selectedQuizChoice !== undefined && (
                <View style={styles.quizFeedbackCard}>
                  <Text style={[styles.quizFeedbackHeading, fonts.sansBold]}>
                    {selectedQuizChoice === currentQuestion.jawabanBenar
                      ? 'MasyaAllah, Benar! +1 Bintang'
                      : 'Hampir tepat!'}
                  </Text>
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
                        ? 'Soal Berikutnya'
                        : 'Lihat Sertifikat Apresiasi'}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={COLORS.ivory}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </PaperCard>
          </View>
        )}
      </View>
    );
  };

  /* Floating Bottom Bar */
  const renderFloatingBottomBar = () => {
    const tabs = [
      { key: 'beranda', label: 'Beranda', icon: 'home-outline', activeIcon: 'home' },
      {
        key: 'kurikulum',
        label: 'Kurikulum',
        icon: 'layers-outline',
        activeIcon: 'layers',
      },
      {
        key: 'progres',
        label: 'Progres',
        icon: 'calendar-outline',
        activeIcon: 'calendar',
      },
      {
        key: 'saran',
        label: 'Saran',
        icon: 'chatbubble-ellipses-outline',
        activeIcon: 'chatbubble-ellipses',
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
                    size={19}
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
              {renderSyncBanner()}
              {showTentang ? (
                renderTentangPage()
              ) : (
                <>
                  {activeTab === 'beranda' && renderBerandaTab()}
                  {activeTab === 'kurikulum' && renderKurikulumTab()}
                  {activeTab === 'progres' && renderProgresTab()}
                  {activeTab === 'saran' && renderSaranTab()}
                  {activeTab === 'play' && renderSaktahPlayTab()}
                </>
              )}
            </View>
          </ScrollView>

          {renderFloatingBottomBar()}
        </View>
      </KeyboardAvoidingView>

      {/* Modal Tambah / Edit Kurikulum (Admin) */}
      <Modal
        visible={kurikulumModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setKurikulumModal((prev) => ({ ...prev, visible: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                {kurikulumModal.mode === 'edit'
                  ? 'Edit Materi Kurikulum'
                  : 'Tambah Materi Kurikulum'}
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Perubahan langsung disimpan ke tab Kurikulum di Google Sheets.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Bulan *</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={kurikulumModal.bulan}
                onChangeText={(text) =>
                  setKurikulumModal((prev) => ({
                    ...prev,
                    bulan: text,
                    error: '',
                  }))
                }
                placeholder="Contoh: Bulan 1 atau November 2026"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Minggu</Text>
              <View style={styles.chipWrap}>
                {MINGGU_OPTIONS.map((mg) => {
                  const selected = kurikulumModal.minggu === mg;
                  return (
                    <TouchableOpacity
                      key={mg}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setKurikulumModal((prev) => ({ ...prev, minggu: mg }))
                      }
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansBold,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {mg}
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
                value={kurikulumModal.judul}
                onChangeText={(text) =>
                  setKurikulumModal((prev) => ({
                    ...prev,
                    judul: text,
                    error: '',
                  }))
                }
                placeholder="Contoh: Huruf Vokal & Doa Belajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>Deskripsi</Text>
              <TextInput
                style={[styles.noteTextInput, fonts.sansRegular]}
                value={kurikulumModal.deskripsi}
                onChangeText={(text) =>
                  setKurikulumModal((prev) => ({ ...prev, deskripsi: text }))
                }
                placeholder="Kegiatan belajar & media yang digunakan..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />

              {kurikulumModal.error ? (
                <Text style={[styles.errorText, fonts.sansBold, { marginTop: 8 }]}>
                  {kurikulumModal.error}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
                activeOpacity={0.82}
                disabled={mutating}
                onPress={handleSubmitKurikulum}
              >
                {mutating ? (
                  <ActivityIndicator size="small" color={COLORS.ivory} />
                ) : (
                  <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                    Simpan ke Google Sheets
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                disabled={mutating}
                onPress={() =>
                  setKurikulumModal((prev) => ({ ...prev, visible: false }))
                }
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah / Edit Progres (Admin) */}
      <Modal
        visible={progresModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setProgresModal((prev) => ({ ...prev, visible: false }))
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalTitle, fonts.loraBold]}>
                {progresModal.mode === 'edit'
                  ? 'Edit Catatan Progres'
                  : 'Catat Progres Murid'}
              </Text>
              <Text style={[styles.modalSub, fonts.sansRegular]}>
                Data akan tersimpan ke tab Progres Google Sheets.
              </Text>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Tanggal *</Text>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={progresModal.tanggal}
                onChangeText={(text) =>
                  setProgresModal((prev) => ({
                    ...prev,
                    tanggal: text,
                    error: '',
                  }))
                }
                placeholder="Contoh: 26 Nov 2026"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Nama Anak *
              </Text>
              {studentNamesPool.length > 0 && (
                <View style={styles.chipWrap}>
                  {studentNamesPool.map((nm) => {
                    const selected = progresModal.namaAnak === nm;
                    return (
                      <TouchableOpacity
                        key={nm}
                        style={[
                          styles.choiceChip,
                          selected && styles.choiceChipActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setProgresModal((prev) => ({
                            ...prev,
                            namaAnak: nm,
                            error: '',
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.choiceChipText,
                            fonts.sansSemi,
                            selected && styles.choiceChipTextActive,
                          ]}
                        >
                          {nm}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={progresModal.namaAnak}
                onChangeText={(text) =>
                  setProgresModal((prev) => ({
                    ...prev,
                    namaAnak: text,
                    error: '',
                  }))
                }
                placeholder="Ketik nama anak"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Status Hadir
              </Text>
              <View style={styles.chipWrap}>
                {STATUS_HADIR_OPTIONS.map((st) => {
                  const selected = progresModal.statusHadir === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setProgresModal((prev) => ({ ...prev, statusHadir: st }))
                      }
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansBold,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, fonts.sansBold]}>Pengajar</Text>
              <View style={styles.chipWrap}>
                {PENGAJAR_OPTIONS.map((pg) => {
                  const selected = progresModal.pengajar === pg;
                  return (
                    <TouchableOpacity
                      key={pg}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        setProgresModal((prev) => ({ ...prev, pengajar: pg }))
                      }
                    >
                      <Text
                        style={[
                          styles.choiceChipText,
                          fonts.sansSemi,
                          selected && styles.choiceChipTextActive,
                        ]}
                      >
                        {pg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                style={[styles.textInput, fonts.sansRegular]}
                value={progresModal.pengajar}
                onChangeText={(text) =>
                  setProgresModal((prev) => ({ ...prev, pengajar: text }))
                }
                placeholder="Nama pengajar"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={[styles.inputLabel, fonts.sansBold]}>
                Catatan Perkembangan
              </Text>
              <View style={styles.tagRow}>
                {CAPAIAN_TAGS.map((tag) => {
                  const active = progresModal.catatan.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, active && styles.tagChipActive]}
                      activeOpacity={0.78}
                      onPress={() => toggleProgresTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagChipText,
                          fonts.sansSemi,
                          active && styles.tagChipTextActive,
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
                value={progresModal.catatan}
                onChangeText={(text) =>
                  setProgresModal((prev) => ({ ...prev, catatan: text }))
                }
                placeholder="Tulis catatan capaian belajar murid..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                textAlignVertical="top"
              />

              {progresModal.error ? (
                <Text style={[styles.errorText, fonts.sansBold, { marginTop: 8 }]}>
                  {progresModal.error}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 14 }]}
                activeOpacity={0.82}
                disabled={mutating}
                onPress={handleSubmitProgres}
              >
                {mutating ? (
                  <ActivityIndicator size="small" color={COLORS.ivory} />
                ) : (
                  <Text style={[styles.modalPrimaryBtnText, fonts.sansBold]}>
                    Simpan ke Google Sheets
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                activeOpacity={0.82}
                disabled={mutating}
                onPress={() =>
                  setProgresModal((prev) => ({ ...prev, visible: false }))
                }
              >
                <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Konfirmasi Hapus (Admin) */}
      <Modal
        visible={deleteConfirmModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDeleteConfirmModal({
            visible: false,
            sheet: '',
            id: '',
            label: '',
          })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, fonts.loraBold]}>
              Hapus Data {deleteConfirmModal.sheet}?
            </Text>
            <Text style={[styles.modalBody, fonts.sansRegular]}>
              Apakah Anda yakin ingin menghapus “{deleteConfirmModal.label}” dari
              Google Sheets?
            </Text>

            <TouchableOpacity
              style={styles.modalDangerBtn}
              activeOpacity={0.82}
              disabled={mutating}
              onPress={handleConfirmDelete}
            >
              {mutating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={[styles.modalDangerBtnText, fonts.sansBold]}>
                  Ya, Hapus Data
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              activeOpacity={0.82}
              disabled={mutating}
              onPress={() =>
                setDeleteConfirmModal({
                  visible: false,
                  sheet: '',
                  id: '',
                  label: '',
                })
              }
            >
              <Text style={[styles.modalSecondaryBtnText, fonts.sansBold]}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Konfirmasi Keluar (Logout) */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, fonts.loraBold]}>
              Keluar dari Akun?
            </Text>
            <Text style={[styles.modalBody, fonts.sansRegular]}>
              Sesi atas nama “{currentUser.Nama_User || currentUser.Kode_Masuk}”
              akan dihapus dari perangkat ini.
            </Text>

            <TouchableOpacity
              style={styles.modalDangerBtn}
              activeOpacity={0.82}
              onPress={handleConfirmLogout}
            >
              <Text style={[styles.modalDangerBtnText, fonts.sansBold]}>
                Ya, Keluar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              activeOpacity={0.82}
              onPress={() => setLogoutModalVisible(false)}
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

  /* Splash & Login */
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashLogoWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.ivory,
    borderWidth: 2,
    borderColor: COLORS.forest,
    padding: 8,
    marginBottom: 14,
  },
  splashTitle: {
    fontSize: 24,
    color: COLORS.moss,
  },
  splashSub: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  loginScrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  loginBrandHeader: {
    alignItems: 'center',
    marginBottom: 22,
  },
  loginLogoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.ivory,
    borderWidth: 2,
    borderColor: COLORS.forest,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loginTitle: {
    fontSize: 26,
    color: COLORS.moss,
  },
  loginSubtitle: {
    fontSize: 14,
    color: COLORS.forest,
    marginTop: 3,
  },
  loginCardHeading: {
    fontSize: 19,
    color: COLORS.moss,
    marginBottom: 6,
  },
  loginCardDesc: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  loginInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: COLORS.forest,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 12,
  },
  loginTextInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.moss,
    paddingVertical: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.dangerText,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.dangerText,
    lineHeight: 18,
  },
  loginSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.forest,
    borderRadius: 15,
    minHeight: 54,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  loginSubmitText: {
    fontSize: 15.5,
    color: COLORS.ivory,
  },
  loginInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  loginInfoTextCol: {
    flex: 1,
  },
  loginInfoTitle: {
    fontSize: 14,
    color: COLORS.moss,
    marginBottom: 2,
  },
  loginInfoDesc: {
    fontSize: 12.5,
    color: COLORS.textBody,
    lineHeight: 18,
  },

  /* Scrapbook PaperCard */
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
    paddingBottom: 18,
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
    marginBottom: 13,
  },
  logoFrame: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.ivory,
    borderWidth: 1.8,
    borderColor: COLORS.goldBorder,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  heroTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  heroTitle: {
    fontSize: 21,
    color: COLORS.ivory,
  },
  heroTagline: {
    fontSize: 12.5,
    color: COLORS.goldSoft,
    marginTop: 2,
  },
  logoutPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.ivory,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    paddingHorizontal: 11,
    paddingVertical: 7,
    minHeight: 36,
  },
  logoutPillText: {
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
  heroUserGreeting: {
    fontSize: 14,
    color: COLORS.goldSoft,
    marginBottom: 2,
  },
  heroGreetingText: {
    fontSize: 12.5,
    color: COLORS.cream,
    lineHeight: 18,
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
    fontSize: 17.5,
    color: COLORS.ivory,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.cream,
    marginTop: 1,
  },
  headerRefreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Sync & Error Banners */
  syncErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncErrorTitle: {
    fontSize: 13.5,
    color: COLORS.dangerText,
  },
  syncErrorDesc: {
    fontSize: 12,
    color: COLORS.textBody,
    marginTop: 2,
    lineHeight: 17,
  },
  syncRetryBtn: {
    backgroundColor: COLORS.forest,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  syncRetryText: {
    fontSize: 12,
    color: COLORS.ivory,
  },

  syncStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  syncStripLeft: {
    flex: 1,
  },
  liveDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.forest,
  },
  syncStripTitle: {
    fontSize: 14.5,
    color: COLORS.moss,
    marginTop: 3,
  },
  syncNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.forest,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minHeight: 38,
  },
  syncNowText: {
    fontSize: 12,
    color: COLORS.ivory,
  },

  /* Common Headings */
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
  emptyStateText: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingVertical: 8,
  },

  /* Beranda Session & Shortcuts */
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
    marginBottom: 12,
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
    marginBottom: 12,
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
    backgroundColor: COLORS.ivory,
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

  /* Kurikulum */
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
    minHeight: 42,
    marginBottom: 10,
  },
  backToListText: {
    fontSize: 13,
    color: COLORS.forest,
  },
  monthDetailTitle: {
    fontSize: 19,
    color: COLORS.moss,
    marginTop: 3,
    marginBottom: 4,
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
  monthOpenCue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  monthOpenCueText: {
    fontSize: 12.5,
    color: COLORS.forest,
  },
  monthCardTitle: {
    fontSize: 17.5,
    color: COLORS.moss,
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 4,
  },
  previewRowText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.textBody,
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
  idTinyText: {
    fontSize: 10.5,
    color: COLORS.textMuted,
  },
  materiJudul: {
    fontSize: 16,
    color: COLORS.moss,
    marginBottom: 4,
  },
  materiDesc: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  adminActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.sageDark,
  },
  adminEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.sage,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.forest,
    minHeight: 42,
  },
  adminEditBtnText: {
    fontSize: 13,
    color: COLORS.forest,
  },
  adminDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.dangerText,
    minHeight: 42,
  },
  adminDeleteBtnText: {
    fontSize: 13,
    color: COLORS.dangerText,
  },

  /* Progres */
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cream,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    padding: 4,
  },
  memberCardLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
  memberCardOrg: {
    fontSize: 16,
    color: COLORS.moss,
  },
  memberCardLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.7,
    marginTop: 1,
  },
  progressBadge: {
    backgroundColor: COLORS.forest,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  progressBadgeText: {
    fontSize: 12.5,
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
    backgroundColor: COLORS.creamDark,
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
  stampMiniWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  stampMiniCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampMiniCircleActive: {
    backgroundColor: COLORS.forest,
  },
  stampMiniCircleIdle: {
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.forest,
  },
  stampMiniNum: {
    fontSize: 11.5,
    color: COLORS.textMuted,
  },
  memberSwitchScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  progresCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  progresDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  progresDateText: {
    fontSize: 12,
    color: COLORS.forest,
  },
  statusHadirPill: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusHadirYes: {
    backgroundColor: COLORS.forest,
  },
  statusHadirOther: {
    backgroundColor: COLORS.goldSoft,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  statusHadirText: {
    fontSize: 11,
    color: COLORS.moss,
  },
  progresAnakName: {
    fontSize: 16,
    color: COLORS.moss,
    marginBottom: 4,
  },
  progresCatatan: {
    fontSize: 13.5,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  progresMetaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pengajarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pengajarBadgeText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /* Saran */
  waliSenderInfo: {
    backgroundColor: COLORS.sage,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  waliSenderText: {
    fontSize: 12.5,
    color: COLORS.forest,
  },
  saranTextArea: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    paddingHorizontal: 13,
    paddingVertical: 11,
    minHeight: 110,
    fontSize: 14,
    color: COLORS.moss,
    lineHeight: 21,
    marginBottom: 12,
  },
  saranFeedbackBox: {
    backgroundColor: COLORS.sage,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.forest,
    padding: 10,
    marginBottom: 12,
  },
  saranFeedbackText: {
    fontSize: 12.5,
    color: COLORS.forest,
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
    marginTop: 12,
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

  /* Inputs & Chips */
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
  noteTextInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.sageDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 74,
    fontSize: 13.5,
    color: COLORS.moss,
    lineHeight: 20,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
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
    fontSize: 12.5,
    color: COLORS.moss,
  },
  filterPillTextActive: {
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

  waPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: COLORS.forest,
    borderRadius: 15,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  waPrimaryBtnText: {
    fontSize: 14,
    color: COLORS.ivory,
  },

  /* Saktah Play */
  playIntroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  playIntroTextCol: {
    flex: 1,
  },
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
  challengeLabel: {
    fontSize: 11,
    color: COLORS.forest,
    letterSpacing: 0.6,
    marginBottom: 4,
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
  quizTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: COLORS.sage,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.forest,
    padding: 14,
    marginTop: 6,
  },
  quizFeedbackHeading: {
    fontSize: 14.5,
    color: COLORS.moss,
    marginBottom: 4,
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
    minHeight: 50,
    paddingHorizontal: 16,
    width: '100%',
  },
  quizPrimaryBtnText: {
    fontSize: 14.5,
    color: COLORS.ivory,
  },
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
    marginBottom: 18,
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

  /* Tentang */
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
    minHeight: 50,
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
    paddingHorizontal: 12,
  },
  floatingPillWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 560,
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
    padding: 5,
    gap: 2,
  },
  floatingTabItem: {
    flex: 1,
    minHeight: 50,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  floatingTabItemActive: {
    backgroundColor: COLORS.ivory,
  },
  floatingTabLabel: {
    fontSize: 10,
    color: COLORS.cream,
    marginTop: 2,
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
    marginBottom: 8,
  },
});
