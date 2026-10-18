import { useRef, useState } from 'react';
import { uploadToImgbb } from '../lib/imgbb';

const ImageInput = ({ value, onChange, placeholder = 'Image URL', label, className = '' }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 32 * 1024 * 1024) {
      setError('Image must be under 32 MB');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadToImgbb(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold text-black mb-1 uppercase">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 border-2 border-black px-4 py-2 font-bold min-w-0"
        />
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error && <p className="text-danger text-xs font-bold uppercase mt-1">{error}</p>}
      {value && /^https?:\/\//.test(value) && (
        <img
          src={value}
          alt="preview"
          className="mt-2 h-20 object-contain border-2 border-black bg-white p-1"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      )}
    </div>
  );
};

export default ImageInput;
