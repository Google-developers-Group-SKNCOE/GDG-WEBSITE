import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function FaqsManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startNew = () => {
    setEditing('new');
    setForm({ question: '', answer: '', sort_order: content.faqs.length + 1 });
  };

  const startEdit = (faq) => {
    setEditing(faq.id);
    setForm({ ...faq });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('faqs', form);
    } else {
      await updateContent('faqs', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-warning text-black border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">FAQs</h1>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="space-y-3">
        {content.faqs.map(faq => (
          <div key={faq.id} className="bg-white border-2 border-black p-4 shadow-brutal">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black uppercase">{faq.question}</h3>
                <p className="text-sm text-gray-600 font-bold mt-1">{faq.answer}</p>
              </div>
              <div className="flex gap-3 ml-4">
                <button onClick={() => startEdit(faq)} className="text-primary font-bold uppercase text-sm">Edit</button>
                <button onClick={() => deleteContent('faqs', faq.id)} className="text-danger font-bold uppercase text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add FAQ' : 'Edit FAQ'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Question" value={form.question || ''} onChange={e => setForm({...form, question: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <textarea placeholder="Answer" value={form.answer || ''} onChange={e => setForm({...form, answer: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="bg-primary text-white px-6 py-2 border-2 border-black font-bold uppercase">Save</button>
                <button onClick={() => setEditing(null)} className="bg-gray-300 px-6 py-2 border-2 border-black font-bold uppercase">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
