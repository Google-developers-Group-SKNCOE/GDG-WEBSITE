import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const typeIcons = {
  photos: 'photo_library',
  videos: 'play_circle',
  ppt: 'slideshow',
  link: 'link',
  document: 'description',
  github: 'code',
  other: 'insert_drive_file',
};

const Resources = () => {
  const { content } = useContent();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const allResources = content.events.map(event => ({
    ...event,
    resources: [],
  }));

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 md:px-6">

        <header className="mb-12 md:mb-20 text-center bg-white border-4 border-black p-6 md:p-10 shadow-brutal-lg relative overflow-hidden">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
            <span className="inline-block bg-warning text-black px-4 py-1 border-2 border-black font-black uppercase text-xs md:text-sm tracking-widest mb-4 md:mb-6 shadow-brutal-sm">
              Resources
            </span>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black mb-4 md:mb-6 uppercase">
              Event <span className="bg-primary px-3 md:px-4 py-1 border-2 md:border-4 border-black inline-block mt-2 -rotate-1 shadow-brutal text-white">Materials.</span>
            </h1>
            <p className="text-base md:text-lg text-black font-bold leading-relaxed max-w-2xl mx-auto bg-surface-dark p-4 border-2 border-black">
              Access photos, videos, presentations, and resources from our events.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allResources.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-primary text-white border-2 border-black flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-black text-black uppercase tracking-tight text-sm truncate">{event.title}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase">{formatDate(event.date)}</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-gray-100 border border-black text-xs font-bold uppercase">{event.type}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedEvent && (
          <div className="mt-8 bg-white border-4 border-black p-6 md:p-8 shadow-brutal-lg">
            <h2 className="text-2xl font-headline font-black uppercase tracking-tight mb-4">{selectedEvent.title}</h2>
            <p className="text-gray-600 font-bold mb-6">{formatDate(selectedEvent.date)} | {selectedEvent.type}</p>
            <div className="text-center py-12 bg-surface-dark border-2 border-black">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block">inventory_2</span>
              <p className="font-bold text-gray-500">No resources added yet for this event.</p>
              <p className="text-sm text-gray-400 font-bold mt-1">Admin can add resources from the admin panel.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Resources;
