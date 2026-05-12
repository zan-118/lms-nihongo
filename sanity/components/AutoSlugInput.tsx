import React, { useEffect, useState, useCallback } from 'react';
import { ObjectInputProps, set, unset, useFormValue } from 'sanity';
import { TextInput } from '@sanity/ui';

// Fungsi bantuan untuk membuat slug (karena kita tidak pakai library tambahan)
const generateSlug = (input: string) => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Hapus karakter non-alphanumeric (kecuali spasi & strip)
    .replace(/[\s_-]+/g, '-') // Ganti spasi/underscore dengan strip
    .replace(/^-+|-+$/g, ''); // Hapus strip di awal dan akhir
};

export function AutoSlugInput(props: ObjectInputProps) {
  const { value, onChange, elementProps } = props;
  
  // Memantau perubahan pada field 'title'
  const titleValue = useFormValue(['title']) as string | undefined;

  // State untuk mencegah infinite loop
  const [lastGeneratedFrom, setLastGeneratedFrom] = useState<string>('');

  useEffect(() => {
    if (titleValue && titleValue !== lastGeneratedFrom) {
      const generatedSlug = generateSlug(titleValue);
      // Slug di Sanity adalah object dengan property 'current'
      onChange(set({ _type: 'slug', current: generatedSlug }));
      queueMicrotask(() => {
        setLastGeneratedFrom(titleValue);
      });
    }
  }, [titleValue, lastGeneratedFrom, onChange]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;
      if (nextValue) {
        onChange(set({ _type: 'slug', current: nextValue }));
      } else {
        onChange(unset());
      }
    },
    [onChange]
  );

  return (
    <TextInput
      {...elementProps}
      // @ts-ignore - elementProps dari ObjectInputProps mungkin tidak sepenuhnya cocok dengan TextInput, tapi aman untuk field 'current'
      value={(value as any)?.current || ''}
      onChange={handleChange}
      placeholder="Otomatis di-generate dari Title..."
    />
  );
}
