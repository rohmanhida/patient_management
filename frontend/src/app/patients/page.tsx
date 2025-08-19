'use client';

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TextField, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getData } from '@/lib/api';
import { Patient } from '@/app/patients/types';
import AuthGuard from '@/lib/components/AuthGuard';

function PatientsTable() {
  const [rows, setRows] = React.useState<Patient[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const [visitFilter, setVisitFilter] = React.useState<Dayjs | null>(null);

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.nama.toLowerCase().includes(search.toLowerCase()) ||
      row.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      row.dokter.toLowerCase().includes(search.toLowerCase());

    const matchesVisit =
      !visitFilter || dayjs(row.tanggal_kunjungan).isSame(visitFilter, 'day');

    return matchesSearch && matchesVisit;
  });

  const columns: GridColDef[] = [
    { field: 'nama', headerName: 'Nama', flex: 1 },
    { field: 'tanggal_lahir', headerName: 'Tanggal Lahir', flex: 1 },
    { field: 'tanggal_kunjungan', headerName: 'Tanggal Kunjungan', flex: 1 },
    { field: 'diagnosis', headerName: 'Diagnosis', flex: 1 },
    { field: 'tindakan', headerName: 'Tindakan', flex: 1 },
    { field: 'dokter', headerName: 'Dokter', flex: 1 },
  ];

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    (async () => {
      try {
        const data = await getData('/patient');
        setRows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!mounted) return null;
  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        Daftar Pasien
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Pencarian"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Tanggal Kunjungan"
            value={visitFilter}
            onChange={(newValue) => setVisitFilter(newValue)}
          />
        </LocalizationProvider>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}

export default function PatientsPage() {
  return (
    <AuthGuard>
      <PatientsTable />
    </AuthGuard>
  );
}
