import Navbar from '../components/Navbar';
import Card from '../components/Card';
import CreateTournamentButton from '../components/CreateTournamentButton';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
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
  format?: string; // Durée des matchs
  startDateTime: string; // Date et heure de début du tournoi
}

const CreatorPage: React.FC = () => {
  const { getToken } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const token = await getToken({ template: '' });

        if (!token) {
          setErrorMessage('Utilisateur non authentifié. Veuillez vous connecter.');
          return;
        }

        const response = await fetch(`${backendUrl}/api/tournaments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Erreur lors de la récupération des tournois');
        }

        const data = await response.json();
        setTournaments(data);
      } catch (err) {
        const error = err as Error;
        console.error('Erreur:', error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [getToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <div className="text-center my-10 text-4xl font-semibold">Mes Tournois</div>
      <div className="flex flex-wrap justify-center">
        {loading && <p className="text-white">Chargement des tournois...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {tournaments.length > 0 && tournaments.map((tournament) => (
          <Card
            key={tournament.id}  // Assurez-vous que 'id' est unique pour chaque tournoi
            id={tournament.id}
            title={tournament.name}
            subhead={tournament.type}
            prizePool={tournament.prizePool}
            slots={tournament.maxPlayers.toString()}  // Convertir en chaîne
            description={tournament.description}
            entryFree={tournament.entryFree}  // Utiliser la bonne propriété
            profileImageUrl={tournament.profileImageUrl}
            teamSize={tournament.teamSize}
            format={tournament.format}
            startDateTime={tournament.startDateTime} // Passer la date et l'heure de début
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <button className="text-white hover:text-purple-500">Voir plus ↓</button>
      </div>
      <CreateTournamentButton />
    </div>
  );
};

export default CreatorPage;
