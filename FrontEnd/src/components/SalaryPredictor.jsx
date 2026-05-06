import React, { useState } from 'react';

const SalaryPredictor = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#E0C3FC] via-[#FBC2EB] to-[#A18CD1] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">SalaryPredict</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Prediksi gaji berdasarkan data</p>
        </div>
        
        <form className="space-y-5">
          {/* Input Wajib 1: Job Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Posisi Pekerjaan</label>
            <input type="text" placeholder="Contoh: Tax Supervisor" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
          </div>

          {/* Input Wajib 2: Location */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lokasi</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Jakarta Pusat</option>
              <option>Banten</option>
              <option>Tangerang</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Wajib 3: Experience */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pengalaman (Thn)</label>
              <input type="number" min="0" placeholder="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            {/* Input Wajib 4: Career Level */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Level Karir</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option>Staff</option>
                <option>Supervisor</option>
                <option>Manager</option>
              </select>
            </div>
          </div>

          {/* Input Tambahan: Education */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pendidikan Terakhir</label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>SMA/SMK</option>
              <option>Sarjana (S1)</option>
              <option>Magister (S2)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all mt-4">
            HITUNG ESTIMASI GAJI
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-dashed border-gray-200 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hasil Prediksi</p>
          <div className="text-4xl font-black text-blue-600 mt-2">Rp 0</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPredictor;