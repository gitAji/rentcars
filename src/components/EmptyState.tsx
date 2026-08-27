import Link from 'next/link';
import type { IconType } from 'react-icons';

interface EmptyStateProps {
  icon: IconType;
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/**
 * Shared "nothing here" card used for empty search results, empty lists,
 * and full-page not-found states, so every empty state in the app looks
 * and behaves the same way.
 */
export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionHref,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400 mb-4">
        <Icon size={24} />
      </div>
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      {message && <p className="text-neutral-dark mt-1 max-w-md">{message}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="btn-primary mt-6 inline-block px-6 py-2.5"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
