import { type ChangeEvent, useId } from 'react';
import { Label } from '@/components/ui/label';

interface NativeColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function NativeColorPicker({
  value,
  onChange,
  label,
}: NativeColorPickerProps) {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {label && <Label htmlFor={id}>{label}</Label>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #ccc',
            backgroundColor: value,
          }}
        >
          <input
            id={id}
            type="color"
            value={value}
            onChange={handleChange}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              opacity: 0,
            }}
          />
        </div>

        <Label>{value}</Label>
      </div>
    </div>
  );
}
