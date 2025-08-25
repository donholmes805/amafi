
import React, { useState, useMemo } from 'react';
import { AMA, AMAStatus, AMAType, User, Role } from '../types';
import AMACard from './AMACard';
import FeaturedAMACard from './FeaturedAMACard';
import Button from './Button';
import { ICONS } from '../constants';

interface LandingPageProps {
  amas: AMA[];
  currentUser: User | null;
  onSelectAMA: (ama: AMA) => void;
  onSelectUser: (user: User) => void;
  onNavigateToHighlights: (ama: AMA) => void;
  onCreateAMA: () => void;
}

// New EmptyState component for displaying placeholders
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="text-center text-brand-text-secondary p-12 bg-brand-surface rounded-lg border-2 border-dashed border-brand-secondary/30">
      <div className="flex justify-center items-center mb-4">
        <div className="w-16 h-16 text-brand-secondary opacity-50">
            {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-brand-text-primary mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};


const FeaturedSection: React.FC<{ amas: AMA[], onSelectAMA: (ama: AMA) => void, onSelectUser: (user: User) => void }> = ({ amas, onSelectAMA, onSelectUser }) => {
    if (amas.length === 0) return null;
    return (
        <section className="mb-12 bg-brand-surface rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-brand-text-primary border-l-4 border-brand-primary pl-4">Featured AMAs</h2>
            <div className="overflow-x-auto pb-4 -mx-6 scrollbar-thin">
                <div className="flex space-x-6 px-6">
                    {amas.map(ama => <FeaturedAMACard key={ama.id} ama={ama} onSelect={onSelectAMA} onSelectUser={onSelectUser} />)}
                </div>
            </div>
        </section>
    );
};

const AMASection: React.FC<{ title: string, amas: AMA[], onSelectAMA: (ama: AMA) => void, onSelectUser: (user: User) => void, onNavigateToHighlights: (ama: AMA) => void }> = ({ title, amas, onSelectAMA, onSelectUser, onNavigateToHighlights }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const initialVisibleCount = 3;
    
    const visibleAMAs = isExpanded ? amas : amas.slice(0, initialVisibleCount);
    
    const getEmptyState = () => {
        switch (title) {
            case 'Live Now':
                return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6 6 6 0 00-6 6v1.5a6 6 0 006 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0-6.75V6.75m-6 3h.008v.008H6V9.75zm12 0h.008v.008H18V9.75z" /></svg>,
                    title: "No Live AMAs Match Your Search",
                    description: "Try clearing your search or filter to see all live sessions."
                };
            case 'Upcoming AMAs':
                 return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 14.25h.008v.008H12v-.008z" /></svg>,
                    title: "No Upcoming AMAs Match Your Search",
                    description: "Try different keywords to find scheduled AMAs."
                };
            case 'Past AMAs':
                 return {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
                    title: "No Past AMAs Match Your Search",
                    description: "No archived AMAs match your current search criteria."
                };
            default:
                return {
                    icon: <div />,
                    title: "No Content Found",
                    description: "There is no content to display that matches your search."
                };
        }
    }

    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold border-l-4 border-brand-primary pl-4">{title}</h2>
                {amas.length > initialVisibleCount && (
                     <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                )}
            </div>
            {amas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleAMAs.map(ama => <AMACard key={ama.id} ama={ama} onSelect={onSelectAMA} onSelectUser={onSelectUser} onNavigateToHighlights={onNavigateToHighlights} />)}
                </div>
            ) : (
                <EmptyState {...getEmptyState()} />
            )}
        </section>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ amas, currentUser, onSelectAMA, onSelectUser, onNavigateToHighlights, onCreateAMA }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | AMAType>('ALL');

  const filteredAMAs = useMemo(() => {
    return amas.filter(ama => {
      // Filter by type
      const amaType = ama.amaType || ama.ama_type;
      if (typeFilter !== 'ALL' && amaType !== typeFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm.trim() === '') {
        return true;
      }

      const lowercasedSearch = searchTerm.toLowerCase();
      return (
        ama.title.toLowerCase().includes(lowercasedSearch) ||
        ama.description.toLowerCase().includes(lowercasedSearch) ||
        ama.host.name.toLowerCase().includes(lowercasedSearch)
      );
    });
  }, [amas, searchTerm, typeFilter]);


  const featuredAMAs = filteredAMAs.filter(a => a.is_featured);
  const liveAMAs = filteredAMAs.filter(a => a.status === AMAStatus.LIVE && !a.is_featured);
  const upcomingAMAs = filteredAMAs.filter(a => a.status === AMAStatus.UPCOMING && !a.is_featured);
  const pastAMAs = filteredAMAs.filter(a => a.status === AMAStatus.ENDED && !a.is_featured);

  const getCTAText = () => {
    if (currentUser?.role === Role.HOST) {
      return "Go to Your Dashboard";
    }
    return "Create Your Own AMA";
  };

  return (
    <div className="space-y-8">
      <FeaturedSection amas={featuredAMAs} onSelectAMA={onSelectAMA} onSelectUser={onSelectUser} />

      <div className="text-center py-10">
        <h1 className="text-5xl font-extrabold text-brand-text-primary">The Stage for Questions & Conversations.</h1>
        <p className="text-lg text-brand-text-secondary mt-4 max-w-2xl mx-auto">Browse live AMAs, catch up on past events, and see what's coming up next from your favorite hosts.</p>
        <div className="mt-8">
            <Button size="lg" onClick={onCreateAMA}>
                {getCTAText()}
            </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="bg-brand-surface p-4 rounded-lg sticky top-[70px] z-40 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
                <input
                    type="text"
                    placeholder="Search AMAs by title, description, or host..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-secondary rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
            </div>
            <div className="flex items-center space-x-2 bg-brand-bg p-1 rounded-full border border-brand-secondary">
                {(['ALL', AMAType.VIDEO, AMAType.AUDIO] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${typeFilter === type ? 'bg-brand-primary text-white' : 'hover:bg-brand-surface'}`}
                    >
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>
      </section>

      <AMASection title="Live Now" amas={liveAMAs} onSelectAMA={onSelectAMA} onSelectUser={onSelectUser} onNavigateToHighlights={onNavigateToHighlights}/>
      <AMASection title="Upcoming AMAs" amas={upcomingAMAs} onSelectAMA={onSelectAMA} onSelectUser={onSelectUser} onNavigateToHighlights={onNavigateToHighlights}/>
      <AMASection title="Past AMAs" amas={pastAMAs} onSelectAMA={onSelectAMA} onSelectUser={onSelectUser} onNavigateToHighlights={onNavigateToHighlights}/>
    </div>
  );
};

export default LandingPage;
