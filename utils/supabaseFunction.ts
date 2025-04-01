import { supabase } from "../utils/supabase";

export const userCreate = async (id: string | undefined, name: string | null, icon: string | null) => {
  if (!id) return;
  await supabase
    .from('users')
    .upsert({ 
      clerk_user_id: id,
      name: name,
      icon: icon,
      created_at: new Date().toISOString(),
    })
    .single();
};