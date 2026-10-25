const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mock Database (Data Sementara)
let doctors = [
    { id: 1, name: 'Dr. Andi, Sp.A', specialty: 'Anak', status: 'Ready' },
    { id: 2, name: 'Dr. Siti, Sp.PD', specialty: 'Penyakit Dalam', status: 'Operasi' },
    { id: 3, name: 'Dr. Budi, Sp.B', specialty: 'Bedah', status: 'Ready' }
];

let rooms = [
    { id: 1, roomNumber: 'Mawar 101', type: 'VIP', status: 'Ready' },
    { id: 2, roomNumber: 'Melati 102', type: 'Kelas 1', status: 'Terisi' },
    { id: 3, roomNumber: 'Anggrek 103', type: 'Kelas 2', status: 'Ready' }
];

let patients = [
    { id: 1, name: 'Ahmad Faisal', disease: 'Demam Berdarah', room: 'Melati 102', progress: 45 },
    { id: 2, name: 'Dewi Lestari', disease: 'Tipes', room: 'Mawar 101', progress: 100 }
];

// API: Ambil semua data rumah sakit & Evaluasi Aturan Pulang (100% = Sembuh)
app.get('/api/hospital', (req, res) => {
    const evaluatedPatients = patients.map(p => ({
        ...p,
        dischargeStatus: p.progress >= 100 ? '🟢 Siap Pulang (Sembuh)' : '🟡 Masih Dirawat'
    }));

    res.json({
        doctors,
        rooms,
        patients: evaluatedPatients
    });
});

// API: Tambah Pasien (CREATE)
app.post('/api/patients', (req, res) => {
    const { name, disease, room, progress } = req.body;
    const newPatient = {
        id: Date.now(),
        name,
        disease,
        room,
        progress: Number(progress) || 0
    };
    patients.push(newPatient);
    res.json({ success: true, message: 'Pasien berhasil ditambahkan!' });
});

// API: Update Progress Pasien (UPDATE)
app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const { progress } = req.body;
    
    const patient = patients.find(p => p.id == id);
    if (patient) {
        patient.progress = Number(progress);
        res.json({ success: true, message: 'Progress pasien diperbarui!' });
    } else {
        res.status(404).json({ success: false, message: 'Pasien tidak ditemukan' });
    }
});

// API: Hapus Pasien / Pulangkan (DELETE)
app.delete('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    patients = patients.filter(p => p.id != id);
    res.json({ success: true, message: 'Pasien telah dipulangkan!' });
});

// Jalankan server secara lokal (Hanya berjalan jika tidak di Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server Rumah Sakit berjalan di http://localhost:${PORT}`);
    });
}

// Wajib untuk Vercel Serverless
module.exports = app;