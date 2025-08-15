import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import API from '../lib/api';
import { io } from 'socket.io-client';
import { supabase } from '../lib/supabase';

export default function AuctionDetail(){
  const { id } = useParams();
  const [auction,setAuction]=useState(null);
  const [current,setCurrent]=useState(null);
  const [myBid,setMyBid]=useState('');
  const socket = useMemo(()=>io(import.meta.env.VITE_API_BASE), []);

  async function load(){
    const res = await API.get(`/auctions/${id}`);
    setAuction(res.data.auction);
    setCurrent(res.data.current);
  }

  async function placeBid(){
    try {
      await API.post('/bids', { auction_id: id, amount: parseFloat(myBid) });
      setMyBid('');
    } catch (e) { alert(e.response?.data?.error || e.message); }
  }

  useEffect(()=>{
    load();
    socket.emit('join_auction', id);
    socket.on('new_bid', ({ auction_id, amount }) => {
      if (auction_id === id) setCurrent(amount);
    });
    return ()=>{ socket.emit('leave_auction', id); socket.off('new_bid'); socket.disconnect(); };
    // eslint-disable-next-line
  }, [id]);

  if (!auction) return <div>Loading...</div>;
  return (
    <div>
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <p>Status: {auction.status}</p>
      <h3>Current: {current}</h3>
      <input value={myBid} onChange={e=>setMyBid(e.target.value)} />
      <button onClick={placeBid}>Place bid</button>
    </div>
  );
}
