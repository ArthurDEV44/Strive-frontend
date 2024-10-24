import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importer le style de react-datepicker
import { useAuth, useUser } from '@clerk/clerk-react';
import '../styles/CreateTournamentForm.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CreateTournamentForm: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [formValues, setFormValues] = useState({
    tournamentName: '',
    type: 'Switchaaro',
    numberOfPlayers: '24',
    entryFee: '10 €',
    description: '',
    teamSize: '2',
    matchDuration: 'BO1', // Ajout du champ de durée des matchs (par défaut BO1)
    termsAccepted: false,
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [playerOptions, setPlayerOptions] = useState<string[]>(['24', '32']);
  const [teamSizeOptions, setTeamSizeOptions] = useState<string[]>(['2']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mettre à jour les options de nombre de joueurs, taille d'équipe et durée des matchs en fonction du type de tournoi
  useEffect(() => {
    if (formValues.type === 'Switchaaro') {
      setPlayerOptions(['24', '32']);
      setFormValues((prev) => ({ ...prev, numberOfPlayers: '24', teamSize: '2', matchDuration: 'BO1' }));
      setTeamSizeOptions(['2']);
    } else if (formValues.type === 'Custom') {
      setPlayerOptions(['120']);
      setFormValues((prev) => ({ ...prev, numberOfPlayers: '120', teamSize: '1', matchDuration: '' }));
      setTeamSizeOptions(['1', '2', '3']);
    } else if (formValues.type === 'Kill Race') {
      // Mise à jour spécifique pour Kill Race
      setPlayerOptions(['32', '64']); // Les options pour le nombre de joueurs
      setFormValues((prev) => ({ ...prev, numberOfPlayers: '32', teamSize: '1', matchDuration: '' })); // Valeurs par défaut
      setTeamSizeOptions(['1', '2']); // Options de taille d'équipe
    }
  }, [formValues.type]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormValues({
        ...formValues,
        [name]: e.target.checked,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        setErrorMessage('Utilisateur non authentifié. Veuillez vous connecter.');
        return;
      }

      const token = await getToken({ template: '' });
      if (!token) {
        setErrorMessage('Utilisateur non authentifié. Veuillez vous connecter.');
        return;
      }

      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const entryFee = parseFloat(formValues.entryFee.replace(' €', ''));
      const numberOfPlayers = parseInt(formValues.numberOfPlayers);
      const teamSize = parseInt(formValues.teamSize);

      // Requête POST vers l'API backend pour créer un tournoi
      const response = await fetch(`${backendUrl}/api/tournament`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          name: formValues.tournamentName,
          type: formValues.type,
          numberOfPlayers: numberOfPlayers,
          entryFee: entryFee,
          description: formValues.description,
          teamSize: teamSize,
          matchDuration: formValues.matchDuration,
          startDateTime: startDate, // Ajouter la date et l'heure de début
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la création du tournoi');
      }

      setSuccessMessage('Tournoi créé avec succès!');
    } catch (err) {
      const error = err as Error;
      console.error('Erreur:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[92vh] bg-gradient-to-br from-gray-900 to-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 mt-10 mb-10 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-gradient">Remplissez les informations du tournoi</h2>
        <p className="text-sm text-gray-400 mb-6">Tous les champs sont obligatoires</p>

        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">{successMessage}</div>
        )}
        {loading && <div className="text-purple-500 mb-4">Création du tournoi en cours...</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Champ pour le nom du tournoi */}
          <div className="mb-4">
            <label htmlFor="tournamentName" className="block text-gray-300 font-medium mb-2">Nom du tournoi</label>
            <input
              type="text"
              id="tournamentName"
              name="tournamentName"
              value={formValues.tournamentName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Champ pour le type de tournoi */}
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-300 font-medium mb-2">Type de tournoi</label>
            <select
              id="type"
              name="type"
              value={formValues.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Switchaaro">Switchaaro</option>
              <option value="Custom">Custom</option>
              <option value="Kill Race">Kill Race</option> {/* Ajout de la nouvelle option */}
            </select>
          </div>

          {/* Champ pour le nombre de joueurs */}
          <div className="mb-4">
            <label htmlFor="numberOfPlayers" className="block text-gray-300 font-medium mb-2">Nombre de joueur (Max)</label>
            <select
              id="numberOfPlayers"
              name="numberOfPlayers"
              value={formValues.numberOfPlayers}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {playerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Champ pour la taille des équipes */}
          <div className="mb-4">
            <label htmlFor="teamSize" className="block text-gray-300 font-medium mb-2">Taille des équipes</label>
            <select
              id="teamSize"
              name="teamSize"
              value={formValues.teamSize}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {teamSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Champ pour la durée des matchs */}
          {formValues.type === 'Switchaaro' && (
            <div className="mb-4">
              <label htmlFor="matchDuration" className="block text-gray-300 font-medium mb-2">Durée des matchs</label>
              <select
                id="matchDuration"
                name="matchDuration"
                value={formValues.matchDuration}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="BO1">Best of 1 (BO1)</option>
                <option value="BO3">Best of 3 (BO3)</option>
              </select>
            </div>
          )}

          {/* Champ pour le prix d'inscription */}
          <div className="mb-4">
            <label htmlFor="entryFee" className="block text-gray-300 font-medium mb-2">Prix de l'inscription</label>
            <select
              id="entryFee"
              name="entryFee"
              value={formValues.entryFee}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="5 €">5 €</option>
              <option value="10 €">10 €</option>
              <option value="15 €">15 €</option>
            </select>
          </div>

          {/* Sélecteur de date et d'heure pour le début du tournoi */}
          <div className="mb-4">
            <label htmlFor="startDateTime" className="block text-gray-300 font-medium mb-2">Date et Heure du début du tournoi</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setStartDate(date);
                }
              }}
              showTimeSelect
              dateFormat="Pp"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Champ pour la description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 font-medium mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        {/* Conditions d'utilisation */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formValues.termsAccepted}
            onChange={handleChange}
            className="mr-2 focus:ring-purple-500"
          />
          <label htmlFor="termsAccepted" className="text-gray-300">
            J'accepte les conditions d'utilisation
          </label>
        </div>
        <div className="mb-4">
          <a href="#" className="text-purple-400 underline text-sm hover:text-purple-500 transition-colors duration-300">Read our T&Cs</a>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="button-gradient text-white px-6 py-3 rounded-md w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
          disabled={!formValues.termsAccepted || loading}
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default CreateTournamentForm;