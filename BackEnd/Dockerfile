# Menggunakan image Python versi ringan
FROM python:3.10-slim

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin seluruh kode (termasuk folder BackEnd) ke dalam container
COPY . .

# Menginstal dependensi khusus dari dalam folder BackEnd
RUN pip install --no-cache-dir -r BackEnd/requirements.txt

# Mengekspos port 7860 yang diwajibkan oleh Hugging Face Spaces
EXPOSE 7860

# Menjalankan server FastAPI dengan menunjuk langsung ke folder BackEnd
# Formatnya: NamaFolder.NamaFile:app
CMD ["uvicorn", "BackEnd.backend:app", "--host", "0.0.0.0", "--port", "7860"]