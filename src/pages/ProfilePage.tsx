import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ProfilePage: React.FC = () => {
  const { getToken } = useAuth();
  const [twitchUsername, setTwitchUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [activisionUsername, setActivisionUsername] = useState('');
  const [firstPartRatio, setFirstPartRatio] = useState('0'); // Partie avant le point
  const [secondPartRatio, setSecondPartRatio] = useState('00'); // Partie après le point
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction pour récupérer les informations du joueur
  const fetchPlayerProfile = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${backendUrl}/api/player-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la récupération du profil.');
      }

      const data = await response.json();
      setTwitchUsername(data.twitchUsername || '');
      setDiscordUsername(data.discordUsername || '');
      setActivisionUsername(data.activisionUsername || '');

      if (data.ratio) {
        const [firstPart, secondPart] = data.ratio.toFixed(2).split('.');
        setFirstPartRatio(firstPart);
        setSecondPartRatio(secondPart);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la récupération du profil.');
    }
  };

  useEffect(() => {
    fetchPlayerProfile(); // Appeler la fonction lors du chargement de la page
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const ratio = parseFloat(`${firstPartRatio}.${secondPartRatio}`);

      const response = await fetch(`${backendUrl}/api/update-player`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          twitchUsername,
          discordUsername,
          activisionUsername,
          ratio, // Envoyer le ratio complet
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil.');
      }

      setSuccessMessage('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl text-center font-bold mb-6">Mon Profil</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="twitch" className="block text-sm font-medium text-gray-300">Twitch</label>
            <input
              id="twitch"
              type="text"
              value={twitchUsername}
              onChange={(e) => setTwitchUsername(e.target.value)}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="Nom d'utilisateur Twitch"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="discord" className="block text-sm font-medium text-gray-300">Discord</label>
            <input
              id="discord"
              type="text"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="Nom d'utilisateur Discord"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="activision" className="block text-sm font-medium text-gray-300">Activision</label>
            <input
              id="activision"
              type="text"
              value={activisionUsername}
              onChange={(e) => setActivisionUsername(e.target.value)}
              className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              placeholder="Nom d'utilisateur Activision"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ratio" className="block text-sm font-medium text-gray-300">Ratio (K/D)</label>
            <div className="flex items-center space-x-2">
              <input
                id="ratio"
                type="text"
                value={firstPartRatio}
                onChange={(e) => setFirstPartRatio(e.target.value.replace(/\D/g, ''))} // Seuls les chiffres sont autorisés
                maxLength={1}
                className="mt-1 block w-10 p-2 bg-gray-700 border border-gray-600 rounded-md text-center"
              />
              <span className="text-lg text-gray-300">.</span>
              <input
                id="ratio-decimal"
                type="text"
                value={secondPartRatio}
                onChange={(e) => setSecondPartRatio(e.target.value.replace(/\D/g, '').slice(0, 2))} // Limiter à 2 chiffres
                maxLength={2}
                className="mt-1 block w-12 p-2 bg-gray-700 border border-gray-600 rounded-md text-center"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full button-gradient hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
