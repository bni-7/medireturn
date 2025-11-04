import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import Card from '../common/Card';

const Leaderboard = ({ leaderboard = [], currentUserId }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <span className="text-gray-500 font-semibold">{rank}</span>;
    }
  };

  if (leaderboard.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">City Leaderboard</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">🏆 City Leaderboard</h3>
      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              user.isCurrentUser 
                ? 'bg-primary-50 border-2 border-primary-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${user.isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                  {user.name} {user.isCurrentUser && <span className="text-sm">(You)</span>}
                </p>
                <p className="text-sm text-gray-600">
                  {user.totalCollected}kg collected
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary-600">{user.points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Leaderboard;