"use client";

import { ChevronDown } from "lucide-react";

export type FaqAnswer = {
  text?: string;
  items?: string[];
};

export type FaqItemData = {
  id: string;
  question: string;
  answers: FaqAnswer[];
};

type FaqItemProps = {
  item: FaqItemData;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FaqItem({ item, isOpen, onToggle }: FaqItemProps) {
  const contentId = `faq-answer-${item.id}`;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-weg-blue sm:px-6 sm:text-lg"
        >
          <span>{item.question}</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 text-weg-blue transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </h2>

      <div
        id={contentId}
        role="region"
        aria-label={`Resposta: ${item.question}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-5 py-4 text-sm leading-6 text-gray-600 sm:px-6 sm:text-base">
            {item.answers.map((answer, index) => (
              <div key={`${item.id}-${index}`} className={index > 0 ? "mt-4" : ""}>
                {answer.text && <p>{answer.text}</p>}
                {answer.items && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-weg-blue">
                    {answer.items.map((answerItem) => <li key={answerItem}>{answerItem}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
