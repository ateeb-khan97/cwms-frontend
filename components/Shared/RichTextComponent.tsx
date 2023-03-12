'use client';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });
//
type Props = {
  className?: string;
  value: string;
  onChange: (value: any) => void;
};
//
export default function RichTextComponent(props: Props) {
  return (
    <RichTextEditor
      {...props}
      controls={[
        ['bold', 'italic', 'underline'],
        ['unorderedList', 'h1', 'h2', 'h3'],
        ['sup', 'sub'],
        ['alignLeft', 'alignCenter', 'alignRight'],
      ]}
    />
  );
}
