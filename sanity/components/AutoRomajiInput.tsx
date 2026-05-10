import React, { useEffect, useState, useCallback } from 'react';
import { StringInputProps, set, unset, useFormValue } from 'sanity';
import { TextInput } from '@sanity/ui';
import * as wanakana from 'wanakana';

export function AutoRomajiInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  
  // Memantau perubahan secara real-time pada field 'furigana' di dokumen yang sama
  const furiganaValue = useFormValue(['furigana']) as string | undefined;

  // State untuk mencegah infinite loop saat React re-render
  const [lastGeneratedFrom, setLastGeneratedFrom] = useState<string>('');

  useEffect(() => {
    // Jika furigana memiliki nilai dan nilainya berubah dari sebelumnya
    if (furiganaValue && furiganaValue !== lastGeneratedFrom) {
      const generatedRomaji = wanakana.toRomaji(furiganaValue);
      onChange(set(generatedRomaji));
      setLastGeneratedFrom(furiganaValue);
    }
  }, [furiganaValue, lastGeneratedFrom, onChange]);

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
      value={value || ''}
      onChange={handleChange}
      placeholder="Otomatis terisi dari Furigana..."
    />
  );
}
