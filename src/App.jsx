import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { FocusSession } from './pages/FocusSession';
import { Success } from './pages/Success';
import { Forfeit } from './pages/Forfeit';

function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/focus" element={<FocusSession />} />
          <Route path="/success" element={<Success />} />
          <Route path="/forfeit" element={<Forfeit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
