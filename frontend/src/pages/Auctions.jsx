import { useEffect, useState } from 'react';
import API from '../lib/api';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Auctions(){
  const [list,setList]=useState([]);
  const [form,setForm]=useState({ title:'', description:'', start_price:10, bid_increment:1, start_time:'', end_time:'' });

  async function load(){ const res = await API.get('/auctions'); setList(res.data); }
  async function create(){
    const s = await API.post('/auctions', form);
    if (s.data?.id) { setForm({ title:'', description:'', start_price:10, bid_increment:1, start_time:'', end_time:'' }); load(); }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h2>Auctions</h2>
      <div>
        <h3>Create (sellers)</h3>
        <input placeholder="title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input placeholder="description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input type="number" value={form.start_price} onChange={e=>setForm({...form,start_price:e.target.value})} />
        <input type="number" value={form.bid_increment} onChange={e=>setForm({...form,bid_increment:e.target.value})} />
        <input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} />
        <input type="datetime-local" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})} />
        <button onClick={create}>Create Auction</button>
      </div>

      <ul>
        {list.map(a=>(
          <li key={a.id}><Link to={`/auctions/${a.id}`}>{a.title}</Link> — {a.status}</li>
        ))}
      </ul>
    </div>
  );
}
