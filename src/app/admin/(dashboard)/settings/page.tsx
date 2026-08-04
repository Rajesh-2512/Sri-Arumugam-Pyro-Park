import { adminSupabase } from '@/lib/supabase/admin';
import SettingsManager from './SettingsManager';
import type { GlobalSettings } from '@/types/product';

export default async function AdminSettingsPage() {
  const { data: settingsData } = await adminSupabase
    .from('global_settings')
    .select('*')
    .limit(1)
    .single();

  const settings = (settingsData ?? null) as unknown as GlobalSettings | null;

  return <SettingsManager settings={settings} />;
}
