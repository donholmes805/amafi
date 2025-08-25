
import React from 'react';

interface YoutubeEmbedProps {
  url: string;
}

const getYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url }) => {
    const videoId = getYouTubeID(url);

    if (!videoId) {
        return (
            <div className="aspect-video w-full bg-black flex items-center justify-center text-brand-text-secondary rounded-lg">
                Invalid YouTube URL provided.
            </div>
        );
    }
    
    return (
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    );
};

export default YoutubeEmbed;
