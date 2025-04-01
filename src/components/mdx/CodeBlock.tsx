// components/mdx/CodeBlock.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  className?: string;
  title?: string;
  caption?: string;
  showLineNumbers?: boolean;
  language?: string;
  highlightLines?: number[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  title,
  caption,
  showLineNumbers = false,
  language,
  highlightLines = [],
}) => {
  const [copied, setCopied] = React.useState(false);
  const codeRef = React.useRef<HTMLPreElement>(null);

  // Extract language from className if not explicitly provided
  const languageMatch = className?.match(/language-(\w+)/);
  const codeLanguage = language || (languageMatch ? languageMatch[1] : 'text');

  // Handle copy to clipboard
  const handleCopy = () => {
    if (codeRef.current && navigator.clipboard) {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Create line highlighting styles
  const lineProps = (lineNumber: number) => {
    const style: React.CSSProperties = { display: 'block' };
    if (highlightLines.includes(lineNumber)) {
      style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      style.borderLeft = '3px solid #61dafb';
      style.paddingLeft = '16px';
    }
    return { style };
  };

  return (
    <div className="group relative my-6 rounded-lg bg-secondary/30">
      {title && (
        <div className="flex items-center justify-between rounded-t-lg border-b border-border bg-secondary/50 px-4 py-2 text-sm font-medium">
          <span>{title}</span>
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckIcon className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            className="absolute right-2 top-2 z-10 rounded-md bg-secondary/80 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </button>
        )}
        <SyntaxHighlighter
          ref={codeRef}
          language={codeLanguage}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={lineProps}
          customStyle={{
            margin: 0,
            borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
            padding: '1rem',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      {caption && (
        <div className="border-t border-border bg-secondary/50 px-4 py-2 text-center text-xs text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;