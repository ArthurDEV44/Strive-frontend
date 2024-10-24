import React, { useState } from 'react';
import '../styles/TeamSetupModal.css';

interface TeamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teammateUsername: string, teamName: string) => void;
  currentUserUsername: string;
}

const TeamSetupModal: React.FC<TeamSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserUsername,
}) => {
  const [teammateUsername, setTeammateUsername] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(teammateUsername, teamName);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-white">Configuration de l'équipe</h2>
        <label className="block mt-4">
          <span className="text-white">Nom de l'équipe :</span>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="block mt-1 w-full p-2 bg-gray-700 text-white rounded"
          />
        </label>
        <label className="block mt-4">
          <span className="text-white">Coéquipier :</span>
          <input
            type="text"
            value={teammateUsername}
            onChange={(e) => setTeammateUsername(e.target.value)}
            className="block mt-1 w-full p-2 bg-gray-700 text-white rounded"
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Soumettre
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupModal;
