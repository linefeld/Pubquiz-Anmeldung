import { ReactNode, InputHTMLAttributes } from 'react';

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({ value, onValueChange, children, className = '' }: RadioGroupProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

export function RadioGroupItem({ value, id, ...props }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
      {...props}
    />
  );
}
