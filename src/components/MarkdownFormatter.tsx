import React from 'react';

interface MarkdownFormatterProps {
  text: string;
}

export function MarkdownFormatter({ text }: MarkdownFormatterProps) {
  const formatText = (input: string) => {
    const lines = input.split('\n');
    const formatted: JSX.Element[] = [];
    let key = 0;

    lines.forEach((line, lineIndex) => {
      // Lista con asterisco (* item)
      if (line.trim().startsWith('* ')) {
        const content = line.trim().substring(2);
        formatted.push(
          <li key={key++} className="ml-4 mb-1 flex items-start">
            <span className="text-primary mr-2 mt-1">•</span>
            <span>{parseInlineFormatting(content)}</span>
          </li>
        );
      }
      // Lista con guion (- item)
      else if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        formatted.push(
          <li key={key++} className="ml-4 mb-1 flex items-start">
            <span className="text-primary mr-2 mt-1">•</span>
            <span>{parseInlineFormatting(content)}</span>
          </li>
        );
      }
      // Línea vacía (espacio)
      else if (line.trim() === '') {
        formatted.push(<div key={key++} className="h-2" />);
      }
      // Texto normal
      else {
        formatted.push(
          <p key={key++} className="mb-2">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    return formatted;
  };

  const parseInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let partKey = 0;

    // Regex para encontrar **texto** (negrita)
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(currentText)) !== null) {
      // Agregar texto antes del match
      if (match.index > lastIndex) {
        parts.push(currentText.substring(lastIndex, match.index));
      }
      
      // Agregar texto en negrita
      parts.push(
        <strong key={`bold-${partKey++}`} className="font-semibold text-primary">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Agregar el texto restante
    if (lastIndex < currentText.length) {
      parts.push(currentText.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="text-sm leading-relaxed space-y-1">
      {formatText(text)}
    </div>
  );
}

