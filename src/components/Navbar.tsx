import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import striveLogo from "../assets/Logo-Strive-V1.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateTournament = () => {
    navigate('/creator');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleForum = () => {
    navigate('/forum');
  };

  const handleSubscriptions = () => {
    navigate('/subscriptions');
  };

  const handleTournaments = () => {
    navigate('/tournaments');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg relative z-50">
      <img src={striveLogo} onClick={handleHome} alt="Strive Logo" className="w-24 h-auto cursor-pointer hover:opacity-80 transition-opacity duration-300" />
      <div className="flex space-x-6">
        <a onClick={handleTournaments} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Tournois</a>
        <a onClick={handleSubscriptions} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Abonnements</a>
        <a onClick={handleForum} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Forum</a>
        <a onClick={handleCreateTournament} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Créer un Tournoi</a>
        <a onClick={handleDashboard} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Tableau de bord</a>
        <a onClick={handleProfile} className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">Profile</a>
      </div>
      <div className="flex items-center space-x-4">
        <input type="text" placeholder="Rechercher..." className="bg-gray-800 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#1f2937] border border-[#1f2937] transition duration-300" />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
