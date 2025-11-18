import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

// Save a new group registration
app.post('/make-server-aa1c64f0/groups', async (c) => {
  try {
    const body = await c.req.json();
    const { members, mannschaft } = body;

    if (!members || !Array.isArray(members) || members.length < 2 || members.length > 3) {
      return c.json({ error: 'Invalid members array. Must have 2-3 members.' }, 400);
    }

    if (!mannschaft || typeof mannschaft !== 'string') {
      return c.json({ error: 'Mannschaft is required.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Insert into structured table
    const { data, error } = await supabase
      .from('pubquiz_registrations')
      .insert({
        member1: members[0],
        member2: members[1],
        member3: members[2] || null,
        mannschaft,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Return in the format expected by the frontend
    const group = {
      id: data.id,
      members,
      mannschaft,
      timestamp: new Date(data.created_at).getTime(),
    };

    return c.json({ success: true, group });
  } catch (error) {
    console.log('Error saving group registration:', error);
    return c.json({ error: 'Failed to save group registration', details: error.message }, 500);
  }
});

// Get all group registrations
app.get('/make-server-aa1c64f0/groups', async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('pubquiz_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Transform to frontend format
    const groups = data.map(row => ({
      id: row.id,
      members: [row.member1, row.member2, row.member3].filter(m => m !== null),
      mannschaft: row.mannschaft,
      timestamp: new Date(row.created_at).getTime(),
    }));
    
    return c.json({ groups });
  } catch (error) {
    console.log('Error fetching groups:', error);
    return c.json({ error: 'Failed to fetch groups', details: error.message }, 500);
  }
});

// Delete a group (for admin purposes)
app.delete('/make-server-aa1c64f0/groups/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('pubquiz_registrations')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting group:', error);
    return c.json({ error: 'Failed to delete group', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
