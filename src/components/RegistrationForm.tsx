import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { GroupRegistration } from '../App';

interface RegistrationFormProps {
  onSubmit: (data: Omit<GroupRegistration, 'id' | 'timestamp'>) => void;
}

interface FormData {
  member1: string;
  member2: string;
  member3: string;
  mannschaft: string;
  groupSize: '2' | '3';
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [groupSize, setGroupSize] = useState<'2' | '3'>('2');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      groupSize: '2',
    },
  });

  const onFormSubmit = (data: FormData) => {
    const members = [data.member1, data.member2];
    if (groupSize === '3' && data.member3) {
      members.push(data.member3);
    }

    onSubmit({
      members,
      mannschaft: data.mannschaft,
    });

    reset();
    setGroupSize('2');
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-5 h-5 text-purple-600" />
        <h2 className="text-purple-900">Gruppenanmeldung</h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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

        {/* Group Size */}
        <div>
          <Label>Gruppengröße *</Label>
          <RadioGroup
            value={groupSize}
            onValueChange={(value) => setGroupSize(value as '2' | '3')}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="size-2" />
              <Label htmlFor="size-2" className="cursor-pointer">2 Personen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="size-3" />
              <Label htmlFor="size-3" className="cursor-pointer">3 Personen</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Group Members */}
        <div className="space-y-4">
          <Label>Gruppenmitglieder *</Label>
          
          <div>
            <Input
              {...register('member1', { required: 'Mindestens 2 Personen erforderlich' })}
              placeholder="Name Person 1"
            />
            {errors.member1 && (
              <p className="text-red-500 mt-1">{errors.member1.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('member2', { required: 'Mindestens 2 Personen erforderlich' })}
              placeholder="Name Person 2"
            />
            {errors.member2 && (
              <p className="text-red-500 mt-1">{errors.member2.message}</p>
            )}
          </div>

          {groupSize === '3' && (
            <div>
              <Input
                {...register('member3', { required: groupSize === '3' ? 'Dritte Person erforderlich' : false })}
                placeholder="Name Person 3"
              />
              {errors.member3 && (
                <p className="text-red-500 mt-1">{errors.member3.message}</p>
              )}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
          Gruppe anmelden
        </Button>
      </form>
    </Card>
  );
}
