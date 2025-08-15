import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('buyer');

  async function handleSignup(){
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    // user must confirm via email (Supabase setting). When created, upsert profile row:
    const userId = data.user?.id;
    if (userId) {
      const { error: up } = await supabase.from('users').upsert({ id: userId, name, role });
      if (up) return alert(up.message);
    }
    alert('Signup success. Check email to confirm if required.');
  }

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="buyer">buyer</option>
        <option value="seller">seller</option>
        <option value="admin">admin</option>
      </select>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign up</button>
    </div>
  );
}
