from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(
    title="API Prediksi Gaji Karyawan",
    description="Backend untuk memprediksi gaji berdasarkan pengalaman, wilayah, dan level karir."
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "..", "Model", "model_gaji_linear.pkl")

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None
    print("Peringatan: File model_gaji_linear.pkl tidak ditemukan!")

# look up table
reference_data = {
    "DKI Jakarta": {"umr": 5067381, "rata2_gaji": 7500000},
    "Jawa Barat": {"umr": 2157000, "rata2_gaji": 4800000},
    "Banten": {"umr": 4500000, "rata2_gaji": 5800000},
    "Jawa Tengah": {"umr": 2036000, "rata2_gaji": 3500000}

}

# inputan frontend
class SalaryInput(BaseModel):
    pengalamanKerja: float
    mapped_region: str
    career_level: str
    edu_simple: str        
    size_simple: str      
    industry_simple: str

@app.get("/")
def read_root():
    return {"message": "Selamat datang di API Prediksi Gaji"}

# 4. prediksi
@app.post("/predict")
async def predict_salary(data: SalaryInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum siap.")

    # ambil UMR sama rata rata gaji berdasarkan region
    region_info = reference_data.get(data.mapped_region)
    if not region_info:
        raise HTTPException(status_code=400, detail="Wilayah tidak ditemukan dalam database.")


    input_features = pd.DataFrame([{
        "pengalamanKerja": data.pengalamanKerja,
        "rata2Gaji": region_info["rata2_gaji"],
        "UMR": region_info["umr"],
        "career_level": data.career_level,
        "mapped_region": data.mapped_region,
        "edu_simple": data.edu_simple,     
        "size_simple": data.size_simple,        
        "industry_simple": data.industry_simple
    }])

    try:
        # C. Lakukan Prediksi
        prediction = model.predict(input_features)
        
        return {
            "status": "success",
            "prediction": round(float(prediction[0]), 0),
            "currency": "IDR",
            "details": {
                "region_used": data.mapped_region,
                "umr_applied": region_info["umr"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan prediksi: {str(e)}")