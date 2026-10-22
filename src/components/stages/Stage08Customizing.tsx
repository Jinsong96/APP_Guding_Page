import React from 'react';
import { Companion, RideTicket } from '../../types';
import { JourneyArrival } from '../JourneyArrival';
import type { FirstReadVocab } from '../../firstReadArticles';

interface Stage08CustomizingProps {
  companion: Companion;
  interestTheme: string;
  selectedThemes?: string[];
  ticket: RideTicket;
  articleMinutes?: number;
  paragraphCount?: number;
  learnedWords?: FirstReadVocab[];
  onBack: () => void;
  onNext: () => void;
  onOpenTicketBook?: () => void;
}

export const CEFR_TO_STARTING_LEVEL: Record<string, string> = {
  'A1-': 'L1',
  'A2': 'L4',
  'B1': 'L7',
  'B2+': 'L10'
};

// The first read's arrival with its keepsake ticket and next-step actions.
export const Stage08Customizing: React.FC<Stage08CustomizingProps> = ({
  companion,
  interestTheme,
  selectedThemes,
  ticket,
  articleMinutes = 3,
  paragraphCount = 6,
  learnedWords = [],
  onBack,
  onNext,
  onOpenTicketBook
}) => {
  return (
    <JourneyArrival
      companion={companion}
      ticket={ticket}
      stats={[
        { value: `${paragraphCount} 段`, label: '读完全文' },
        { value: `${learnedWords.length} 个`, label: '新认识的词' },
        { value: `约 ${articleMinutes} 分钟`, label: '这一程' }
      ]}
      primaryLabel="开启阅读世界"
      onPrimary={onNext}
      secondaryLabel={onOpenTicketBook ? '查看我们的车票册' : undefined}
      onSecondary={onOpenTicketBook}
      onBack={onBack}
    />
  );
};
