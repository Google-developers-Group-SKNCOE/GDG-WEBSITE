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
import { useState, useEffect } from 'react'
import { uploadImage, convertGoogleDriveUrl } from '../lib/db'

export const ImageUpload = ({ label = 'Image', value, onChange }) => {
  const [urlInput, setUrlInput] = useState(value || '')
  const [isDrive, setIsDrive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    setUrlInput(value || '')
    const isGdrive = value && (value.includes('googleusercontent.com') || value.includes('drive.google.com'))
    setIsDrive(Boolean(isGdrive))
  }, [value])

  const handleUrlChange = (e) => {
    const raw = e.target.value
    setUrlInput(raw)
    const converted = convertGoogleDriveUrl(raw)
    const wasDrive = raw.includes('drive.google.com') || converted.includes('googleusercontent.com')
    setIsDrive(Boolean(wasDrive))
    onChange(converted)
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setErr('')
    try {
      const url = await uploadImage(file)
      setUrlInput(url)
      setIsDrive(false)
      onChange(url)
    } catch (ex) {
      setErr(ex.message)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-[10px] font-black uppercase tracking-widest text-black/70">{label}</label>}
        <span className="text-[9px] font-black uppercase text-success bg-success/10 px-2 py-0.5 border border-success/30 flex items-center gap-1">
          <span className="material-symbols-outlined !text-xs">cloud_done</span>
          Google Drive (0 MB Supabase Storage)
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="Paste Google Drive link (e.g. drive.google.com/file/d/...)"
          className="w-full border-2 border-black px-3 py-2.5 text-xs font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/35 pr-10"
        />
        {urlInput && (
          <button
            type="button"
            onClick={() => { setUrlInput(''); setIsDrive(false); onChange('') }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-danger text-sm font-black p-1"
            title="Clear image"
          >
            ✕
          </button>
        )}
      </div>

      {isDrive && (
        <div className="text-[10px] font-black uppercase text-success flex items-center gap-1">
          <span className="material-symbols-outlined !text-sm">check_circle</span>
          Google Drive link auto-converted to direct live image
        </div>
      )}

      {/* Quick local file option */}
      <div className="flex items-center justify-between text-[10px] text-black/50 font-bold">
        <span>👉 On Drive: Right-click image → <b>Share: Anyone with the link</b> → Paste above</span>
        <label className="text-black/60 hover:text-black hover:underline cursor-pointer flex items-center gap-1 uppercase font-black text-[9px]">
          <span className="material-symbols-outlined !text-xs">upload</span>
          {uploading ? 'Processing...' : 'or pick local file'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>

      {err && <p className="text-danger text-[10px] font-black">{err}</p>}

      {/* Live Preview */}
      {value && (
        <div className="mt-1 flex items-center gap-3 p-2.5 bg-surface-dark border-2 border-black">
          <div className="w-14 h-14 bg-white border-2 border-black overflow-hidden shrink-0 shadow-brutal-sm">
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const match = value.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)
                if (match && match[1]) {
                  e.target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase text-black">Live Image Preview</p>
            <p className="text-[9px] text-black/50 font-mono truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  )
}
