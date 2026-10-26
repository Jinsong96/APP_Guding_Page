import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CefrLevelKey } from './stages/Stage02AiChat';
import { LEVEL_SAMPLES } from './DifficultySentencePicker';

interface DifficultyOption {
  label: string;
  subtitle?: string;
  level?: CefrLevelKey;
}

interface DifficultyExampleListProps {
  options: DifficultyOption[];
  onConfirm: (level: CefrLevelKey) => void;
}

const DEFAULT_LEVEL: CefrLevelKey = 'A2';

// V2 03B 阅读难度 (例句版), the comparison to the sentence card: all four levels as option cards.
// Each card's example sentence stays folded; picking a card unfolds its example (accordion).
// Styles: difficulty-picker.css (dl-*).
export const DifficultyExampleList: React.FC<DifficultyExampleListProps> = ({ options, onConfirm }) => {
  const [selected, setSelected] = useState<CefrLevelKey>(DEFAULT_LEVEL);
  const selectedLabel = options.find((option) => option.level === selected)?.label;

  return (
    <div className="dl-root">
      <div className="dl-options" role="radiogroup" aria-label="阅读难度">
        {options.map((option) => {
          if (!option.level) return null;
          const level = option.level;
          const isSelected = level === selected;
          const sample = LEVEL_SAMPLES.find((item) => item.level === level);
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-expanded={isSelected}
              onClick={() => setSelected(level)}
              className={`dl-option ${isSelected ? 'is-selected' : ''}`}
            >
              <span className="dl-option-head">
                <span>
                  <strong>{option.label}</strong>
                  {option.subtitle && <span className="dl-subtitle"> · {option.subtitle}</span>}
                </span>
                <span className="dl-check" aria-hidden="true">
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </span>
              </span>
              {sample && (
                <>
                  <span className="dl-toggle" aria-hidden="true">
                    {isSelected ? '例句' : '看例句'}
                    <ChevronDown size={14} strokeWidth={2} />
                  </span>
                  <span className="dl-fold">
                    <span className="dl-fold-inner">
                      <span className="dl-example" lang="en">
                        {sample.sentence}
                      </span>
                    </span>
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="dp-footer">
        <button type="button" className="dp-confirm" onClick={() => onConfirm(selected)}>
          就读「{selectedLabel}」难度
        </button>
      </div>
    </div>
  );
};
