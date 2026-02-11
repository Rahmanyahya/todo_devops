# 🚀 DevOps Case Study Project
## Two-Tier Todo List Application with Docker & GitHub Actions

---

## 📌 Project Overview

Dalam project ini kamu berperan sebagai **DevOps Engineer** yang bertugas membangun sistem deployment otomatis untuk aplikasi **Todo List Web App** menggunakan:

- Two-Tier Architecture
- Docker Containerization
- GitHub Actions CI/CD

---

## 🧩 Studi Kasus

Sebuah startup sedang mengembangkan aplikasi **Todo List** untuk membantu user mengatur aktivitas harian mereka.

Tim developer sudah membuat backend aplikasi, tetapi mereka membutuhkan sistem yang dapat:

✅ Build aplikasi secara otomatis  
✅ Membuat Docker image secara otomatis  
✅ Deploy aplikasi ke VPS tanpa manual process  
✅ Menjamin deployment konsisten setiap update code  

Sebagai DevOps Engineer, kamu diminta untuk menyiapkan pipeline tersebut menggunakan GitHub Actions.

---

## 🏗️ System Architecture

Project harus menggunakan **Two-Tier Architecture**:

### Tier 1 — Web Application
- Backend Todo List API
- Endpoint CRUD Todo

### Tier 2 — Database
- Database penyimpanan Todo

---

## 🎯 Objectives

Setelah menyelesaikan project ini, kamu harus mampu:

- Menggunakan Docker untuk containerization
- Membuat workflow CI/CD menggunakan GitHub Actions
- Mengotomatisasi deployment ke VPS
- Mengelola environment variables
- Menghubungkan multi container service

---

## 📝 Functional Requirements

Aplikasi Todo harus memiliki fitur:

- Create Todo
- Get Todo List
- Update Todo
- Delete Todo

---

## 🐳 DevOps Requirements

### 1. Containerization

Peserta harus:

- Membuat Dockerfile untuk Web Application
- Menggunakan official database image
- Menjalankan aplikasi menggunakan docker-compose
- Memastikan service saling terhubung

---

### 2. Environment Configuration

Gunakan environment variables untuk:

- Database Host
- Database User
- Database Password
- Database Name

---

### 3. CI/CD Using GitHub Actions

Peserta harus membuat workflow GitHub Actions yang melakukan:

#### Continuous Integration
- Trigger saat push ke branch main
- Install dependency aplikasi
- Build aplikasi
- Build Docker image

#### Continuous Deployment
- Push Docker image ke Docker Registry (Docker Hub / GHCR)
- Connect ke VPS menggunakan SSH
- Pull Docker image terbaru
- Restart container aplikasi

---

### 4. Secret Management

Gunakan GitHub Secrets untuk menyimpan:

- VPS Host
- VPS Username
- SSH Private Key
- Docker Registry Credential

---

## 📦 Deliverables

Peserta harus mengumpulkan:

- Source Code Repository GitHub
- Dockerfile
- docker-compose.yml
- GitHub Actions Workflow (.github/workflows/deploy.yml)
- Dokumentasi deployment
- Diagram arsitektur sistem

---

## 🔄 Expected Workflow Pipeline

Developer Push Code
↓
GitHub Actions Trigger
↓
Build Application
↓
Build Docker Image
↓
Push Image to Registry
↓
SSH to VPS
↓
Pull Image & Deploy Container


---

## 🧪 Testing Scenario

Pastikan:

- Aplikasi bisa diakses dari browser / API client
- Data Todo tersimpan di database
- Workflow GitHub Actions berjalan otomatis
- Deployment berjalan tanpa manual intervention

---

## ⭐ Bonus Challenge

Peserta dapat menambahkan:

- Reverse Proxy menggunakan Nginx
- Docker Volume untuk persist data
- Health Check container
- Auto rollback jika deployment gagal
- Multi environment deployment (staging & production)

---

## 📊 Evaluation Criteria

| Criteria | Description |
|----------|-------------|
| Docker Implementation | Struktur container & best practice |
| GitHub Actions Pipeline | Automation & reliability |
| Architecture Design | Scalability & clarity |
| Security | Secret & credential management |
| Documentation | Kemudahan reproduksi project |

---

## 💡 Learning Outcome

Setelah project selesai, peserta akan memahami:

- Modern CI/CD menggunakan GitHub Actions
- Container-based deployment workflow
- Real-world DevOps pipeline
- Deployment automation ke VPS

---

## 🚀 Rules

- Deployment harus fully automated
- Tidak boleh manual deploy setelah push code
- Harus menggunakan GitHub Actions sebagai CI/CD tool

---

## 🔥 Good Luck DevOps Engineer!
Automate everything. Ship faster. Deploy safer.