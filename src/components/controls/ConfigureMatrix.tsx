import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type MouseEvent, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_AUTOSCROLL_SECONDS,
  getParams,
  MAX_AUTOSCROLL_SECONDS,
  MAX_ROWS,
  MIN_AUTOSCROLL_SECONDS,
} from '@/components/controls/basic-utils.ts';
import NativeColorPicker from '@/components/utilities/NativeColorPicker.tsx';

export const ConfigureMatrix = () => {
  const {
    rows: rowsParam,
    text: textParam,
    color: colorParam,
    autoscroll: autoscrollParam,
  } = getParams();

  const [color, setColor] = useState(colorParam);
  const [text, setText] = useState(textParam);
  const [rows, setRows] = useState(rowsParam);
  const [autoscroll, setAutoscroll] = useState(autoscrollParam !== null);
  const [autoscrollSeconds, setAutoscrollSeconds] = useState(
    autoscrollParam ?? DEFAULT_AUTOSCROLL_SECONDS,
  );

  const enterMatrix = (e: MouseEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('text', text);
    url.searchParams.set('rows', rows.toString());
    url.searchParams.set('color', color);
    if (autoscroll) {
      url.searchParams.set('autoscroll', autoscrollSeconds.toString());
    } else {
      url.searchParams.delete('autoscroll');
    }
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
        <Field>
          <Label htmlFor="autoscroll">
            <Checkbox
              id="autoscroll"
              checked={autoscroll}
              onCheckedChange={(checked) => setAutoscroll(checked === true)}
            />
            Autoscroll
          </Label>
          {autoscroll && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoscroll-seconds">Seconds</Label>
                <span className="text-sm text-muted-foreground">
                  {autoscrollSeconds}
                </span>
              </div>
              <Slider
                id="autoscroll-seconds"
                value={autoscrollSeconds}
                onValueChange={(value) => setAutoscrollSeconds(value as number)}
                min={MIN_AUTOSCROLL_SECONDS}
                max={MAX_AUTOSCROLL_SECONDS}
                step={1}
              />
            </>
          )}
        </Field>
      </>
      <Field>
        <Button onClick={enterMatrix}>Enter the Matrix</Button>
      </Field>
    </div>
  );
};
