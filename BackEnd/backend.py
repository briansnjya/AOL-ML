from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(
    title="API Prediksi Gaji Karyawan",
    description="Backend untuk memprediksi gaji berdasarkan pengalaman, wilayah, dan level karir."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "Model", "model_gaji_linear.pkl")

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None
    print("Peringatan: File model_gaji_linear.pkl tidak ditemukan!")

# Look-up table 
reference_data = {
    "DKI JAKARTA":   {"umr": 5067381,  "rata2_gaji": 7500000},
    "JAWA BARAT":    {"umr": 2157000,  "rata2_gaji": 4800000},
    "BANTEN":        {"umr": 4500000,  "rata2_gaji": 5800000},
    "JAWA TENGAH":   {"umr": 2036000,  "rata2_gaji": 3500000},
    "JAWA TIMUR":    {"umr": 2040000,  "rata2_gaji": 4200000},
    "DI YOGYAKARTA": {"umr": 2125000,  "rata2_gaji": 3800000},
    "BALI":          {"umr": 2900000,  "rata2_gaji": 4500000},
}

EDU_MAPPING = {
    "S1":              "S1",
    "Sarjana (S1)":    "S1",
    "S2":              "S2",
    "Magister (S2)":   "S2",
    "S3":              "S3",
    "Doktor (S3)":     "S3",
    "D3":              "Diploma",
    "D4":              "Diploma",
    "Diploma (D3/D4)": "Diploma",
    "SMA":             "SMA/SMK",
    "SMA/SMK":         "SMA/SMK",
    "Lainnya":         "Lainnya",
}

SIZE_MAPPING = {
    "Sangat Besar": "Sangat Besar",  
    "Besar":        "Besar",          
    "Menengah":     "Menengah",       
    "Kecil":        "Kecil",          
    "Medium":       "Menengah",        
    "Large":        "Besar",
    "Small":        "Kecil",
}


REGION_MAPPING = {
  
    "Jakarta Pusat":   "DKI JAKARTA",
    "Jakarta Selatan": "DKI JAKARTA",
    "Jakarta Utara":   "DKI JAKARTA",
    "Jakarta Barat":   "DKI JAKARTA",
    "Jakarta Timur":   "DKI JAKARTA",
    "Jakarta Raya":    "DKI JAKARTA",
    "DKI Jakarta":     "DKI JAKARTA",
    "DKI JAKARTA":     "DKI JAKARTA",
   
    "Bandung":         "JAWA BARAT",
    "Bekasi":          "JAWA BARAT",
    "Bogor":           "JAWA BARAT",
    "Depok":           "JAWA BARAT",
    "Jawa Barat":      "JAWA BARAT",
    "JAWA BARAT":      "JAWA BARAT",
   
    "Tangerang":       "BANTEN",
    "Tangerang Selatan": "BANTEN",
    "Serang":          "BANTEN",
    "Cilegon":         "BANTEN",
    "Banten":          "BANTEN",
    "BANTEN":          "BANTEN",
    
    "Semarang":        "JAWA TENGAH",
    "Solo":            "JAWA TENGAH",
    "Jawa Tengah":     "JAWA TENGAH",
    "JAWA TENGAH":     "JAWA TENGAH",
   
    "Surabaya":        "JAWA TIMUR",
    "Malang":          "JAWA TIMUR",
    "JAWA TIMUR":      "JAWA TIMUR",
    
    "Yogyakarta":      "DI YOGYAKARTA",
    "DI YOGYAKARTA":   "DI YOGYAKARTA",
    
    "Denpasar":        "BALI",
    "Bali":            "BALI",
    "BALI":            "BALI",
}

JOB_TITLE_MAPPING = {
    "Sales Executive":         "Sales Executive",
    "Digital Marketing":       "Digital Marketing",
    "Graphic Designer":        "Graphic Designer",
    "Sales Officer":           "Sales Officer",
    "Content Creator":         "Content Creator",
    "Accounting Staff":        "Accounting Staff",
    "Sales Engineer":          "Sales Engineer",
    "Account Executive":       "Account Executive",
    "Sales Marketing":         "Sales Marketing",
    "Sales Manager":           "Sales Manager",
    "Telemarketing":           "Telemarketing",
    "Marketing Executive":     "Marketing Executive",
    "Interior Designer":       "Interior Designer",
    "Hr Staff":                "Hr Staff",
    "Social Media Specialist": "Social Media Specialist",
    "Area Sales Supervisor":   "Area Sales Supervisor",
    "Project Manager":         "Project Manager",
    "Marketing Staff":         "Marketing Staff",
    "Lainnya":                 "Lainnya",
}

class SalaryInput(BaseModel):
    job_title:        str
    pengalamanKerja:  float
    mapped_region:    str
    career_level:     str
    edu_simple:       str
    size_simple:      str
    industry_simple:  str


@app.get("/")
def read_root():
    return {"message": "Selamat datang di API Prediksi Gaji"}


@app.post("/predict")
async def predict_salary(data: SalaryInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum siap.")

    
    region_key    = REGION_MAPPING.get(data.mapped_region, data.mapped_region.upper())
    edu_mapped    = EDU_MAPPING.get(data.edu_simple, "Lainnya")
    size_mapped   = SIZE_MAPPING.get(data.size_simple, "Tidak Diketahui")
    career_mapped = data.career_level
    job_mapped    = JOB_TITLE_MAPPING.get(data.job_title, data.job_title)

    region_info = reference_data.get(region_key)
    if not region_info:
        raise HTTPException(
            status_code=400,
            detail=f"Wilayah '{data.mapped_region}' (→ '{region_key}') tidak ditemukan dalam database."
        )

    input_features = pd.DataFrame([{
        "pengalamanKerja":  data.pengalamanKerja,
        "rata2Gaji":        region_info["rata2_gaji"],
        "UMR":              region_info["umr"],
        "career_level":     career_mapped,
        "mapped_region":    region_key,
        "edu_simple":       edu_mapped,
        "size_simple":      size_mapped,
        "industry_simple":  data.industry_simple,
        "job_title":        job_mapped,
    }])

    try:
        prediction = model.predict(input_features)
        return {
            "status":     "success",
            "prediction": round(float(prediction[0]), 0),
            "currency":   "IDR",
            "details": {
                "job_title_used": job_mapped,
                "region_used":   region_key,
                "umr_applied":   region_info["umr"],
                "edu_mapped":    edu_mapped,
                "size_mapped":   size_mapped,
                "career_mapped": career_mapped,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan prediksi: {str(e)}")