import { useState, useEffect } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { RegisteredTeams } from './components/RegisteredTeams';
import { Countdown } from './components/Countdown';
import { Beer, Users } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';

export interface PersonRegistration {
  id: string;
  name: string;
  mannschaft: string;
  timestamp: number;
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aa1c64f0`;

export default function App() {
  const [registrations, setRegistrations] = useState<PersonRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const deadline = new Date('2025-12-31T23:59:59');

  // Load existing registrations on mount
  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await fetch(`${API_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load registrations');
      }

      const data = await response.json();
      setRegistrations(data.persons || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Fehler beim Laden der Anmeldungen');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (registration: Omit<PersonRegistration, 'id' | 'timestamp'>) => {
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(registration),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save registration');
      }

      const data = await response.json();
      
      // Add the new registration to the list
      setRegistrations(prev => [data.person, ...prev]);

      toast.success('Erfolgreich angemeldet!', {
        description: 'Du wurdest erfolgreich zum Pubquiz angemeldet.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving registration:', error);
      toast.error('Fehler bei der Anmeldung', {
        description: 'Bitte versucht es erneut.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 p-6 bg-purple-600 text-white rounded-lg shadow-lg">
            <h1 className="mb-3">Pubquiz</h1>
            <div className="space-y-1">
              <p className="text-purple-100">16.01.2026</p>
              <p className="text-purple-100">Bunter Vogel</p>
              <p className="text-purple-100">19:30 Uhr</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-12 h-12 text-purple-600" />
            <h2 className="text-purple-900">Anmeldung</h2>
            <Users className="w-12 h-12 text-purple-600" />
          </div>
          <p className="text-purple-700 mb-2">KreAktivis e.V.</p>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-100 border-2 border-blue-300 rounded-lg text-center">
          <p className="text-blue-900">
            💡 <strong>Hinweis:</strong> Du meldest dich alleine an. Später werden die Teams für das Pubquiz zusammengestellt.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Registration Form */}
          <div>
            <RegistrationForm onSubmit={handleRegistration} />
          </div>

          {/* Registered Groups */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Lade Anmeldungen...</p>
              </div>
            ) : (
              <RegisteredTeams registrations={registrations} />
            )}
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-12">
          <Countdown deadline={deadline} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Ein Event von KreAktivis e.V. - Tanzverein</p>
        </div>
      </div>
    </div>
  );
}
