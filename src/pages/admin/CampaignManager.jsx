import { useState, useEffect, useRef } from 'react';
import supabase from '../../lib/supabase';
import { sendCampaignEmail } from '../../lib/email';

const personalize = (text, recipient) =>
  (text || '')
    .replaceAll('{{name}}', recipient.name || 'there')
    .replaceAll('{{email}}', recipient.email || '');

const bodyToHtml = (body) => {
  if (!body) return '<p></p>';
  if (body.includes('<')) return body;
  const paragraphs = body.split(/\n{2,}/).map(p => `<p style="margin:0 0 12px;">${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;">${paragraphs}</div>`;
};

const CampaignManager = () => {
  const [tab, setTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [commenters, setCommenters] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showSend, setShowSend] = useState(false);
  const [sendSettings, setSendSettings] = useState({ source: 'all', limit: 'all', delay: 500 });
  const [progress, setProgress] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [testMsg, setTestMsg] = useState('');
  const [previewName, setPreviewName] = useState('Aarav');
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [contactMsg, setContactMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    fetchCampaigns();
    fetchContacts();
    fetchCommenters();
  }, []);

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*').order('updated_at', { ascending: false });
    setCampaigns(data || []);
  };

  const fetchContacts = async () => {
    const { data } = await supabase.from('campaign_contacts').select('*').order('created_at', { ascending: false });
    setContacts(data || []);
  };

  const fetchCommenters = async () => {
    const { data } = await supabase.from('comments').select('name, email');
    const map = {};
    (data || []).forEach(c => { if (c.email && !map[c.email]) map[c.email] = { name: c.name, email: c.email }; });
    setCommenters(Object.values(map));
  };

  const allRecipients = () => {
    const map = {};
    if (sendSettings.source === 'all' || sendSettings.source === 'commenters') {
      commenters.forEach(c => { map[c.email.toLowerCase()] = c; });
    }
    if (sendSettings.source === 'all' || sendSettings.source === 'contacts') {
      contacts.forEach(c => { map[c.email.toLowerCase()] = { name: c.name, email: c.email }; });
    }
    return Object.values(map);
  };

  const handleNew = () => {
    setEditing({ id: null, name: '', subject: '', body: '', status: 'draft' });
    setShowSend(false);
    setProgress(null);
  };

  const handleEdit = (campaign) => {
    setEditing({ ...campaign });
    setShowSend(false);
    setProgress(null);
  };

  const handleSaveDraft = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { name: editing.name || 'Untitled Campaign', subject: editing.subject, body: editing.body, status: editing.status === 'sent' ? 'sent' : 'draft', updated_at: new Date().toISOString() };
    if (editing.id) {
      await supabase.from('campaigns').update(payload).eq('id', editing.id);
    } else {
      const { data } = await supabase.from('campaigns').insert(payload).select().single();
      setEditing(prev => ({ ...prev, id: data?.id }));
    }
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
    fetchCampaigns();
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    fetchCampaigns();
  };

  const handleSendTest = async () => {
    if (!testEmail || !editing || sendingTest) return;
    setSendingTest(true);
    setTestMsg('Sending...');
    const recipient = { name: 'Tester', email: testEmail };
    const ok = await sendCampaignEmail({
      to: testEmail,
      subject: personalize(editing.subject, recipient),
      html: bodyToHtml(personalize(editing.body, recipient)),
    });
    setSendingTest(false);
    setTestMsg(ok ? 'Test email sent!' : 'Failed to send test email.');
    setTimeout(() => setTestMsg(''), 3000);
  };

  const handleStartSend = async () => {
    if (!editing) return;
    await handleSaveDraft();
    let recipients = allRecipients();
    if (sendSettings.limit !== 'all') {
      recipients = recipients.slice(0, Number(sendSettings.limit));
    }
    stopRef.current = false;
    setProgress({ sent: 0, total: recipients.length, errors: 0 });
    let sent = 0;
    let errors = 0;
    for (let i = 0; i < recipients.length; i++) {
      if (stopRef.current) break;
      const r = recipients[i];
      const ok = await sendCampaignEmail({
        to: r.email,
        subject: personalize(editing.subject, r),
        html: bodyToHtml(personalize(editing.body, r)),
      });
      if (ok) sent += 1; else errors += 1;
      setProgress({ sent: i + 1, total: recipients.length, errors });
      if (i < recipients.length - 1) {
        await new Promise(res => setTimeout(res, Number(sendSettings.delay)));
      }
    }
    await supabase.from('campaigns').update({ status: 'sent', sent_count: sent, last_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', editing.id);
    fetchCampaigns();
    setProgress(p => ({ ...p, done: true }));
  };

  const handleAddContact = async () => {
    const email = newContact.email.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    const { error } = await supabase.from('campaign_contacts').insert({ name: newContact.name.trim(), email });
    if (error && error.code !== '23505') {
      setContactMsg('Error adding contact.');
    } else {
      setContactMsg('Contact added!');
      setNewContact({ name: '', email: '' });
    }
    fetchContacts();
    setTimeout(() => setContactMsg(''), 2500);
  };

  const handleDeleteContact = async (id) => {
    await supabase.from('campaign_contacts').delete().eq('id', id);
    fetchContacts();
  };

  const mergedPeople = [
    ...commenters.map(c => ({ ...c, source: 'Commenter', manual: false })),
    ...contacts.filter(ct => !commenters.some(cm => cm.email.toLowerCase() === ct.email.toLowerCase()))
      .map(ct => ({ name: ct.name, email: ct.email, source: 'Added', manual: true, id: ct.id })),
  ];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div>
      <div className="bg-warning text-black border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Campaigns</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('campaigns')} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${tab === 'campaigns' ? 'bg-primary text-white' : 'bg-white'}`}>Campaigns</button>
        <button onClick={() => setTab('contacts')} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${tab === 'contacts' ? 'bg-primary text-white' : 'bg-white'}`}>Contacts ({mergedPeople.length})</button>
      </div>

      {tab === 'campaigns' && !editing && (
        <div>
          <button onClick={handleNew} className="bg-success text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm mb-4 shadow-brutal-sm">+ New Campaign</button>
          <div className="space-y-3">
            {campaigns.length === 0 && <p className="font-bold text-gray-500">No campaigns yet. Create one!</p>}
            {campaigns.map(c => (
              <div key={c.id} className="bg-white border-2 border-black p-4 shadow-brutal flex justify-between items-start flex-wrap gap-3">
                <div>
                  <span className="font-black uppercase">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 border border-black font-bold ml-2 ${c.status === 'sent' ? 'bg-success text-white' : 'bg-gray-200'}`}>{c.status}</span>
                  <p className="text-sm font-bold text-gray-600 mt-1">Subject: {c.subject || '(no subject)'}</p>
                  <p className="text-xs text-gray-400 font-bold mt-1">Updated {formatDate(c.updated_at)}{c.status === 'sent' ? ` · Sent to ${c.sent_count}` : ''}{c.last_sent_at ? ` · Last send ${formatDate(c.last_sent_at)}` : ''}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(c)} className="text-primary font-bold uppercase text-xs">Edit</button>
                  <button onClick={() => handleDeleteCampaign(c.id)} className="text-danger font-bold uppercase text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'campaigns' && editing && (
        <div className="bg-white border-2 border-black p-4 md:p-6 shadow-brutal space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline font-black uppercase text-xl">{editing.id ? 'Edit Campaign' : 'New Campaign'}</h2>
            <button onClick={() => { setEditing(null); setShowSend(false); setProgress(null); }} className="text-danger font-bold uppercase text-xs">← Back to list</button>
          </div>

          <input type="text" placeholder="Campaign name (internal)" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full border-2 border-black px-4 py-3 font-bold" />
          <input type="text" placeholder="Email subject (use {{name}} to personalise)" value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} className="w-full border-2 border-black px-4 py-3 font-bold" />
          <textarea placeholder={'Email body...\n\nUse {{name}} to insert the recipient name and {{email}} for their email.\nLeave a blank line between paragraphs. HTML is also supported.'} value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} rows={10} className="w-full border-2 border-black px-4 py-3 font-bold" />

          <div className="border-2 border-black p-4 bg-surface-dark space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold uppercase text-xs">Preview as:</span>
              <input type="text" value={previewName} onChange={e => setPreviewName(e.target.value)} className="border-2 border-black px-3 py-1 font-bold text-sm w-40" />
            </div>
            <div className="bg-white border-2 border-black p-3">
              <p className="font-black uppercase text-sm border-b-2 border-black pb-2 mb-2">Subject: {personalize(editing.subject, { name: previewName, email: 'preview@gmail.com' }) || '(no subject)'}</p>
              <div className="text-sm font-bold whitespace-pre-wrap">{personalize(editing.body, { name: previewName, email: 'preview@gmail.com' }) || '(empty body)'}</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSaveDraft} disabled={saving} className="bg-warning text-black px-6 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal-sm disabled:opacity-50">{saving ? 'Saving...' : savedFlash ? 'Saved!' : 'Save Draft'}</button>
            {!showSend && <button onClick={() => setShowSend(true)} className="bg-success text-white px-6 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal-sm">Send...</button>}
          </div>

          {showSend && (
            <div className="border-2 border-black p-4 bg-surface-dark space-y-4">
              <h3 className="font-headline font-black uppercase">Send Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Recipients</label>
                  <select value={sendSettings.source} onChange={e => setSendSettings({ ...sendSettings, source: e.target.value })} className="w-full border-2 border-black px-3 py-2 font-bold bg-white">
                    <option value="all">Everyone ({commenters.length + contacts.length})</option>
                    <option value="commenters">Commenters only ({commenters.length})</option>
                    <option value="contacts">Added contacts only ({contacts.length})</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-xs mb-1">How many to send</label>
                  <select value={sendSettings.limit} onChange={e => setSendSettings({ ...sendSettings, limit: e.target.value })} className="w-full border-2 border-black px-3 py-2 font-bold bg-white">
                    <option value="all">All ({allRecipients().length})</option>
                    <option value="10">First 10</option>
                    <option value="25">First 25</option>
                    <option value="50">First 50</option>
                    <option value="100">First 100</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Delay between emails</label>
                  <select value={sendSettings.delay} onChange={e => setSendSettings({ ...sendSettings, delay: e.target.value })} className="w-full border-2 border-black px-3 py-2 font-bold bg-white">
                    <option value="250">250 ms (fast)</option>
                    <option value="500">500 ms</option>
                    <option value="1000">1 second (safe)</option>
                    <option value="2000">2 seconds (safest)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <input type="email" placeholder="Test email address" value={testEmail} onChange={e => setTestEmail(e.target.value)} className="border-2 border-black px-3 py-2 font-bold text-sm flex-1 min-w-[200px]" />
                <button type="button" onClick={handleSendTest} disabled={sendingTest} className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm disabled:opacity-50">{sendingTest ? 'Sending...' : 'Send Test'}</button>
                {testMsg && <span className="text-success font-bold text-xs uppercase">{testMsg}</span>}
              </div>

              {progress ? (
                <div className="space-y-2">
                  <div className="w-full bg-white border-2 border-black h-6">
                    <div className="bg-success h-full transition-all" style={{ width: `${progress.total ? (progress.sent / progress.total) * 100 : 0}%` }} />
                  </div>
                  <p className="font-bold text-sm uppercase">
                    {progress.done ? `Done! Sent ${progress.sent - progress.errors} of ${progress.total}${progress.errors ? `, ${progress.errors} failed` : ''}` : `Sending... ${progress.sent}/${progress.total} (${progress.errors} failed)`}
                  </p>
                  {!progress.done && (
                    <button onClick={() => { stopRef.current = true; }} className="bg-danger text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm">Stop</button>
                  )}
                </div>
              ) : (
                <button onClick={handleStartSend} className="bg-success text-white px-6 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal-sm">
                  Send Campaign to {allRecipients().slice(0, sendSettings.limit === 'all' ? undefined : Number(sendSettings.limit)).length} recipient(s)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-black p-4 shadow-brutal">
            <h3 className="font-headline font-black uppercase mb-3">Add Contact</h3>
            <div className="flex gap-2 flex-wrap items-center">
              <input type="text" placeholder="Name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="border-2 border-black px-3 py-2 font-bold text-sm flex-1 min-w-[150px]" />
              <input type="email" placeholder="Email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="border-2 border-black px-3 py-2 font-bold text-sm flex-1 min-w-[200px]" />
              <button onClick={handleAddContact} className="bg-success text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm">Add</button>
              {contactMsg && <span className="text-success font-bold text-xs uppercase">{contactMsg}</span>}
            </div>
          </div>
          <p className="font-bold text-sm">{mergedPeople.length} people · {commenters.length} from comments, {contacts.filter(ct => !commenters.some(cm => cm.email.toLowerCase() === ct.email.toLowerCase())).length} added manually</p>
          <div className="bg-white border-2 border-black divide-y-2 divide-black">
            {mergedPeople.map((p, i) => (
              <div key={`${p.email}-${i}`} className="p-3 flex justify-between items-center gap-3 flex-wrap">
                <div>
                  <span className="font-black uppercase text-sm">{p.name || '(no name)'}</span>
                  <span className="text-gray-500 font-bold text-sm ml-2">{p.email}</span>
                  <span className={`text-xs px-2 py-0.5 border border-black font-bold ml-2 ${p.source === 'Commenter' ? 'bg-primary text-white' : 'bg-warning text-black'}`}>{p.source}</span>
                </div>
                {p.manual && (
                  <button onClick={() => handleDeleteContact(p.id)} className="text-danger font-bold uppercase text-xs">Remove</button>
                )}
              </div>
            ))}
            {mergedPeople.length === 0 && <p className="p-4 font-bold text-gray-500">No contacts yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;
