import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [content, setContent] = useState({
    hero: null,
    about: [],
    domains: [],
    events: [],
    projects: [],
    team: [],
    sponsors: [],
    faqs: [],
    navLinks: [],
    socialLinks: [],
    contact: null,
    settings: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { data: hero },
        { data: about },
        { data: domains },
        { data: events },
        { data: projects },
        { data: team },
        { data: sponsors },
        { data: faqs },
        { data: navLinks },
        { data: socialLinks },
        { data: contact },
        { data: settings },
      ] = await Promise.all([
        supabase.from('hero_content').select('*').eq('section', 'home').single(),
        supabase.from('about_content').select('*').order('sort_order'),
        supabase.from('domains').select('*').order('sort_order'),
        supabase.from('events').select('*').order('year', { ascending: false }).order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('team_members').select('*').order('sort_order'),
        supabase.from('sponsors').select('*').order('sort_order'),
        supabase.from('faqs').select('*').order('sort_order'),
        supabase.from('nav_links').select('*').order('sort_order'),
        supabase.from('social_links').select('*').order('sort_order'),
        supabase.from('contact_info').select('*').single(),
        supabase.from('site_settings').select('*'),
      ]);

      const settingsMap = {};
      (settings || []).forEach(s => { settingsMap[s.key] = s.value; });

      setContent({
        hero: hero || null,
        about: about || [],
        domains: domains || [],
        events: events || [],
        projects: projects || [],
        team: team || [],
        sponsors: sponsors || [],
        faqs: faqs || [],
        navLinks: navLinks || [],
        socialLinks: socialLinks || [],
        contact: contact || null,
        settings: settingsMap,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateContent = useCallback(async (table, id, data) => {
    const { error } = await supabase.from(table).update(data).eq('id', id);
    if (!error) fetchAll();
    return { error };
  }, [fetchAll]);

  const insertContent = useCallback(async (table, data) => {
    const { error } = await supabase.from(table).insert(data);
    if (!error) fetchAll();
    return { error };
  }, [fetchAll]);

  const deleteContent = useCallback(async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchAll();
    return { error };
  }, [fetchAll]);

  return (
    <ContentContext.Provider value={{ content, loading, error, fetchAll, updateContent, insertContent, deleteContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

export default ContentContext;
