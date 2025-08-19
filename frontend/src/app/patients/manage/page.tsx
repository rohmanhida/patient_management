'use client';

import * as React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getData, postData, updateData, deleteData } from '@/lib/api';
import { Patient } from '@/app/patients/types';
import dayjs from 'dayjs';
import AuthGuard from '@/lib/components/AuthGuard';

export default function ManagePatientsPage() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [form, setForm] = React.useState<Partial<Patient>>({});
  const [editingId, setEditingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    (async () => {
      const data = await getData('/patient');
      setPatients(data);
    })();
  }, []);

  const handleChange = (field: keyof Patient, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingId) {
      const updated = await updateData('/patient', editingId, form);
      setPatients((prev) =>
        prev.map((p) => (p.id === editingId ? updated : p)),
      );
      setEditingId(null);
    } else {
      const created = await postData('/patient', form);
      setPatients((prev) => [...prev, created]);
    }
    setForm({});
  };

  const handleEdit = (patient: Patient) => {
    setForm(patient);
    setEditingId(patient.id);
  };

  const handleDelete = async (id: number) => {
    await deleteData('/patient', id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AuthGuard>
      <Box p={2}>
        <Typography variant="h4" mb={2}>
          Kelola Pasien
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nama"
              value={form.nama || ''}
              onChange={(e) => handleChange('nama', e.target.value)}
            />
            <TextField
              label="Tanggal Lahir (YYYY-MM-DD)"
              value={form.tanggal_lahir || ''}
              onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
            />
            <TextField
              label="Tanggal Kunjungan (YYYY-MM-DD)"
              value={form.tanggal_kunjungan || ''}
              onChange={(e) =>
                handleChange('tanggal_kunjungan', e.target.value)
              }
            />
            <TextField
              label="Diagnosis"
              value={form.diagnosis || ''}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
            />
            <TextField
              label="Tindakan"
              value={form.tindakan || ''}
              onChange={(e) => handleChange('tindakan', e.target.value)}
            />
            <TextField
              label="Dokter"
              value={form.dokter || ''}
              onChange={(e) => handleChange('dokter', e.target.value)}
            />

            <Button variant="contained" onClick={handleSubmit}>
              {editingId ? 'Ubah' : 'Tambahkan'} Pasien
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" mb={1}>
          Daftar Pasien
        </Typography>
        {patients.map((p) => (
          <Paper
            key={p.id}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle1">{p.nama}</Typography>
              <Typography variant="body2">
                TTL: {dayjs(p.tanggal_lahir).format('YYYY-MM-DD')} | Kunjungan:{' '}
                {dayjs(p.tanggal_kunjungan).format('YYYY-MM-DD')}
              </Typography>
              <Typography variant="body2">Diagnosis: {p.diagnosis}</Typography>
              <Typography variant="body2">Tindakan: {p.tindakan}</Typography>
              <Typography variant="body2">Dokter: {p.dokter}</Typography>
            </Box>
            <Box>
              <Button onClick={() => handleEdit(p)}>Edit</Button>
              <IconButton onClick={() => handleDelete(p.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
    </AuthGuard>
  );
}
