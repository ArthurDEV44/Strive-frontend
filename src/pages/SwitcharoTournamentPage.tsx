import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import visibleStream from '../assets/voir-stream.png';
import { useAuth } from '@clerk/clerk-react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TwitchStream = ({ username }: { username: string }) => (
  <div className="twitch-stream bg-gradient-to-r from-violet-500/80 to-indigo-500/70 shadow-[0_0_50px_10px_rgba(139,92,246,0.7)] rounded-3xl overflow-hidden w-full h-[500px] p-1">
    <iframe
      src={`https://player.twitch.tv/?channel=${username}&parent=localhost`}
      height="100%"
      width="100%"
      allowFullScreen
      frameBorder="0"
      scrolling="no"
      allow="autoplay; fullscreen"
      className="rounded-lg"
      title={`Twitch stream de ${username}`}  // Ajout du titre unique
    ></iframe>
  </div>
);

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
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

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
      formData.append('proofImage', proofImage || '');
      formData.append('ratio', ratio?.toString() || '');

      setUploading(true);

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
    } finally {
      setUploading(false);
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

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#1F2937',
      borderColor: state.isFocused ? '#8B5CF6' : '#374151',
      color: 'white',
      padding: '8px',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 1px #8B5CF6' : 'none',
      '&:hover': { borderColor: '#8B5CF6' },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#4C1D95' : '#374151',
      color: 'white', // Il n'est pas nécessaire d'avoir une condition sur "state.isFocused"
      padding: 10,
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1F2937',
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
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
              <form onSubmit={handleStatsUpdate} className="mt-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-white">Ratio (K/D)</label>
                    <input
                      type="number"
                      value={ratio || ''}
                      onChange={(e) => setRatio(Number(e.target.value))}
                      className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-white">Kills</label>
                    <input
                      type="number"
                      value={kills || ''}
                      onChange={(e) => setKills(Number(e.target.value))}
                      className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-white">Placement</label>
                    <input
                      type="number"
                      value={placement || ''}
                      onChange={(e) => setPlacement(Number(e.target.value))}
                      className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-white">Capture d'écran de la preuve</label>
                    <input
                      type="file"
                      onChange={(e) => setProofImage(e.target.files ? e.target.files[0] : null)}
                      className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    disabled={uploading}
                  >
                    {uploading ? 'En cours...' : 'Mettre à jour les stats'}
                  </button>
                </div>
              </form>

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
