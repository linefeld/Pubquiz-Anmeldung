import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

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

    const id = crypto.randomUUID();
    const timestamp = Date.now();

    const group = {
      id,
      members,
      mannschaft,
      timestamp,
    };

    // Store the group with key pattern: group:{id}
    await kv.set(`group:${id}`, group);

    return c.json({ success: true, group });
  } catch (error) {
    console.log('Error saving group registration:', error);
    return c.json({ error: 'Failed to save group registration', details: error.message }, 500);
  }
});

// Get all group registrations
app.get('/make-server-aa1c64f0/groups', async (c) => {
  try {
    const groups = await kv.getByPrefix('group:');
    
    // Sort by timestamp (most recent first)
    const sortedGroups = groups.sort((a, b) => b.timestamp - a.timestamp);
    
    return c.json({ groups: sortedGroups });
  } catch (error) {
    console.log('Error fetching groups:', error);
    return c.json({ error: 'Failed to fetch groups', details: error.message }, 500);
  }
});

// Delete a group (for admin purposes)
app.delete('/make-server-aa1c64f0/groups/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`group:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting group:', error);
    return c.json({ error: 'Failed to delete group', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);
