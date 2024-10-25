import { IRoundProps } from 'react-brackets';

// Interface pour définir la structure d'un seed (match)
interface ISeed {
  id: number;
  teams: Array<{ name: string }>;
}

// Fonction pour générer les rounds vides avec des seeds par défaut
export const generateEmptyRounds = (teamCount: number): IRoundProps[] => {
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
