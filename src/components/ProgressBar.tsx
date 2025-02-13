// components/ProgressBar.tsx
interface ProgressBarProps {
  progress: number;
  currentVideo: string;
}

export function ProgressBar({ progress, currentVideo }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-medium">{Math.round(progress * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {currentVideo && (
        <div className="mt-2 text-sm text-gray-500">
          Currently scraping: {currentVideo}
        </div>
      )}
    </div>
  );
}