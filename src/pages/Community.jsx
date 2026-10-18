import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../lib/supabase';
import { useContent } from '../context/ContentContext';
import { sendOTP } from '../lib/email';
import ImageInput from '../components/ImageInput';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const isValidGmail = (email) => {
  if (!email) return false;
  const value = email.trim().toLowerCase();
  if (!/^[a-z0-9.]+@gmail\.com$/.test(value)) return false;
  const local = value.split('@')[0];
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false;
  if (local.length < 6) return false;
  return true;
};

const Community = () => {
  const { content } = useContent();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});
  const [form, setForm] = useState({ name: '', email: '', comment: '', event_id: '', image_url: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [showCommentBox, setShowCommentBox] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showNameUpdate, setShowNameUpdate] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [posting, setPosting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer > 0]);

  useEffect(() => {
    const savedUser = localStorage.getItem('gdg_community_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (isValidGmail(user.email)) {
        setForm(prev => ({ ...prev, name: user.name, email: user.email }));
        setIsVerified(true);
      } else {
        localStorage.removeItem('gdg_community_user');
      }
    }
    fetchComments();
    fetchLikes();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    setComments((data || []).filter(c => !c.hidden));
  };

  const fetchLikes = async () => {
    const { data } = await supabase.from('comment_likes').select('*');
    const likeMap = {};
    (data || []).forEach(like => {
      if (!likeMap[like.comment_id]) likeMap[like.comment_id] = [];
      likeMap[like.comment_id].push(like.user_email);
    });
    setLikes(likeMap);
  };

  const handleEmailChange = (value) => {
    setForm(prev => ({ ...prev, email: value }));
    if (!value) {
      setEmailError('');
    } else if (!isValidGmail(value)) {
      setEmailError('Only valid Gmail addresses are allowed (e.g. yourname@gmail.com).');
    } else {
      setEmailError('');
    }
  };

  const handleSendOTP = async () => {
    if (!form.email || otpTimer > 0 || sendingOtp) return;
    if (!isValidGmail(form.email)) {
      setEmailError('Only valid Gmail addresses are allowed (e.g. yourname@gmail.com).');
      return;
    }
    setEmailError('');
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    setOtpSent(true);
    setOtpTimer(60);
    setSendingOtp(true);
    try {
      await supabase.from('email_otps').insert({ email: form.email, otp: code, expires_at: expiresAt.toISOString() });
      await sendOTP(form.email, code);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    setVerifying(true);
    try {
      const { data } = await supabase.from('email_otps').select('*').eq('email', form.email).eq('otp', otp).single();
      if (data) {
        await supabase.from('email_otps').update({ verified: true }).eq('id', data.id);
        setIsVerified(true);
        localStorage.setItem('gdg_community_user', JSON.stringify({ name: form.name, email: form.email }));
      } else {
        setEmailError('Incorrect OTP. Try again.');
        setTimeout(() => setEmailError(''), 3000);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gdg_community_user');
    setIsVerified(false);
    setForm(prev => ({ ...prev, name: '', email: '' }));
    setShowNameUpdate(false);
  };

  const handleUpdateName = async () => {
    const name = newName.trim();
    if (!name || updatingName) return;
    setUpdatingName(true);
    const user = JSON.parse(localStorage.getItem('gdg_community_user') || '{}');
    localStorage.setItem('gdg_community_user', JSON.stringify({ ...user, name }));
    setForm(prev => ({ ...prev, name }));
    setComments(prev => prev.map(c => c.email === form.email ? { ...c, name } : c));
    setNameMsg('Name updated!');
    setNewName('');
    setTimeout(() => { setNameMsg(''); setShowNameUpdate(false); }, 1200);
    setUpdatingName(false);
    supabase.from('comments').update({ name }).eq('email', form.email).then(() => fetchComments());
  };

  const handleEditSave = async () => {
    if (!editText.trim() || savingEdit) return;
    const text = editText.trim();
    const id = editingId;
    setSavingEdit(true);
    setComments(prev => prev.map(c => c.id === id ? { ...c, comment: text } : c));
    setEditingId(null);
    setEditText('');
    setSavingEdit(false);
    supabase.from('comments').update({ comment: text }).eq('id', id).then(() => fetchComments());
  };

  const isOwnComment = (comment) => isVerified && comment.email === form.email;

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isVerified || !form.comment || posting) return;
    const optimistic = {
      id: `temp-${Date.now()}`,
      event_id: form.event_id || null,
      name: form.name,
      email: form.email,
      comment: form.comment,
      image_url: form.image_url || null,
      parent_id: null,
      is_verified: true,
      hidden: false,
      created_at: new Date().toISOString(),
    };
    setComments(prev => [optimistic, ...prev]);
    setForm(prev => ({ ...prev, comment: '', image_url: '', event_id: '' }));
    setPosting(true);
    const { error } = await supabase.from('comments').insert([{
      event_id: optimistic.event_id,
      name: optimistic.name,
      email: optimistic.email,
      comment: optimistic.comment,
      image_url: optimistic.image_url,
      parent_id: null,
      is_verified: true,
    }]);
    setPosting(false);
    if (error) console.error(error);
    fetchComments();
  };

  const handleLike = async (commentId) => {
    const userEmail = form.email || 'anonymous';
    const existingLike = likes[commentId]?.includes(userEmail);
    setLikes(prev => {
      const next = { ...prev, [commentId]: [...(prev[commentId] || [])] };
      if (existingLike) next[commentId] = next[commentId].filter(e => e !== userEmail);
      else next[commentId].push(userEmail);
      return next;
    });
    if (existingLike) {
      const { error } = await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_email', userEmail);
      if (error) fetchLikes();
    } else {
      const { error } = await supabase.from('comment_likes').insert({ comment_id: commentId, user_email: userEmail });
      if (error && error.code !== '23505') fetchLikes();
    }
  };

  const handleReply = async (parentId) => {
    const text = replyText[parentId];
    if (!text || replyingId) return;
    if (!isVerified) {
      setShowCommentBox(true);
      setTimeout(() => document.getElementById('comment-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }
    const optimistic = {
      id: `temp-${Date.now()}`,
      event_id: form.event_id || null,
      name: form.name,
      email: form.email,
      comment: text,
      image_url: null,
      parent_id: parentId,
      is_verified: true,
      hidden: false,
      created_at: new Date().toISOString(),
    };
    setComments(prev => [optimistic, ...prev]);
    setReplyText({ ...replyText, [parentId]: '' });
    setReplyingTo(null);
    setReplyingId(parentId);
    const { error } = await supabase.from('comments').insert([{
      event_id: optimistic.event_id,
      name: optimistic.name,
      email: optimistic.email,
      comment: optimistic.comment,
      image_url: null,
      parent_id: parentId,
      is_verified: true,
    }]);
    setReplyingId(null);
    if (error) console.error(error);
    fetchComments();
  };

  const filteredComments = selectedEvent === 'all' ? comments : comments.filter(c => c.event_id === selectedEvent);
  const topLevelComments = filteredComments.filter(c => !c.parent_id);
  const replies = filteredComments.filter(c => c.parent_id);

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-4xl mx-auto px-4 md:px-6">

        <header className="mb-12 text-center bg-white border-4 border-black p-6 md:p-10 shadow-brutal-lg">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <span className="inline-block bg-success text-white px-4 py-1 border-2 border-black font-black uppercase text-xs md:text-sm tracking-widest mb-4 md:mb-6 shadow-brutal-sm">
              Community
            </span>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black mb-4 md:mb-6 uppercase">
              Your <span className="bg-warning px-3 md:px-4 py-1 border-2 md:border-4 border-black inline-block mt-2 -rotate-1 shadow-brutal">Voice.</span>
            </h1>
            <p className="text-base md:text-lg text-black font-bold leading-relaxed max-w-2xl mx-auto bg-surface-dark p-4 border-2 border-black">
              Share feedback, ask questions, and connect with the community.
            </p>
          </motion.div>
        </header>

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="border-2 border-black px-4 py-2 font-bold uppercase text-sm">
            <option value="all">All Events</option>
            {content.events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm shadow-brutal hover:shadow-brutal-sm transition-all"
          >
            {showCommentBox ? 'Hide' : 'Show'} Comment Box
          </button>
        </div>

        <AnimatePresence>
          {showCommentBox && (
            <motion.div
              id="comment-box"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal-lg mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-headline font-black uppercase">Leave a Comment</h2>
                {isVerified && (
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setShowNameUpdate(!showNameUpdate); setNewName(form.name); }} className="text-primary font-bold uppercase text-xs hover:underline">Update Name</button>
                    <button onClick={handleLogout} className="text-danger font-bold uppercase text-xs hover:underline">Logout</button>
                  </div>
                )}
              </div>
              {showNameUpdate && isVerified && (
                <div className="border-2 border-black p-3 mb-4 bg-surface-dark flex gap-2 flex-wrap items-center">
                  <input type="text" placeholder="New display name" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 border-2 border-black px-3 py-2 font-bold text-sm min-w-[200px]" />
                  <button type="button" onClick={handleUpdateName} disabled={updatingName} className="bg-success text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm disabled:opacity-50">{updatingName ? 'Saving...' : 'Save Name'}</button>
                  {nameMsg && <span className="text-success font-bold text-xs uppercase">{nameMsg}</span>}
                </div>
              )}

              {!isVerified ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" required />
                    <div>
                      <input type="text" placeholder="Your Gmail (name@gmail.com)" value={form.email} onChange={e => handleEmailChange(e.target.value)} className={`w-full border-2 px-4 py-3 font-bold ${emailError ? 'border-danger' : 'border-black'}`} required />
                      {emailError && <p className="text-danger text-xs font-bold uppercase mt-1">{emailError}</p>}
                    </div>
                  </div>
                  <select value={form.event_id} onChange={e => setForm({...form, event_id: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold">
                    <option value="">General (No Event)</option>
                    {content.events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                  <textarea placeholder="Your comment or feedback..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-3 font-bold" required />
                  <ImageInput placeholder="Image URL (optional) or upload" value={form.image_url} onChange={v => setForm({...form, image_url: v})} />

                  <div className="border-2 border-black p-4 bg-surface-dark">
                    <p className="font-bold text-sm mb-3 uppercase">Verify your email to comment:</p>
                    <div className="flex gap-2 flex-wrap">
                      <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="flex-1 border-2 border-black px-4 py-2 font-bold" maxLength={6} />
                      <button type="button" onClick={handleSendOTP} disabled={otpTimer > 0 || !form.email || !isValidGmail(form.email) || sendingOtp} className="bg-warning text-black px-4 py-2 border-2 border-black font-bold uppercase disabled:opacity-50">{sendingOtp ? 'Sending...' : otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Send OTP'}</button>
                      <button type="button" onClick={handleVerifyOTP} disabled={verifying || !otpSent} className="bg-success text-white px-4 py-2 border-2 border-black font-bold uppercase disabled:opacity-50">{verifying ? 'Verifying...' : 'Verify'}</button>
                    </div>
                    {otpSent && <p className="text-sm text-gray-600 mt-2 font-bold">Check your email for the OTP code.</p>}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="flex items-center gap-2 text-success font-bold text-sm">
                    <span className="material-symbols-outlined">verified</span>
                    Verified as {form.name}
                  </div>
                  <select value={form.event_id} onChange={e => setForm({...form, event_id: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold">
                    <option value="">General (No Event)</option>
                    {content.events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                  <textarea placeholder="Your comment or feedback..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-3 font-bold" required />
                  <ImageInput placeholder="Image URL (optional) or upload" value={form.image_url} onChange={v => setForm({...form, image_url: v})} />
                  <button type="submit" disabled={posting} className="bg-primary text-white px-8 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all disabled:opacity-50">
                    {posting ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {topLevelComments.map(comment => (
            <motion.div key={comment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-4 border-black shadow-brutal">
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary text-white border-2 border-black flex items-center justify-center font-bold shrink-0">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black uppercase text-sm">{comment.name}</span>
                      {comment.is_verified && <span className="bg-success text-white text-xs px-2 py-0.5 border border-black font-bold">Verified</span>}
                    </div>
                    {editingId === comment.id ? (
                      <div className="mt-1">
                        <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} className="w-full border-2 border-black px-3 py-2 font-bold text-sm" />
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleEditSave} className="bg-success text-white px-3 py-1 border-2 border-black font-bold uppercase text-xs">Save</button>
                          <button onClick={() => { setEditingId(null); setEditText(''); }} className="bg-gray-300 px-3 py-1 border-2 border-black font-bold uppercase text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 font-bold mt-1">{comment.comment}</p>
                    )}
                    {comment.image_url && (
                      <img src={comment.image_url} alt="Comment" className="mt-3 max-w-xs border-2 border-black" />
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-primary">
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                        {likes[comment.id]?.length || 0}
                      </button>
                      <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-sm font-bold text-gray-600 hover:text-primary">Reply</button>
                      {isOwnComment(comment) && editingId !== comment.id && (
                        <button onClick={() => { setEditingId(comment.id); setEditText(comment.comment); }} className="text-sm font-bold text-warning hover:underline uppercase">Edit</button>
                      )}
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText[comment.id] || ''}
                            onChange={e => setReplyText({...replyText, [comment.id]: e.target.value})}
                            className="flex-1 border-2 border-black px-3 py-2 font-bold text-sm"
                          />
                            <button onClick={() => handleReply(comment.id)} disabled={!!replyingId} className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm disabled:opacity-50">{replyingId === comment.id ? 'Posting...' : 'Reply'}</button>
                          </div>
                          {!isVerified && (
                            <p className="text-xs font-bold text-danger uppercase mt-2">Verify your email in the comment box to post this reply.</p>
                          )}
                        </div>
                      )}

                    {replies.filter(r => r.parent_id === comment.id).map(reply => (
                      <div key={reply.id} className="mt-3 ml-4 border-l-4 border-primary pl-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black uppercase text-xs">{reply.name}</span>
                          {reply.is_verified && <span className="bg-success text-white text-xs px-1 border border-black font-bold">Verified</span>}
                        </div>
                        {editingId === reply.id ? (
                          <div className="mt-1">
                            <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} className="w-full border-2 border-black px-3 py-2 font-bold text-sm" />
                            <div className="flex gap-2 mt-2">
                              <button onClick={handleEditSave} className="bg-success text-white px-3 py-1 border-2 border-black font-bold uppercase text-xs">Save</button>
                              <button onClick={() => { setEditingId(null); setEditText(''); }} className="bg-gray-300 px-3 py-1 border-2 border-black font-bold uppercase text-xs">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 font-bold">{reply.comment}</p>
                        )}
                        {reply.image_url && <img src={reply.image_url} alt="Reply" className="mt-2 max-w-xs border-2 border-black" />}
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => handleLike(reply.id)} className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-primary">
                            <span className="material-symbols-outlined text-xs">thumb_up</span>
                            {likes[reply.id]?.length || 0}
                          </button>
                          {isOwnComment(reply) && editingId !== reply.id && (
                            <button onClick={() => { setEditingId(reply.id); setEditText(reply.comment); }} className="text-xs font-bold text-warning hover:underline uppercase">Edit</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Community;
