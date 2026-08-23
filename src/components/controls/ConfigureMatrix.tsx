import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type MouseEvent, useState } from 'react';
import { IoMdSettings } from 'react-icons/io';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getParams } from '@/components/controls/basic-utils.ts';

export const ConfigureMatrix = () => {
  const { rows: rowsParam, text: textParam } = getParams();

  const [text, setText] = useState(textParam);
  const [rows, setRows] = useState(rowsParam);
  const [showSettings, setShowSettings] = useState(false);

  const enterMatrix = (e: MouseEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('text', text);
    url.searchParams.set('rows', rows.toString());
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
        />
        <Button onClick={enterMatrix}>Enter the Matrix</Button>
        <Button onClick={() => setShowSettings((prev) => !prev)}>
          <IoMdSettings />
        </Button>
      </Field>
      {showSettings && (
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
            max={1000}
            step={1}
          />
        </Field>
      )}
    </div>
  );
};
