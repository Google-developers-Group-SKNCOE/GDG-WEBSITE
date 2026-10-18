const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

export async function uploadToImgbb(file) {
  if (!IMGBB_KEY) {
    throw new Error('ImgBB API key missing — set VITE_IMGBB_API_KEY in .env');
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
  const base64 = dataUrl.split(',')[1];
  const formData = new FormData();
  formData.append('image', base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data?.display_url) {
    throw new Error(json?.error?.message || 'Image upload failed');
  }
  return json.data.display_url;
}
