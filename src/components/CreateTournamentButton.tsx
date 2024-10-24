import { useNavigate } from "react-router-dom";

const CreateTournamentButton: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateTournament = () => {
    navigate('/create-tournament');
  };

  return (
    <button onClick={handleCreateTournament} className="fixed top-36 right-5 button-gradient text-white px-6 py-3 rounded-full font-semibold">
      Créer un tournoi +
    </button>
  );
};

export default CreateTournamentButton;