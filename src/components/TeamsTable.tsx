import React from 'react';

interface Team {
  id: number;
  teamName: string;
  // Ajoutez d'autres propriétés si nécessaire
}

interface TeamsTableProps {
  teams: Team[];
}

const TeamsTable: React.FC<TeamsTableProps> = ({ teams }) => {
  return (
    <div className="teams-table">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Équipe</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-t">
              <td className="px-4 py-2">{team.id}</td>
              <td className="px-4 py-2">{team.teamName}</td>
              {/* Ajoutez d'autres propriétés si nécessaire */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamsTable;
