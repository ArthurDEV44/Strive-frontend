import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react'; // Import du hook Clerk
import '../styles/Card.css';
import badge from '../assets/badge-verify.png';
import imgCard from '../assets/bg-card-tournoi.png';
import TeamSetupModal from './TeamSetupModal';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface CardProps {
  id: string;
  title: string;
  subhead: string;
  prizePool: number;
  slots: string;
  entryFree: number;
  profileImageUrl: string;
  teamSize: number;
  format?: string;
  startDateTime?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  subhead,
  prizePool,
  slots,
  entryFree,
  profileImageUrl,
  teamSize,
  format,
  startDateTime,
}) => {
  const { getToken } = useAuth(); // Appel du hook à l'intérieur du composant
  const { user } = useUser();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // État pour suivre l'inscription
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const cardRefButton = useRef<HTMLButtonElement | null>(null);
  const cardRefDiv = useRef<HTMLDivElement | null>(null);  
  const buttonText = entryFree ? 'S’inscrire' : 'Payer';

  const navigate = useNavigate();

  useEffect(() => {
    if (!startDateTime) return;

    const targetDate = new Date(startDateTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeRemaining('Tournoi en cours');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining(`${days}j ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDateTime]);

  const checkRegistration = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/check-registration/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Utilisation du token récupéré
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setIsRegistered(data.isRegistered);
      } else {
        console.error('Erreur lors de la vérification de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'inscription:', error);
    }
  };
  
  // Nouveau Hook ou état pour vérifier si un coéquipier est inscrit
  const checkTeamRegistration = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/check-team-registration/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Ajustez l'état ici pour vérifier si l'équipe entière est inscrite
        setIsRegistered(data.isTeamRegistered);
      } else {
        console.error('Erreur lors de la vérification de l\'inscription de l\'équipe');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'inscription de l\'équipe:', error);
    }
  };
  
  useEffect(() => {
    if (subhead === 'Kill Race' && teamSize === 2) {
      checkTeamRegistration(); // Vérifie l'inscription de l'équipe pour les tournois en équipe
    } else {
      checkRegistration(); // Vérifie l'inscription individuelle
    }
  }, [id]);  

  useEffect(() => {
    checkRegistration(); // Vérifie l'inscription au montage du composant
  }, [id]);

  const handleSubmitTeam = async (teammateUsername: string, teamName: string) => {
    setIsModalOpen(false);
    try {
      const token = await getToken();
  
      if (!token) {
        alert('Vous devez être authentifié pour vous inscrire.');
        return;
      }
  
      const response = await fetch(`${backendUrl}/api/register-team-to-tournament`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tournamentId: id,
          teammate: teammateUsername,
          teamName,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription.');
      }
  
      alert('Inscription d\'équipe réussie !');
      setIsRegistered(true);
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'équipe:', error);
      alert('Erreur lors de l\'inscription de l\'équipe.');
    }
  };  

  const handleRegister = async () => {
    if (isRegistered) return;

    if (subhead === 'Kill Race' && teamSize === 2) {
      setIsModalOpen(true);
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        alert('Vous devez être authentifié pour vous inscrire.');
        return;
      }

      const response = await fetch(`${backendUrl}/api/register-to-tournament`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tournamentId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription.');
      }

      alert('Inscription réussie !');
      setIsRegistered(true);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription.');
    }
  };

  const handleCardClick = () => {
    if (subhead === 'Switchaaro') {
      navigate(`/switcharo/${id}`);
    } else if (subhead === 'Custom') {
      navigate(`/tournament/${id}`);
    } else if (subhead === 'Kill Race') {
      navigate(`/killrace/${id}`);
    } else {
      alert('Type de tournoi non reconnu.');
    }
  };

  return (
    <div
      ref={cardRefDiv}
      className="w-[320px] rounded-2xl overflow-hidden shadow-lg text-white transition-transform duration-300 ease-in-out hover:shadow-2xl m-4 flex flex-col justify-between card-container"
      style={{ background: 'rgba(255, 255, 255, 0.04)' }}
    >
      {/* Contenu de la carte */}
      <button
        ref={cardRefButton}
        className="w-[320px] rounded-2xl overflow-hidden shadow-lg text-white transition-transform duration-300 ease-in-out"
        style={{ background: 'rgba(255, 255, 255, 0.04)' }}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
      >
        <div className="flex items-center p-4">
          <div className="flex-shrink-0">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full border-2 border-orange-500" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white">
                A
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-bold text-lg bg-clip-text text-white">{title}</div>
            <p className="text-sm text-gray-300">{subhead}</p>
          </div>
        </div>
        <div className="bg-gray-800 h-32 flex items-center justify-center mb-4 rounded-md mx-4">
          <img src={imgCard} alt="" className="w-72 h-32 rounded-xl" />
        </div>
        <div className="px-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-semibold bg-clip-text text-transparent bg-green-500">{prizePool} €</p>
            <p className="text-sm text-gray-300">{slots}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300">Équipe: {teamSize} joueurs</p>
            {format && <p className="text-gray-300">Format: {format}</p>}
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300">Début: {timeRemaining}</p>
          </div>
        </div>
        <div className="px-6 pb-4 mt-auto">
          <div className="flex items-center justify-between">
            <button
              className={`text-white px-4 py-2 rounded-full transition-all duration-300 ${
                isRegistered ? 'border border-green-400 text-green-400' : 'bg-gradient-to-r from-purple-900 to-blue-900'
              }`}
              onClick={handleRegister}
              disabled={isRegistered}
            >
              {isRegistered ? (
                <>
                  Inscrit{" "}
                  <img className="rounded-full w-4 h-4 inline-block ml-1" src={badge} alt="Badge" />
                </>
              ) : (
                buttonText // Utilisation de la variable pour le texte du bouton
              )}
            </button>
            <div className="text-pink-500 cursor-pointer hover:scale-110 transition-transform duration-200">❤</div>
          </div>
        </div>
      </button>

      {/* Modal de configuration d'équipe */}
      <TeamSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTeam} // handleSubmitTeam prend les deux arguments
        currentUserUsername={user?.username || ''}
      />
    </div>
  );
};

export default Card;
