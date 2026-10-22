import React from 'react';
import { Companion, RideTicket } from '../../types';
import { JourneyArrival } from '../JourneyArrival';

interface Stage07GrowthFeedbackProps {
  companion: Companion;
  ticket: RideTicket;
  paragraphCount?: number;
  minutes?: number;
  bookmarkCount?: number;
  onBack: () => void;
  onNext: () => void;
  onOpenTicketBook?: () => void;
}

// Arrival after a read started from the home page: one more ride, one more ticket.
export const Stage07GrowthFeedback: React.FC<Stage07GrowthFeedbackProps> = ({
  companion,
  ticket,
  paragraphCount = 3,
  minutes = 2,
  bookmarkCount = 0,
  onBack,
  onNext,
  onOpenTicketBook
}) => (
  <JourneyArrival
    companion={companion}
    ticket={ticket}
    memoryLine={`${companion.name}把这一程记在了车票册里。`}
    stats={[
      { value: `${paragraphCount} 段`, label: '读完全文' },
      { value: `${bookmarkCount} 句`, label: '收藏的句子' },
      { value: `约 ${minutes} 分钟`, label: '这一程' }
    ]}
    primaryLabel="回到阅读首页"
    onPrimary={onNext}
    secondaryLabel={onOpenTicketBook ? '查看我们的车票册' : undefined}
    onSecondary={onOpenTicketBook}
    onBack={onBack}
  />
);
