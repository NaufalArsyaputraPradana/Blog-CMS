"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Gunakan dynamic import agar React Quill hanya dimuat di sisi Client (Browser)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[300px] pb-[42px] dark:text-zinc-50"
      />
      <style jsx global>{`
        /* Menyesuaikan Quill Toolbar untuk Dark Mode */
        .dark .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #27272a;
          background: #18181b;
        }
        .dark .ql-container.ql-snow {
          border: none;
        }
        .dark .ql-snow .ql-stroke {
          stroke: #a1a1aa;
        }
        .dark .ql-snow .ql-fill {
          fill: #a1a1aa;
        }
        .dark .ql-snow .ql-picker {
          color: #a1a1aa;
        }
        .dark .ql-snow .ql-picker-options {
          background-color: #27272a;
          border-color: #3f3f46;
        }
      `}</style>
    </div>
  );
}
