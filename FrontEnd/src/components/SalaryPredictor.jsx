import React, { useState } from 'react';
import appBgImage from '../assets/bg-salary.png';
import moneyBag from '../assets/money-bag.png';
import coins from '../assets/coins.png';

// ── Nilai harus PERSIS sama dengan yang ada di training data ──────────────────
const EDU_OPTIONS = [
  { label: "SMA/SMK",        value: "SMA/SMK" },
  { label: "Diploma (D3/D4)", value: "Diploma (D3/D4)" },
  { label: "Sarjana (S1)",    value: "S1" },        // value dikirim = "S1"
  { label: "Magister (S2)",   value: "S2" },
  { label: "Doktor (S3)",     value: "S3" },
];

// Nilai HARUS persis sama dengan career_level di dataset
const CAREER_OPTIONS = [
  { label: "Fresh Graduate / < 1 Tahun", value: "Lulusan baru/Pengalaman kerja kurang dari 1 tahun" },
  { label: "Pegawai / Staff",            value: "Pegawai (non-manajemen & non-supervisor)" },
  { label: "Supervisor / Koordinator",   value: "Supervisor/Koordinator" },
  { label: "Manajer / Asisten Manajer",  value: "Manajer/Asisten Manajer" },
  { label: "CEO / GM / Direktur",        value: "CEO/GM/Direktur/Manajer Senior" },
  { label: "Tidak Terspesifikasi",       value: "Tidak Terspesifikasi" },
];

const SIZE_OPTIONS = [
  { label: "Kecil  (< 50 org)",       value: "Kecil" },
  { label: "Menengah (50–500 org)",   value: "Menengah" },
  { label: "Besar (500–2000 org)",    value: "Besar" },
  { label: "Sangat Besar (> 2000)",   value: "Sangat Besar" },
];

// Nilai HARUS persis sama dengan company_industry di dataset (top 10 + Lainnya)
const INDUSTRY_OPTIONS = [
  { label: "IT / Perangkat Lunak",    value: "Komputer/Teknik Informatika (Perangkat Lunak)" },
  { label: "Manajemen / Konsulting",  value: "Manajemen/Konsulting HR" },
  { label: "Keuangan / Akuntansi",    value: "Akuntansi/Keuangan" },
  { label: "Pemasaran / Media",       value: "Pemasaran/Humas/Media" },
  { label: "Teknik / Engineering",    value: "Teknik/Engineering" },
  { label: "Retail / Perdagangan",    value: "Retail/Perdagangan" },
  { label: "Manufaktur / Produksi",   value: "Manufaktur/Produksi" },
  { label: "Pendidikan / Pelatihan",  value: "Pendidikan/Pelatihan" },
  { label: "Kesehatan / Medis",       value: "Kesehatan/Medis" },
  { label: "Properti / Real Estate",  value: "Properti/Real Estate" },
  { label: "Lainnya",                 value: "Lainnya" },
];

// Mapping lokasi → region (HURUF KAPITAL = format training data)
const REGION_MAP = {
  "Jakarta Pusat":    "DKI JAKARTA",
  "Jakarta Selatan":  "DKI JAKARTA",
  "Jakarta Utara":    "DKI JAKARTA",
  "Jakarta Barat":    "DKI JAKARTA",
  "Jakarta Timur":    "DKI JAKARTA",
  "Bandung":          "JAWA BARAT",
  "Bekasi":           "JAWA BARAT",
  "Bogor":            "JAWA BARAT",
  "Depok":            "JAWA BARAT",
  "Tangerang":        "BANTEN",
  "Tangerang Selatan":"BANTEN",
  "Semarang":         "JAWA TENGAH",
  "Solo":             "JAWA TENGAH",
  "Surabaya":         "JAWA TIMUR",
  "Malang":           "JAWA TIMUR",
  "Yogyakarta":       "DI YOGYAKARTA",
  "Denpasar":         "BALI",
};

const SalaryPredictor = () => {
  const [formData, setFormData] = useState({
    job_title:    '',
    location:     'Jakarta Pusat',
    experience:   0,
    career_level: 'Pegawai (non-manajemen & non-supervisor)',
    education:    'S1',           // value, bukan label
    company_size: 'Menengah',
    industry:     'Komputer/Teknik Informatika (Perangkat Lunak)',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading]       = useState(false);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    const regionValue = REGION_MAP[formData.location] ?? "DKI JAKARTA";

    const payload = {
      pengalamanKerja: parseFloat(formData.experience) || 0,
      mapped_region:   regionValue,          // contoh: "DKI JAKARTA"
      career_level:    formData.career_level,
      edu_simple:      formData.education,   // contoh: "S1"
      size_simple:     formData.company_size,
      industry_simple: formData.industry,
    };

    try {
      console.log("Payload dikirim:", payload);
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPrediction(data.prediction);
      } else {
        alert('Pesan dari server: ' + JSON.stringify(data.detail));
      }
    } catch (error) {
      console.error('Error sambung ke Backend:', error);
      alert('Gagal menyambung! Pastikan Backend berjalan di port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F0E6FF] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 relative overflow-hidden font-sans"
      style={{ backgroundImage: `url(${appBgImage})` }}
    >
      <div className="relative max-w-md w-full">
        <img src={moneyBag} className="absolute -top-16 -right-12 w-35 h-50 z-20 drop-shadow-2xl animate-float" alt="" />
        <img src={coins}    className="absolute -bottom-10 -left-12 w-35 h-55 z-20 drop-shadow-xl rotate-12" alt="" />

        <div className="relative z-10 bg-white/75 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-10 border border-white/40">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">SalaryPredict</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Estimasi gaji berdasarkan data Kelompok 1</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePredict} className="space-y-5">

            {/* Posisi Pekerjaan */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Posisi Pekerjaan</label>
              <input
                type="text"
                required
                placeholder="Ex: Software Engineer"
                className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                onChange={handleChange('job_title')}
              />
            </div>

            {/* Lokasi + Pengalaman */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Lokasi</label>
                <select
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.location}
                  onChange={handleChange('location')}
                >
                  {Object.keys(REGION_MAP).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Pengalaman (Thn)</label>
                <input
                  type="number"
                  min="0"
                  defaultValue={0}
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  onChange={handleChange('experience')}
                />
              </div>
            </div>

            {/* Career Level + Pendidikan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Level Karir</label>
                <select
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.career_level}
                  onChange={handleChange('career_level')}
                >
                  {CAREER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Pendidikan</label>
                <select
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.education}
                  onChange={handleChange('education')}
                >
                  {EDU_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ukuran Perusahaan + Industri */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Ukuran Perusahaan</label>
                <select
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.company_size}
                  onChange={handleChange('company_size')}
                >
                  {SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Industri</label>
                <select
                  className="w-full p-4 bg-gray-50/40 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.industry}
                  onChange={handleChange('industry')}
                >
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tombol Prediksi */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4E6AFF] hover:bg-[#3B53D9] text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-blue-200 active:scale-[0.97] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'MEMPROSES...' : 'PREDICT NOW!'}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {/* Hasil Prediksi */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estimasi Gaji Bulanan</p>
            <div className="text-4xl font-black text-blue-600 mt-2">
              {prediction !== null
                ? `Rp ${prediction.toLocaleString('id-ID')}`
                : <span className="text-gray-300">—</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SalaryPredictor;