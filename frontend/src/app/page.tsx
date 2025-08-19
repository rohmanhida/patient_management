'use client';

import * as React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getData } from '@/lib/api';
import AuthGuard from '@/lib/components/AuthGuard';
import { Patient } from '@/app/patients/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9932CC'];

function DashboardContent() {
  const [patients, setPatients] = React.useState<Patient[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getData('/patient');
        setPatients(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Pie chart data: diagnostics distribution
  const diagnosticsCount = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.diagnosis] = (acc[p.diagnosis] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(diagnosticsCount).map(
    ([penyakit, jumlah]) => ({
      penyakit,
      jumlah,
    }),
  );

  // Bar chart data: jumlah pasien setiap harinya
  const patientCount = patients.reduce<Record<string, number>>((acc, p) => {
    acc[p.tanggal_kunjungan] = (acc[p.tanggal_kunjungan] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(patientCount).map(([tanggal, count]) => ({
    tanggal,
    visits: count,
  }));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Diagnostics Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="jumlah"
                nameKey="penyakit"
                outerRadius={120}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Bar Chart */}
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Visits per Doctor
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
