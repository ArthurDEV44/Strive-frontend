import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal'; // Import du composant Modal
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

const TournamentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('iheedz');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tournament/${id}`);
        const data = await response.json();
        setTournament(data);

        if (data.players && data.players.length > 0) {
          setSelectedPlayer(data.players[0]?.twitchUsername);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des détails du tournoi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetails();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const options = [
    { value: 'iheedz', label: 'iheedz' },
    { value: 'Proze', label: 'Proze' },
    { value: 'AyzenLr', label: 'AyzenLr' },
    ...(tournament?.players?.map((player: any) => ({
      value: player.twitchUsername,
      label: player.twitchUsername
    })) || []),
  ];

  const handlePlayerChange = (selectedOption: any) => {
    setSelectedPlayer(selectedOption?.value || '');
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
      '&:hover': {
        borderColor: '#8B5CF6',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#4C1D95' : '#374151',
      color: 'white',
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
        <h1 className="text-5xl font-bold mb-14 mt-12 text-center bg-white bg-clip-text text-transparent">
          {tournament?.name || 'Tournoi Test'}
        </h1>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full rounded-3xl md:w-3/4 mb-8 md:mb-0">
            <TwitchStream username={selectedPlayer} />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="border border-gray-700 w-full ml-44 mb-5 p-5 rounded-3xl flex items-center">
              <p className="text-xl text-lime-400">
                <strong className="text-white">Cash Prize :</strong> {tournament?.prizePool || 'N/A'}€
              </p>
            </div>
            <div className="w-full bg-gray-800 p-6 rounded-3xl shadow-lg ml-44">
              <p className="text-2xl font-semibold mb-4">Détails du Tournoi</p>
              <p className="text-lg mb-2"><strong>Taille des équipes :</strong> {tournament?.teamSize || 'N/A'}</p>
              <p className="text-lg mb-2"><strong>Prix de l'inscription :</strong> {tournament?.entryFree || 'N/A'}€</p>
              <p className="text-lg mb-2"><strong>Description :</strong> {tournament?.description || 'Aucune description disponible'}</p>

              <div className="mt-6">
                <label htmlFor="player-select" className="text-lg font-medium block mb-2">Sélectionner un streameur</label>
                <Select
                  id="player-select"
                  options={options}
                  onChange={handlePlayerChange}
                  value={options.find(option => option.value === selectedPlayer)}
                  styles={customStyles}
                  className="w-full focus:outline-none"
                />
              </div>

              <div className="mt-10">
                <button className="w-full text-white bg-gradient-to-r from-[#4C1D95] to-[#005f75] px-4 py-2 rounded-full hover:bg-gradient-to-r from-[#005f75] to-[#4C1D95] transition duration-300 ease-in-out">
                  Voir le Bracket
                </button>
              </div>
              <div className="mt-5">
                <button
                  onClick={openModal}
                  className="w-full text-white bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out"
                >
                  Réglement des Customs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} /> {/* Utilisation de la modal */}
    </div>
  );
};

export default TournamentDetailsPage;
