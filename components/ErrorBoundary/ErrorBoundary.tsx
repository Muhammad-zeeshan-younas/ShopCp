// components/ErrorBoundary.tsx
"use client";
import { ReactNode, useState } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      fallback || (
        <div className="p-4 text-center">
          <h2 className="text-lg font-medium text-red-600">
            Something went wrong
          </h2>
          <button
            onClick={resetError}
            className="mt-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      )
    );
  }

  return (
    <ErrorBoundaryWrapper setHasError={setHasError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

// Helper component to handle error catching
const ErrorBoundaryWrapper = ({
  children,
  setHasError,
}: {
  children: ReactNode;
  setHasError: (hasError: boolean) => void;
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error caught by boundary:", error);
    setHasError(true);
    return null;
  }
};
