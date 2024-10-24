import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import TournamentsPage from './pages/TournamentsPage';
import CreatorPage from './pages/CreatorPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentCustomDetailsPage from './pages/TournamentCustomDetailsPage';
import SwitcharoTournamentPage from './pages/SwitcharoTournamentPage';
import KillRaceTournamentPage from './pages/KillRaceTournamentPage';
import ProfilePage from './pages/ProfilePage';
import { WebSocketProvider } from './WebSocketContext';

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournament/:id" element={<TournamentCustomDetailsPage />} />
          <Route path="/switcharo/:id" element={<SwitcharoTournamentPage />} />
          <Route path="/killrace/:id" element={<KillRaceTournamentPage />} />
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/create-tournament" element={<CreateTournamentPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
