import React from 'react';
import { ToggleButton } from './ToggleButton';
import { InfoButton } from './InfoButton';
import type { ImageProcessingOptions, ProcessingSettings } from '../types';

interface InputContainerProps {
  imageUrl: string;
  options: ImageProcessingOptions;
  settings: ProcessingSettings;
  isProcessing: boolean;
  progress: number;
  onSubmit: (e: React.FormEvent) => void;
  onOptionChange: (key: keyof ImageProcessingOptions, value: boolean) => void;
  onSettingChange: (
    key: keyof ProcessingSettings,
    value: number | string
  ) => void;
}

const Slider = ({
  label,
  icon,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  tooltip,
  infoText,
}: {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
  infoText?: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <span>{icon}</span>
        <span>{label}</span>
        {infoText && <InfoButton content={infoText} />}
      </label>
      <span className="text-sm text-gray-400">{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
      title={tooltip}
    />
  </div>
);

// Info text for each section
const sectionInfo = {
  generalSettings: "These settings control the overall image processing behavior.",
  denoise: "Controls how smooth or textured the skin looks. A higher level reduces noise and makes the skin softer, while a lower level keeps more texture and details.",
  realism: "Adjust how much detail and realism is applied to your image. A higher strength makes the skin look more natural, while a lower strength keeps some of the AI plastic look.",
  keepAreas: "If you don’t want the real skin effect applied to certain areas  you can mask them. This keeps the original AI-generated effect in those parts."
};

// Info text for each feature
const featureInfo = {
  background: "The area surrounding the main subject",
  skin: "All skin areas including face and visible body parts",
  nose: "The nose area of the face",
  eye_g: "The general eye area including surrounding skin",
  r_eye: "The right eye",
  l_eye: "The left eye",
  r_brow: "The right eyebrow",
  l_brow: "The left eyebrow",
  r_ear: "The right ear",
  l_ear: "The left ear",
  mouth: "The entire mouth area",
  u_lip: "The upper lip",
  l_lip: "The lower lip",
  hair: "All hair on the head",
  hat: "Any headwear present in the image",
  ear_r: "Earrings or ear accessories",
  neck_l: "The neckline or collar area",
  neck: "The entire neck area",
  cloth: "All clothing visible in the image"
};

export function InputContainer({
  imageUrl,
  options,
  settings,
  isProcessing,
  progress,
  onSubmit,
  onOptionChange,
  onSettingChange,
}: InputContainerProps) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl border border-gray-700">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-200">
              General Settings
            </h3>
            <InfoButton content={sectionInfo.generalSettings} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Slider
              label="Skin Texture Adjuster"
              icon="🛠️"
              value={settings.denoise}
              onChange={(value) => onSettingChange('denoise', value)}
              min={0.3}
              max={0.5}
              tooltip="Denoising strength"
              infoText={sectionInfo.denoise}
            />
            <Slider
              label="Skin Realism Level"
              icon="💪"
              value={settings.loraStrengthModel}
              onChange={(value) => onSettingChange('loraStrengthModel', value)}
              min={0}
              max={5}
              tooltip="LoRA model strength"
              infoText={sectionInfo.realism}
            />
          </div>
        </div>

        {/* Masking Features */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-200">
                Keep Certain Areas Unchanged
              </h3>
              <InfoButton content={sectionInfo.keepAreas} />
            </div>
            <button
              type="button"
              onClick={() => {
                Object.keys(options).forEach((key) => {
                  onOptionChange(key as keyof ImageProcessingOptions, false);
                });
              }}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Reset all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-2 px-2">
            <ToggleButton
              enabled={options.background}
              onChange={(enabled) => onOptionChange('background', enabled)}
              label="Background"
            />
            <ToggleButton
              enabled={options.skin}
              onChange={(enabled) => onOptionChange('skin', enabled)}
              label="Skin"
            />
            <ToggleButton
              enabled={options.nose}
              onChange={(enabled) => onOptionChange('nose', enabled)}
              label="Nose"
            />
            <ToggleButton
              enabled={options.eye_g}
              onChange={(enabled) => onOptionChange('eye_g', enabled)}
              label="Eye General"
            />
            <ToggleButton
              enabled={options.l_eye}
              onChange={(enabled) => onOptionChange('l_eye', enabled)}
              label="Left Eye"
            />
            <ToggleButton
              enabled={options.r_eye}
              onChange={(enabled) => onOptionChange('r_eye', enabled)}
              label="Right Eye"
            />
            <ToggleButton
              enabled={options.l_brow}
              onChange={(enabled) => onOptionChange('l_brow', enabled)}
              label="Left Brow"
            />
            <ToggleButton
              enabled={options.r_brow}
              onChange={(enabled) => onOptionChange('r_brow', enabled)}
              label="Right Brow"
            />
            <ToggleButton
              enabled={options.l_ear}
              onChange={(enabled) => onOptionChange('l_ear', enabled)}
              label="Left Ear"
            />
            <ToggleButton
              enabled={options.r_ear}
              onChange={(enabled) => onOptionChange('r_ear', enabled)}
              label="Right Ear"
            />
            <ToggleButton
              enabled={options.ear_r}
              onChange={(enabled) => onOptionChange('ear_r', enabled)}
              label="Ear Ring"
            />
            <ToggleButton
              enabled={options.mouth}
              onChange={(enabled) => onOptionChange('mouth', enabled)}
              label="Mouth"
            />
            <ToggleButton
              enabled={options.u_lip}
              onChange={(enabled) => onOptionChange('u_lip', enabled)}
              label="Upper Lip"
            />
            <ToggleButton
              enabled={options.l_lip}
              onChange={(enabled) => onOptionChange('l_lip', enabled)}
              label="Lower Lip"
            />
            <ToggleButton
              enabled={options.hair}
              onChange={(enabled) => onOptionChange('hair', enabled)}
              label="Hair"
            />
            <ToggleButton
              enabled={options.hat}
              onChange={(enabled) => onOptionChange('hat', enabled)}
              label="Hat"
            />
            <ToggleButton
              enabled={options.neck}
              onChange={(enabled) => onOptionChange('neck', enabled)}
              label="Neck"
            />
            <ToggleButton
              enabled={options.neck_l}
              onChange={(enabled) => onOptionChange('neck_l', enabled)}
              label="Neck Line"
            />
            <ToggleButton
              enabled={options.cloth}
              onChange={(enabled) => onOptionChange('cloth', enabled)}
              label="Clothing"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isProcessing || !imageUrl}
            className={`relative overflow-hidden px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
              isProcessing || !imageUrl
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5'
            }`}
          >
            <span className="relative flex items-center justify-center gap-2">
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </>
              )}
            </span>
            {isProcessing && (
              <div
                style={{ width: `${progress}%` }}
                className="absolute bottom-0 left-0 h-0.5 bg-violet-400/50 transition-all duration-200"
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}