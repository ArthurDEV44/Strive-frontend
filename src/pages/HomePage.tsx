import EnterButton from '../components/EnterButton';
import striveLogo from '../assets/Logo-Strive-V1.png';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HomePage: React.FC = () => {
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const createUserInDatabase = async () => {
      if (user) {
        try {
          const response = await fetch(`${backendUrl}/api/create-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkUserId: user.id,
              username: user.username || user.firstName || 'user_' + user.id.substring(0, 6),
            }),
          });

          if (!response.ok) {
            const responseData = await response.json();
            setErrorMessage(responseData.message);
          }
        } catch (error) {
          console.error('Erreur réseau:', error);
          setErrorMessage('Erreur réseau, veuillez réessayer plus tard.');
        }
      }
    };

    if (user) {
      createUserInDatabase();
    }
  }, [user]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-between items-center">
      {/* Barre de navigation */}
      <nav className="flex justify-between items-center px-6 py-4 w-screen">
        <img src={striveLogo} alt="Strive Logo" className="w-24 h-auto cursor-pointer" />
        <div className="flex items-center space-x-4">
          {/* Clerk sign-in button */}
          <SignInButton mode='modal'>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-3xl hover:bg-gray-700">
              Se Connecter
            </button>
          </SignInButton>
          
          {/* Clerk sign-up button */}
          <SignUpButton mode='modal'>
            <button className="bg-gray-900 text-white py-2 px-4 rounded-3xl hover:bg-gray-800">
              S'inscrire
            </button>
          </SignUpButton>

          {/* Si l'utilisateur est connecté, afficher le UserButton et le username */}
          <SignedIn>
            <UserButton />
            {user && (
              <span className="text-white ml-4">Bienvenue, {user.username || user.firstName || 'utilisateur inconnu'}</span>
            )}
          </SignedIn>

          {/* Si l'utilisateur est déconnecté */}
          <SignedOut>
          </SignedOut>
        </div>
      </nav>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}

      {/* Enter button */}
      <div className="flex flex-grow justify-center items-center">
        <EnterButton />
      </div>
    </div>
  );
};

export default HomePage;
