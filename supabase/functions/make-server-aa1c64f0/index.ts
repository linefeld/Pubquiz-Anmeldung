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

// Save a new person registration
app.post('/make-server-aa1c64f0/groups', async (c) => {
  try {
    const body = await c.req.json();
    const { name, mannschaft } = body;

    if (!name || typeof name !== 'string') {
      return c.json({ error: 'Name is required.' }, 400);
    }

    if (!mannschaft || typeof mannschaft !== 'string') {
      return c.json({ error: 'Mannschaft is required.' }, 400);
    }

    const supabase = getSupabaseClient();

    // Insert into structured table
    const { data, error } = await supabase
      .from('pubquiz_registrations')
      .insert({
        name,
        mannschaft,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Return in the format expected by the frontend
    const person = {
      id: data.id,
      name,
      mannschaft,
      timestamp: new Date(data.created_at).getTime(),
    };

    return c.json({ success: true, person });
  } catch (error) {
    console.log('Error saving person registration:', error);
    return c.json({ error: 'Failed to save person registration', details: error.message }, 500);
  }
});

// Get all person registrations
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
    const persons = data.map(row => ({
      id: row.id,
      name: row.name,
      mannschaft: row.mannschaft,
      timestamp: new Date(row.created_at).getTime(),
    }));
    
    return c.json({ persons });
  } catch (error) {
    console.log('Error fetching persons:', error);
    return c.json({ error: 'Failed to fetch persons', details: error.message }, 500);
  }
});

// Delete a person (for admin purposes)
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
    console.log('Error deleting person:', error);
    return c.json({ error: 'Failed to delete person', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);

