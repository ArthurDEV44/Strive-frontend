import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Bracket, IRoundProps } from 'react-brackets';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import TwitchStream from '../components/TwitchStream';
import customStyles from '../styles/customStyles';
import { generateEmptyRounds } from '../utils/bracketUtils';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Fonction pour ajouter une équipe au bracket
const addTeamToBracket = (rounds: IRoundProps[], teamName: string): IRoundProps[] | string => {
  const updatedRounds = [...rounds];

  // Chercher dans les seeds du premier round
  for (let seed of updatedRounds[0].seeds) {
    if (!seed.teams[0].name) {
      // Ajout de l'équipe dans la première place libre (emplacement 0)
      seed.teams[0] = { name: teamName };
      return updatedRounds;  // Retour immédiat car l'équipe a été ajoutée
    }
  }

  // Si l'équipe est déjà placée, on cherche une place pour l'adversaire
  for (let seed of updatedRounds[0].seeds) {
    if (!seed.teams[1].name) {
      // Ajout de l'équipe dans la deuxième place libre (emplacement 1)
      seed.teams[1] = { name: teamName };
      return updatedRounds;  // Retour immédiat car l'adversaire a été ajouté
    }
  }

  // Si aucune place n'a été trouvée, on retourne un message d'erreur
  return "Aucune place disponible dans le bracket.";
};

interface TeamOption {
  value: any;
  label: string;
}

const KillRaceTournamentPage: React.FC = () => {
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [rounds, setRounds] = useState<IRoundProps[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const [tournamentResponse, teamsResponse] = await Promise.all([
          fetch(`${backendUrl}/api/tournament/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${backendUrl}/api/tournament/${id}/teams`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!tournamentResponse.ok || !teamsResponse.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const tournamentData = await tournamentResponse.json();
        const teamsData = await teamsResponse.json();

        // Calculer le nombre d'équipes
        const teamCount = tournamentData.maxPlayers / tournamentData.teamSize;
        const emptyRounds = generateEmptyRounds(teamCount);

        // Ajouter les équipes inscrites existantes au bracket
        let updatedRounds = emptyRounds;
        teamsData.forEach((team: any) => {
          const result = addTeamToBracket(updatedRounds, `${team.player1.username} - ${team.player2.username}`);
          if (typeof result === 'string') {
            console.error(result); // Message d'erreur
          } else {
            updatedRounds = result;
          }
        });

        setRounds(updatedRounds);
        setTournament(tournamentData);

        const transformedTeams = teamsData.map((team: any) => ({
          value: team,
          label: `${team.player1.username} - ${team.player2.username}`,
        }));
        setTeams(transformedTeams);

      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  const teamOptions: TeamOption[] = useMemo(() => teams, [teams]);

  const handleTeamChange = (selectedOption: any) => {
    setSelectedTeam(selectedOption?.value || null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto mt-7">
        {/* Titre du tournoi */}
        <h1 className="text-5xl font-bold mb-14 mt-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
          {tournament?.name || 'Tournoi Kill Race'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Twitch Stream Section */}
          <div className="col-span-2">
            {selectedTeam && (
              <div className="space-y-8">
                <TwitchStream username={selectedTeam.player1.twitchUsername} />
                <TwitchStream username={selectedTeam.player2.twitchUsername} />
              </div>
            )}
          </div>

          {/* Tournament Details Section */}
          <div className="w-full h-[345px] bg-[#272b31] p-6 rounded-3xl shadow-lg">
            <p className="text-2xl font-semibold mb-4">Détails du Tournoi</p>
            <p className="text-lg mb-2"><strong>Taille des équipes :</strong> {tournament?.teamSize || 'N/A'}</p>
            <p className="text-lg mb-2"><strong>Prix de l'inscription :</strong> {tournament?.entryFree || 'N/A'}€</p>
            <p className="text-lg mb-2"><strong>Description :</strong> {tournament?.description || 'Aucune description disponible'}</p>

            {/* Sélecteur d'équipe */}
            {teamOptions.length > 0 && (
              <div className="mt-6">
                <label htmlFor="team-select" className="text-lg font-medium block mb-2">
                  Sélectionner une équipe
                </label>
                <Select
                  id="team-select"
                  options={teamOptions}
                  onChange={handleTeamChange}
                  value={teamOptions.find((option: TeamOption) => option.value === selectedTeam)}
                  styles={customStyles}
                  className="w-full focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bracket section */}
        <div className="mt-20 mb-20 bg-[#272b31] rounded-[40px] p-6">
          <h2 className='text-4xl font-semibold mb-10'>Bracket du tournoi :</h2>
          {rounds.length > 0 ? (
            <Bracket rounds={rounds} />
          ) : (
            <div>Aucun match disponible pour le moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KillRaceTournamentPage;
