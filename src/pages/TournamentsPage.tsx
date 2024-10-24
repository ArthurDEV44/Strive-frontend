import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../WebSocketContext';  // Importer le WebSocketContext
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Tournament {
  id: string;
  name: string;
  type: string;
  prizePool: number;
  maxPlayers: number;
  entryFree: number;
  description: string;
  status: string;
  createdBy: string;
  profileImageUrl: string;
  teamSize: number;
  format?: string;
  startDateTime: string;
}

const TournamentsPage: React.FC = () => {
  const { tournaments: wsTournaments } = useWebSocket(); // Tournois provenant du WebSocket
  const [apiTournaments, setApiTournaments] = useState<Tournament[]>([]); // Tournois provenant de l'API
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour récupérer la liste initiale des tournois via API
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/all-tournaments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Erreur lors de la récupération des tournois');
        }
    
        const data = await response.json();
        setApiTournaments(data); // Mise à jour des tournois reçus via l'API
      } catch (err) {
        const error = err as Error;
        console.error('Erreur:', error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTournaments();
  }, []);

  // Aucun besoin de fusionner les deux sources ici.
  const combinedTournaments = [...apiTournaments, ...wsTournaments]; // Ajoutez simplement les tournois WebSocket à ceux existants.

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <div className="text-center my-10 text-3xl font-semibold">Actualités</div>
      <div className="flex flex-wrap justify-center">
        {loading && <p className="text-white">Chargement des tournois...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {combinedTournaments.length > 0 && combinedTournaments.map((tournament) => (
          <Card
            key={tournament.id}
            id={tournament.id}
            title={tournament.name}
            subhead={tournament.type}
            prizePool={tournament.prizePool}
            slots={`0/${tournament.maxPlayers}`}
            description={tournament.description}
            entryFree={tournament.entryFree}
            profileImageUrl={tournament.profileImageUrl}
            teamSize={tournament.teamSize}
            format={tournament.format}
            startDateTime={tournament.startDateTime}
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <button className="text-white hover:text-purple-500">Voir plus ↓</button>
      </div>
    </div>
  );  
};

export default TournamentsPage;
