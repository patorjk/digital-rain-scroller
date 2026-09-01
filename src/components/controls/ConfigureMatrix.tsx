import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type MouseEvent, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getParams, MAX_ROWS } from '@/components/controls/basic-utils.ts';
import NativeColorPicker from '@/components/utilities/NativeColorPicker.tsx';

export const ConfigureMatrix = () => {
  const { rows: rowsParam, text: textParam, color: colorParam } = getParams();

  const [color, setColor] = useState(colorParam);
  const [text, setText] = useState(textParam);
  const [rows, setRows] = useState(rowsParam);

  const enterMatrix = (e: MouseEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('text', text);
    url.searchParams.set('rows', rows.toString());
    url.searchParams.set('color', color);
    window.location.href = url.toString();
  };

  return (
    <div
      className={'max-w-xl'}
      style={{
        margin: '0 auto',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Field orientation="horizontal">
        <Input
          type="search"
          placeholder="Your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') enterMatrix(e as any);
          }}
        />
      </Field>

      <>
        <Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="rows">Rows</Label>
            <span className="text-sm text-muted-foreground">{rows}</span>
          </div>
          <Slider
            id="rows"
            value={rows}
            onValueChange={(value) => setRows(value as number)}
            min={200}
            max={MAX_ROWS}
            step={1}
          />
        </Field>
        <Field>
          <NativeColorPicker
            value={color}
            onChange={(value) => setColor(value)}
            label={'Color'}
          />
        </Field>
      </>
      <Field>
        <Button onClick={enterMatrix}>Enter the Matrix</Button>
      </Field>
    </div>
  );
};
