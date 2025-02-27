import React, { useCallback, useState } from 'react';
import type { ProcessingResult } from '../types';
import { PreviewContainer } from './PreviewContainer';
import { uploadToCloudinary } from '../utils/cloudinary';

interface ImageGridProps {
  imageUrl: string;
  result: ProcessingResult | null;
  isProcessing: boolean;
  onImageSelect: (url: string) => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onEnhance: () => Promise<void>;
}

export function ImageGrid({
  imageUrl,
  result,
  isProcessing,
  onImageSelect,
  onUrlChange,
  onReset,
  onEnhance,
}: ImageGridProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      await onEnhance();
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'enhanced-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      const cloudinaryUrl = await uploadToCloudinary(file);
      onImageSelect(cloudinaryUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      // You might want to show an error message to the user
    } finally {
      setIsUploading(false);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (isComparing && imageUrl && result?.outputUrl) {
    return (
      <div className="space-y-4">
        <PreviewContainer
          imageUrl={imageUrl}
          result={result}
          onBack={() => setIsComparing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Image Container */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-200">Input Image</h3>
              {imageUrl && (
                <button
                  onClick={onReset}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {!imageUrl ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* URL Input */}
                <div className="w-full max-w-sm">
                  <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={onUrlChange}
                    className="w-full px-4 py-2 rounded-lg border bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-opacity-50 text-sm text-center"
                    placeholder="Paste image URL here..."
                  />
                </div>

                {/* Divider */}
                <div className="w-full max-w-sm relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 text-gray-400 bg-gray-800">or drop image here</span>
                  </div>
                </div>

                {/* Upload Area */}
                <div className="w-full max-w-sm">
                  <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative block w-full h-48 rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 group-hover:from-emerald-500/10 group-hover:to-emerald-500/20 transition-all duration-300" />
                    <div className="absolute inset-1 border-2 border-dashed border-emerald-500/20 group-hover:border-emerald-500/40 rounded-lg transition-colors duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald-400 transition-colors duration-300">
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-8 w-8 mb-2 opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-sm font-medium">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-75 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-medium">Drop image here</p>
                          <p className="text-xs opacity-75 mt-1">or click to browse</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden shadow-lg aspect-square">
                <img
                  src={imageUrl}
                  alt="Input"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Output Image */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-700">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-200">Output Image</h3>
              <div className="flex items-center gap-3">
                {result?.outputUrl && (
                  <>
                    <button
                      onClick={handleEnhance}
                      disabled={isEnhancing}
                      className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${
                        isEnhancing
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      } rounded-full transition-colors duration-200`}
                    >
                      {isEnhancing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Enhance
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsComparing(true)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Compare
                    </button>
                  </>
                )}
                <span className="px-3 py-1 text-sm font-medium text-indigo-400 bg-indigo-500/20 rounded-full">AI Generated</span>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-square">
              {result?.outputUrl ? (
                <>
                  <img
                    src={result.outputUrl}
                    alt="Output"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDownload(result.outputUrl!)}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-white transition-colors duration-200"
                    title="Download image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                  {isProcessing ? (
                    <div className="text-center space-y-3">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-indigo-400/30 rounded-full"></div>
                        <div className="absolute top-0 w-12 h-12 border-4 border-t-indigo-400 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-400">Processing image...</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      <p>AI generated image will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}