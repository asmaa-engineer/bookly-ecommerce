import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmyhsrttuwrrjuxxglca.supabase.co';
const supabaseAnonKey = 'sb_publishable_DPAsJOYw2jlT8GmJYxsVWA_5P_54HHr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);