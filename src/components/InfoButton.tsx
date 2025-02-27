import React, { useState, useRef, useEffect } from 'react';

interface InfoButtonProps {
  content: string;
}

export function InfoButton({ content }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1.5 text-gray-400 hover:text-gray-300 transition-colors duration-200 focus:outline-none"
        aria-label="More information"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          ref={tooltipRef}
          className="absolute z-10 w-64 p-3 mt-2 -right-2 text-sm text-left bg-gray-700 rounded-lg shadow-lg border border-gray-600 animate-fade-in"
        >
          <div className="text-gray-200">{content}</div>
          <div className="absolute -top-2 right-2.5 w-3 h-3 bg-gray-700 border-t border-l border-gray-600 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}