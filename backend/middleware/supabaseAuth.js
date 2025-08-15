// src/middleware/supabaseAuth.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function requireUser(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // 1. Get the authenticated user from the token
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

    const user = data.user;
    req.user = user; // includes id, email, metadata

    // 2. Check if user exists in public.users
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking user table:', fetchError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // 3. If not found, insert the user into public.users
    if (!existingUser) {
      const name = user.user_metadata?.name || user.email.split('@')[0];
      const role = user.user_metadata?.role || 'buyer';

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name,
          role
        });

      if (insertError) {
        console.error('Error inserting into users table:', insertError);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    next();
  } catch (e) {
    console.error('Auth error', e);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
