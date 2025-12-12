import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomsPage from './pages/RoomsPage';
import BookingsDashboard from './pages/BookingsDashboard';
import Header from './Components/common/Header';
import Footer from './Components/common/Footer';

function App() {
  return (
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<RoomsPage />} />
              <Route path="/bookings" element={<BookingsDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
