
import React from 'react';
import YoutubeEmbed from './YoutubeEmbed';

interface MultiYoutubeViewProps {
  urls: string[];
}

const MultiYoutubeView: React.FC<MultiYoutubeViewProps> = ({ urls }) => {
  const validUrls = urls.filter(Boolean).slice(0, 4);
  const count = validUrls.length;

  if (count === 0) {
    return (
        <div className="aspect-video w-full bg-black flex items-center justify-center text-brand-text-secondary rounded-lg">
            No YouTube URLs provided for this multi-stream.
        </div>
    );
  }

  // This layout smartly handles 1, 2, 3, or 4 videos.
  // 1: Full width
  // 2: 50/50 split
  // 3: First two 50/50, third full width below
  // 4: 2x2 grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full bg-brand-bg rounded-lg p-2 shadow-lg">
      {validUrls.map((url, index) => (
        <div 
            key={index} 
            className={`
                ${count === 1 ? 'md:col-span-2' : ''}
                ${count === 3 && index === 2 ? 'md:col-span-2' : ''}
            `}
        >
             <YoutubeEmbed url={url} />
        </div>
      ))}
    </div>
  );
};

export default MultiYoutubeView;
