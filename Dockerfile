# Menggunakan image Python versi ringan
FROM python:3.10-slim

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin seluruh file ke dalam container
COPY . .

# Menginstal dependensi dari dalam folder BackEnd
RUN pip install --no-cache-dir -r BackEnd/requirements.txt

# Mengekspos port 7860
EXPOSE 7860

# Menjalankan server FastAPI dari dalam folder BackEnd
CMD ["uvicorn", "BackEnd.backend:app", "--host", "0.0.0.0", "--port", "7860"]