import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Funds = lazy(() => import('./pages/Funds'));
const Portfolio = lazy(() => import('./pages/Portfolio'));

// Loading component
const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/funds" element={<Funds />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Suspense>
  );
}