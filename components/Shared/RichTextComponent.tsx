'use client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//
interface PropsType {
  value: string;
  onChange: (value: string) => void;
}
//
export default function RichTextComponent(props: PropsType) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={props.value}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.onChange(data);
      }}
    />
  );
}
