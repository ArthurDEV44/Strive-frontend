import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import { Bracket, IRoundProps } from 'react-brackets';

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

// Interface pour définir la structure d'un seed (match)
interface ISeed {
  id: number;
  teams: Array<{ name: string }>;
}

// Fonction pour générer les rounds vides avec des seeds par défaut
const generateEmptyRounds = (teamCount: number): IRoundProps[] => {
  const rounds: IRoundProps[] = [];
  const roundCount = Math.log2(teamCount); // nombre de rounds basé sur le nombre d'équipes

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
    const seeds: ISeed[] = []; // Utilisation de ISeed au lieu de Seed
    const matchCount = teamCount / Math.pow(2, roundIndex + 1); // nombre de matchs dans chaque round

    for (let i = 0; i < matchCount; i++) {
      seeds.push({
        id: i + 1,
        teams: [{ name: '' }, { name: '' }], // Teams vides initialement
      });
    }

    // Définir le titre du round
    let roundTitle;
    if (roundIndex === roundCount - 2) {
      roundTitle = 'Demi-final';
    } else if (roundIndex === roundCount - 1) {
      roundTitle = 'Final';
    } else {
      roundTitle = `Round ${roundIndex + 1}`;
    }

    rounds.push({
      title: roundTitle,
      seeds: seeds,
    });
  }

  return rounds;
};

// Fonction pour ajouter une équipe au bracket
const addTeamToBracket = (rounds: IRoundProps[], teamName: string): IRoundProps[] => {
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

  // Si aucune place n'a été trouvée, on retourne un message d'erreur ou une gestion de l'erreur
  // Ici on peut ajouter une gestion spécifique en fonction du contexte
  console.error("Impossible d'ajouter l'équipe au bracket : pas de place libre.");
  return updatedRounds; // On retourne tout de même le tableau mis à jour même si aucune place n'a été trouvée.
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
          updatedRounds = addTeamToBracket(updatedRounds, `${team.player1.username} - ${team.player2.username}`);
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

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#272b31',
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
      color: 'white',
      padding: 10,
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({ ...provided, color: 'white' }),
    menu: (provided: any) => ({ ...provided, backgroundColor: '#272b31' }),
    input: (provided: any) => ({ ...provided, color: 'white' }),
    placeholder: (provided: any) => ({ ...provided, color: 'white' }),
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
