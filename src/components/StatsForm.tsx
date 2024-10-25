import React from 'react';

interface StatsFormProps {
  ratio: number | null;
  kills: number | null;
  placement: number | null;
  setRatio: (value: number) => void;
  setKills: (value: number) => void;
  setPlacement: (value: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const StatsForm: React.FC<StatsFormProps> = ({
  ratio,
  kills,
  placement,
  setRatio,
  setKills,
  setPlacement,
  handleSubmit
}) => (
  <form onSubmit={handleSubmit} className="mt-6">
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="ratio" className="block text-white">Ratio (K/D)</label>
        <input
          id="ratio"
          type="number"
          value={ratio || ''}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="kills" className="block text-white">Kills</label>
        <input
          id="kills"
          type="number"
          value={kills || ''}
          onChange={(e) => setKills(Number(e.target.value))}
          className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="placement" className="block text-white">Placement</label>
        <input
          id="placement"
          type="number"
          value={placement || ''}
          onChange={(e) => setPlacement(Number(e.target.value))}
          className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
        />
      </div>
    </div>
    <button type="submit" className="mt-4 bg-purple-600 text-white py-2 px-4 rounded">
      Mettre à jour
    </button>
  </form>
);

export default StatsForm;
