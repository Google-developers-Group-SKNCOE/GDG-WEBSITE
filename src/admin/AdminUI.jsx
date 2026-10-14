// ── Shared Admin UI primitives ────────────────────────────────────────────────

export const AdminHeader = ({ icon, title, color = 'bg-primary', action }) => (
  <div className="flex items-center justify-between mb-10 pb-6 border-b-4 border-black/10">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} border-2 border-black flex items-center justify-center shadow-brutal-sm`}>
        <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
      </div>
      <h2 className="font-headline font-black text-black text-3xl md:text-4xl uppercase tracking-tight">{title}</h2>
    </div>
    {action}
  </div>
)

export const AdminBtn = ({ onClick, color = 'bg-primary', icon, children, type = 'button', disabled = false, small = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 ${small ? 'px-3 py-1.5 text-[10px]' : 'px-5 py-2.5 text-xs'} ${color} text-white font-black uppercase tracking-widest border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    {icon && <span className={`material-symbols-outlined ${small ? 'text-sm' : 'text-base'}`}>{icon}</span>}
    {children}
  </button>
)

export const AdminInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-black/60">{label}</label>}
    <input
      {...props}
      className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/25"
    />
  </div>
)

export const AdminSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-black/60">{label}</label>}
    <select
      {...props}
      className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
)

export const AdminTextarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-black/60">{label}</label>}
    <textarea
      {...props}
      className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all resize-none placeholder:text-black/25"
    />
  </div>
)

export const StatusBadge = ({ ok, okText = 'Saved', errText = 'Error' }) => ok === null ? null : (
  <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase border-2 border-black ${ok ? 'bg-success text-white' : 'bg-danger text-white'}`}>
    <span className="material-symbols-outlined text-sm">{ok ? 'check_circle' : 'error'}</span>
    {ok ? okText : errText}
  </span>
)

export const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-10 h-10 border-4 border-black border-t-primary animate-spin" />
  </div>
)

export const EmptyState = ({ icon, text }) => (
  <div className="bg-white border-4 border-black p-16 text-center shadow-brutal">
    <span className="material-symbols-outlined text-5xl text-black/20 mb-3 block">{icon}</span>
    <p className="font-black uppercase text-black/30 text-sm">{text}</p>
  </div>
)

// Image upload widget
import { useState } from 'react'
import { uploadImage } from '../lib/db'

export const ImageUpload = ({ label = 'Image', value, onChange }) => {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setErr('')
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (ex) {
      setErr(ex.message)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-black/60">{label}</label>}
      <div className="flex gap-3 items-center">
        <label className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-xs font-black uppercase shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
          <span className="material-symbols-outlined text-sm">{uploading ? 'hourglass_empty' : 'upload'}</span>
          {uploading ? 'Uploading...' : 'Choose File'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
        {value && (
          <img src={value} alt="preview" className="w-16 h-16 object-cover border-2 border-black" />
        )}
      </div>
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste a URL"
          className="w-full border-2 border-black px-3 py-2 text-xs font-bold text-black bg-white focus:outline-none focus:border-primary transition-all"
        />
      )}
      {!value && (
        <input
          type="text"
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste an image URL"
          className="w-full border-2 border-black px-3 py-2 text-xs font-bold text-black bg-white focus:outline-none focus:border-primary transition-all"
        />
      )}
      {err && <p className="text-danger text-[10px] font-black">{err}</p>}
    </div>
  )
}
