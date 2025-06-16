import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = "Oops! Nothing Found",
  message = "We're sorry, but we couldn't find what you're looking for.",
  showHomeButton = true
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* You can replace this with any cute error illustration */}
      <div className="relative w-64 h-64 mb-6">
        <Image
          src="/images/error-cat.svg"
          alt="Error Illustration"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        {title}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      {showHomeButton && (
        <Link href="/">
          <Button variant="default" size="lg">
            Back to Home
          </Button>
        </Link>
      )}
    </div>
  );
}
