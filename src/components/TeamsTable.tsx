// src/components/TeamsTable.tsx
import React from 'react';

interface TeamsTableProps {
  teams: string[];
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
          {teams.map((team, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamsTable;
