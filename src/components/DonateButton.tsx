import React, { useState } from 'react';

interface DonateButtonProps {
  onDonate: () => void;
}

const DonateButton: React.FC<DonateButtonProps> = ({ onDonate }) => {
  const [amount] = useState<number>(0);

  const handleDonate = () => {
    if (amount > 0) {
      // Simuler le don
      alert(`Don de ${amount} € effectué !`);
      onDonate();  // Appeler la fonction de respin
    }
  };

  return (
    <div className="donate-button flex flex-col items-center">
      <button onClick={handleDonate} className="bg-purple-600 text-white px-6 py-2 rounded-full">
        $
      </button>
    </div>
  );
};

export default DonateButton;
