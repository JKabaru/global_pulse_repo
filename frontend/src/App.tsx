import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Countries from './pages/Countries';
import Indicators from './pages/Indicators';
import Forecasts from './pages/Forecasts';
import Taxonomy from './pages/Taxonomy';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/indicators" element={<Indicators />} />
              <Route path="/forecasts" element={<Forecasts />} />
              <Route path="/taxonomy" element={<Taxonomy />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;