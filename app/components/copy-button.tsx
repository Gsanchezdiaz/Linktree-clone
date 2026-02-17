'use client';

import { useState } from 'react';

interface CopyButtonProps {
  url: string;
  label?: string;
}

export default function CopyButton({ url, label = 'Copiar link' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="py-2 px-4 rounded-lg border text-sm font-medium transition-all"
      style={{
        backgroundColor: copied ? 'var(--cta-yellow)' : '#f5f5f5',
        borderColor: 'var(--border-subtle)',
        color: copied ? '#000' : '#333',
      }}
    >
      {copied ? '✓ ¡Copiado!' : label}
    </button>
  );
}
