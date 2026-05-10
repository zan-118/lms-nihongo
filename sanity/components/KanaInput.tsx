import React, { useEffect, useRef, useCallback } from 'react';
import { StringInputProps, set, unset } from 'sanity';
import { TextInput } from '@sanity/ui';
import * as wanakana from 'wanakana';

export function KanaInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      // Wanakana bind intercepts keypresses and automatically converts romaji to kana
      wanakana.bind(el, { IMEMode: true });
      return () => {
        wanakana.unbind(el);
      };
    }
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <TextInput
      {...elementProps}
      ref={inputRef}
      value={value || ''}
      onChange={handleChange}
      placeholder="Ketik romaji, otomatis jadi Hiragana..."
    />
  );
}
