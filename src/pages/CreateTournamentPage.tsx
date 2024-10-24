import Navbar from '../components/Navbar';
import CreateTournamentForm from '../components/CreateTournamentForm';

const CreateTournamentPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <Navbar />
      <div>
        <CreateTournamentForm />
      </div>
    </div>
  );
};

export default CreateTournamentPage;