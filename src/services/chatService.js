export const getDiagnosisReply = async (userMessage) => {
  const lower = userMessage.toLowerCase();

  if (lower.includes('ac') || lower.includes('dingin') || lower.includes('freon') || lower.includes('angin')) {
    return {
      text: 'Apakah AC masih mengeluarkan hembusan angin tetapi suhunya tidak dingin, atau sama sekali mati total?',
      suggestions: [
        'Ya, anginnya keluar tetapi tidak dingin.',
        'Tidak ada udara yang keluar.',
        'Ada bunyi aneh saat AC dinyalakan',
      ],
      summary: 'Keluhan: AC bermasalah (suhu / kompresor). Perlu pemeriksaan & cuci AC oleh teknisi spesialis pendingin.',
      recommendedCategory: 'Perangkat Elektronik',
      recommendedSub: 'AC & Pendingin',
    };
  }

  if (lower.includes('kulkas') || lower.includes('freezer') || lower.includes('beku')) {
    return {
      text: 'Untuk kulkas, apakah lampu di dalam menyala dan kompresor bergetar normal di bagian belakang?',
      suggestions: [
        'Freezer dingin tapi bagian bawah tidak dingin',
        'Kulkas mati total dan bau gosong',
        'Air sering bocor merembes ke lantai',
      ],
      summary: 'Keluhan: Kulkas tidak optimal dingin. Kemungkinan freon kurang atau sensor defrost rusak.',
      recommendedCategory: 'Perangkat Elektronik',
      recommendedSub: 'Kulkas & Freezer',
    };
  }

  if (lower.includes('listrik') || lower.includes('mcb') || lower.includes('jeglek') || lower.includes('korslet')) {
    return {
      text: 'Apakah MCB langsung turun seketika alat tertentu dicolokkan, atau mati satu rumah secara acak?',
      suggestions: [
        'Jeglek saat nyalakan pompa/AC',
        'Stop kontak keluar percikan api',
        'Lampu berkedip tidak stabil',
      ],
      summary: 'Keluhan: Masalah beban kelistrikan / korsleting kabel. Diperlukan teknisi listrik berlisensi segera.',
      recommendedCategory: 'Listrik Bangunan',
      recommendedSub: 'Kelistrikan & MCB',
    };
  }

  if (lower.includes('pipa') || lower.includes('bocor') || lower.includes('air') || lower.includes('mampet') || lower.includes('kran')) {
    return {
      text: 'Apakah kebocoran terjadi pada pipa saluran masuk bertekanan, atau saluran pembuangan wastafel yang tersumbat?',
      suggestions: [
        'Pipa bocor di balik dinding/atap',
        'Wastafel cuci piring mampet total',
        'Kran air patah di dalam drat',
      ],
      summary: 'Keluhan: Masalah perpipaan air / kebocoran. Diperlukan penanganan teknisi ledeng & plumbing.',
      recommendedCategory: 'Ledeng',
      recommendedSub: 'Pipa & Kran Air',
    };
  }

  return {
    text: 'Baik, saya catat keluhan Anda. Apakah Anda memerlukan pemeriksaan teknisi hari ini atau dijadwalkan besok?',
    suggestions: [
      'Panggil sekarang (secepatnya)',
      'Jadwalkan untuk besok pagi',
      'Ingin tahu estimasi biaya dulu',
    ],
    summary: `Keluhan: "${userMessage}". Siap disambungkan ke teknisi terdekat untuk inspeksi langsung.`,
    recommendedCategory: 'Perangkat Elektronik',
    recommendedSub: 'Servis Umum',
  };
};
