import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import ImageInput from '../../components/ImageInput';

export default function ProjectsManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [tagsInput, setTagsInput] = useState('');

  const startNew = () => {
    setEditing('new');
    setForm({ title: '', description: '', badge: '', image_url: '', demo_url: '', featured: false, sort_order: content.projects.length + 1 });
    setTagsInput('');
  };

  const startEdit = (project) => {
    setEditing(project.id);
    setForm({ ...project });
    setTagsInput((project.tags || []).join(', '));
  };

  const handleSave = async () => {
    const data = { ...form, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
    if (editing === 'new') {
      await insertContent('projects', data);
    } else {
      await updateContent('projects', editing, data);
    }
    setEditing(null);
    setForm({});
    setTagsInput('');
  };

  return (
    <div>
      <div className="bg-primary text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Projects</h1>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.projects.map(project => (
          <div key={project.id} className="bg-white border-2 border-black p-4 shadow-brutal">
            {project.featured && <span className="bg-warning text-black text-xs px-2 py-1 border border-black mb-2 inline-block font-bold uppercase">Featured</span>}
            <h3 className="font-black uppercase">{project.title}</h3>
            <p className="text-sm text-gray-600 font-bold mt-1">{project.description?.substring(0, 80)}...</p>
            <div className="flex gap-1 mt-2 flex-wrap">
              {(project.tags || []).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-xs px-2 py-1 border border-black font-bold">{tag}</span>
              ))}
            </div>
            <div className="flex gap-3 mt-3">
              <button onClick={() => startEdit(project)} className="text-primary font-bold uppercase text-sm">Edit</button>
              <button onClick={() => deleteContent('projects', project.id)} className="text-danger font-bold uppercase text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Project' : 'Edit Project'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <textarea placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="Badge" value={form.badge || ''} onChange={e => setForm({...form, badge: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <ImageInput label="Image" placeholder="Image URL or upload" value={form.image_url || ''} onChange={v => setForm({...form, image_url: v})} />
              <input type="text" placeholder="Demo URL" value={form.demo_url || ''} onChange={e => setForm({...form, demo_url: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <label className="flex items-center gap-2 font-bold">
                <input type="checkbox" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} />
                Featured
              </label>
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
