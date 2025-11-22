import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { PersonRegistration } from '../App';

interface RegistrationFormProps {
  onSubmit: (data: Omit<PersonRegistration, 'id' | 'timestamp'>) => void;
}

interface FormData {
  name: string;
  mannschaft: string;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onFormSubmit = (data: FormData) => {
    onSubmit({
      name: data.name,
      mannschaft: data.mannschaft,
    });

    reset();
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-purple-600" />
        <h2 className="text-purple-900">Einzelanmeldung</h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Dein Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name ist erforderlich' })}
            placeholder="z.B. Max Mustermann"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Mannschaft */}
        <div>
          <Label htmlFor="mannschaft">Mannschaft *</Label>
          <Input
            id="mannschaft"
            {...register('mannschaft', { required: 'Mannschaft ist erforderlich' })}
            placeholder="z.B. Intense, Intouch, Intime"
            className="mt-1"
          />
          {errors.mannschaft && (
            <p className="text-red-500 mt-1">{errors.mannschaft.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
          Jetzt anmelden
        </Button>
      </form>
    </Card>
  );
}
