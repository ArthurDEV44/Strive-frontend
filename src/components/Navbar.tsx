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
      <img
        src={striveLogo}
        alt="Strive Logo"
        role="button"
        tabIndex={0}
        onClick={handleHome}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleHome();
          }
        }}
        className="w-24 h-auto cursor-pointer hover:opacity-80 transition-opacity duration-300"
      />
      <div className="flex space-x-6">
        <a
          role="button"
          tabIndex={0}
          onClick={handleTournaments}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTournaments();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Tournois
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={handleSubscriptions}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSubscriptions();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Abonnements
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={handleForum}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleForum();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Forum
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={handleCreateTournament}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCreateTournament();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Créer un Tournoi
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={handleDashboard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDashboard();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Tableau de bord
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={handleProfile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleProfile();
            }
          }}
          className="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300"
        >
          Profil
        </a>
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
