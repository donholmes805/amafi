
import React, { useState } from 'react';
import { AMA } from '../types';
import Button from './Button';
import { ICONS } from '../constants';
import { formatAMADate } from '../utils/time';

interface CalendarPageProps {
  amas: AMA[];
  onSelectAMA: (ama: AMA) => void;
  onExit: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ amas, onSelectAMA, onExit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    // Blank days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="border border-brand-surface"></div>);
    }
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

      const amasOnThisDay = amas.filter(ama => {
        const amaDate = new Date(ama.startTime);
        return amaDate.getFullYear() === year && amaDate.getMonth() === month && amaDate.getDate() === day;
      }).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

      days.push(
        <div key={day} className={`border border-brand-secondary/50 p-2 flex flex-col min-h-[120px] ${isToday ? 'bg-brand-secondary/30' : ''}`}>
          <div className={`font-bold ${isToday ? 'text-brand-primary' : ''}`}>{day}</div>
          <div className="mt-1 space-y-1 overflow-y-auto">
            {amasOnThisDay.map(ama => (
              <div 
                key={ama.id}
                onClick={() => onSelectAMA(ama)}
                className="bg-brand-secondary text-white text-xs p-1.5 rounded-md cursor-pointer hover:bg-brand-primary transition-colors truncate"
                title={`${ama.title} at ${formatAMADate(ama.startTime)}`}
              >
                {ama.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={onExit} variant="ghost">
          {ICONS.ARROW_LEFT}
          <span>Back to Home</span>
        </Button>
      </div>
      <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => changeMonth(-1)}>&lt; Prev</Button>
          <h2 className="text-2xl md:text-4xl font-bold text-brand-primary">{monthName} {year}</h2>
          <Button onClick={() => changeMonth(1)}>Next &gt;</Button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-brand-secondary/50">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-bold p-2 bg-brand-surface text-brand-text-secondary">{day}</div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
