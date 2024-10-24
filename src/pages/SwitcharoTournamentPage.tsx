import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import visibleStream from '../assets/voir-stream.png';
import TwitchStream from '../components/TwitchStream';
import customStyles from '../styles/customStyles';
import StatsForm from '../components/StatsForm';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SwitcharoTournamentPage: React.FC = () => {
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const [kills, setKills] = useState<number | null>(null);
  const [placement, setPlacement] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/tournament/${id}`);
        const data = await response.json();
        setTournament(data);

        if (data.players && data.players.length > 0) {
          setSelectedPlayer(data.players[0]?.player?.twitchUsername);
        }

        if (data.teams && data.teams.length > 0) {
          setSelectedTeam(data.teams[0]);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des détails du tournoi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  const handleStatsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('kills', kills?.toString() || '');
      formData.append('placement', placement?.toString() || '');
      formData.append('ratio', ratio?.toString() || '');

      const response = await fetch(`${backendUrl}/api/tournament/update-stats`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des statistiques.');
      }

      alert('Statistiques mises à jour avec succès.');
    } catch (error) {
      alert('Erreur lors de la mise à jour des statistiques.');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const teamOptions = tournament?.teams?.map((team: any) => ({
    value: team,
    label: `${team.player1.username} - ${team.player2.username}`,
  })) || [];

  const handleTeamChange = (selectedOption: any) => {
    setSelectedTeam(selectedOption?.value || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <div className="container mx-auto mt-7">
        <h1 className="text-5xl font-bold mb-14 mt-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
          {tournament?.name || 'Tournoi Switcharo'}
        </h1>
        <div className="flex flex-col md:flex-row justify-between">
          {/* Twitch Stream Section */}
          <div className="w-full rounded-3xl md:w-3/4 mb-8 md:mb-0">
            <TwitchStream username={selectedPlayer || 'N/A'} />
          </div>

          {/* Tournament Details Section */}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="border border-gray-700 w-full ml-44 mb-5 p-5 rounded-3xl flex items-center">
              <p className="text-xl text-lime-400">
                <strong className="text-white">Cash Prize :</strong> {tournament?.prizePool || 'N/A'}€
              </p>
            </div>

            <div className="w-full bg-gray-800 p-6 rounded-3xl shadow-lg ml-44">
              <p className="text-2xl font-semibold mb-4">Participants</p>
              <ul className="space-y-4">
                {tournament?.players?.map(({ player }: any) => (
                  <li key={player.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">{player.username}</span>
                      <p className="text-sm text-gray-400 mt-1">
                        <strong>K/D Ratio :</strong> {player.kdRatio || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        <strong>Statut :</strong> {player.status || 'Hors ligne'}
                      </p>
                    </div>
                    {player.twitchUsername && (
                      <button
                        className="text-purple-500"
                        onClick={() => setSelectedPlayer(player.twitchUsername)}
                      >
                        <img className="w-5 h-5" src={visibleStream} alt="Voir le stream" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {/* Formulaire pour mettre à jour les statistiques */}
              <StatsForm
                ratio={ratio}
                kills={kills}
                placement={placement}
                setRatio={setRatio}
                setKills={setKills}
                setPlacement={setPlacement}
                handleSubmit={handleStatsUpdate}
              />

              {teamOptions.length > 0 && (
                <div className="mt-6">
                  <label htmlFor="team-select" className="text-lg font-medium block mb-2">
                    Sélectionner une équipe
                  </label>
                  <Select
                    id="team-select"
                    options={teamOptions}
                    onChange={handleTeamChange}
                    value={teamOptions.find((option: { value: any; }) => option.value === selectedTeam)}
                    styles={customStyles}
                    className="w-full focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitcharoTournamentPage;
