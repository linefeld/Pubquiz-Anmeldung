import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Trophy } from 'lucide-react';
import type { GroupRegistration } from '../App';

interface RegisteredTeamsProps {
  registrations: GroupRegistration[];
}

export function RegisteredTeams({ registrations }: RegisteredTeamsProps) {
  const totalParticipants = registrations.reduce((sum, reg) => sum + reg.members.length, 0);
  
  // Get all participant names
  const allNames = registrations.flatMap(reg => reg.members);
  
  // State for sliding animation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allNames.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allNames.length);
    }, 2000); // Change name every 2 seconds

    return () => clearInterval(interval);
  }, [allNames.length]);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-purple-600" />
        <h2 className="text-purple-900">Angemeldete Teilnehmer</h2>
      </div>

      {/* Sliding Names Animation */}
      {allNames.length > 0 ? (
        <div className="p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg overflow-hidden">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {totalParticipants} {totalParticipants === 1 ? 'Teilnehmer' : 'Teilnehmer'} in {registrations.length} {registrations.length === 1 ? 'Gruppe' : 'Gruppen'}
            </p>
            <div className="h-16 flex items-center justify-center">
              <div
                key={currentIndex}
                className="text-purple-900"
                style={{
                  animation: 'fadeSlide 2s ease-in-out',
                }}
              >
                {allNames[currentIndex]}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
          <p className="text-gray-600">Noch keine Teilnehmer angemeldet</p>
          <p className="text-gray-500 mt-2">Sei die erste Gruppe!</p>
        </div>
      )}

      <style>{`
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Card>
  );
}
