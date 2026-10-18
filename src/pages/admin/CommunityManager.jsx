import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';

const CommunityManager = () => {
  const [comments, setComments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchComments();
    fetchEvents();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    setComments(data || []);
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('id, title');
    setEvents(data || []);
  };

  const handleModerate = async (id) => {
    await supabase.from('comments').update({ is_moderated: true }).eq('id', id);
    fetchComments();
  };

  const handleHide = async (id, hidden) => {
    await supabase.from('comments').update({ hidden }).eq('id', id);
    fetchComments();
  };

  const handleDelete = async (id) => {
    await supabase.from('comments').delete().eq('id', id);
    fetchComments();
  };

  const handleVerify = async (id) => {
    await supabase.from('comments').update({ is_verified: true }).eq('id', id);
    fetchComments();
  };

  const filtered = selectedEvent === 'all' ? comments : comments.filter(c => c.event_id === selectedEvent);

  return (
    <div>
      <div className="bg-warning text-black border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Comments</h1>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="border-2 border-black px-4 py-2 font-bold uppercase text-sm">
          <option value="all">All Events</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <span className="font-bold text-sm">{filtered.length} comments</span>
      </div>

      <div className="space-y-3">
        {filtered.map(comment => (
          <div key={comment.id} className="bg-white border-2 border-black p-4 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-black uppercase">{comment.name}</span>
                <span className="text-gray-500 text-sm font-bold ml-2">{comment.email}</span>
                {comment.is_verified && <span className="bg-success text-white text-xs px-2 py-0.5 border border-black font-bold ml-2">Verified</span>}
                {comment.is_moderated && <span className="bg-primary text-white text-xs px-2 py-0.5 border border-black font-bold ml-2">Moderated</span>}
                {comment.hidden && <span className="bg-danger text-white text-xs px-2 py-0.5 border border-black font-bold ml-2">Hidden</span>}
              </div>
              <div className="flex gap-2">
                {!comment.is_verified && (
                  <button onClick={() => handleVerify(comment.id)} className="text-success font-bold uppercase text-xs">Verify</button>
                )}
                {!comment.is_moderated && (
                  <button onClick={() => handleModerate(comment.id)} className="text-primary font-bold uppercase text-xs">Moderate</button>
                )}
                <button onClick={() => handleHide(comment.id, !comment.hidden)} className="text-warning font-bold uppercase text-xs">{comment.hidden ? 'Unhide' : 'Hide'}</button>
                <button onClick={() => handleDelete(comment.id)} className="text-danger font-bold uppercase text-xs">Delete</button>
              </div>
            </div>
            <p className="text-sm font-bold">{comment.comment}</p>
            {comment.image_url && <img src={comment.image_url} alt="Comment" className="mt-2 max-w-xs border-2 border-black" />}
            <p className="text-xs text-gray-400 font-bold mt-2">{new Date(comment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityManager;
