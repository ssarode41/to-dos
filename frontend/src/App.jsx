import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
