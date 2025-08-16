import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [current, setCurrent] = useState(null);
  const [myBid, setMyBid] = useState("");
  const socket = useMemo(() => io(import.meta.env.VITE_API_BASE), []);

  async function load() {
    const res = await API.get(`/auctions/${id}`);
    setAuction(res.data.auction);
    setCurrent(res.data.current);
  }

  async function placeBid() {
    try {
      await API.post("/bids", { auction_id: id, amount: parseFloat(myBid) });
      setMyBid("");
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  }

  useEffect(() => {
    load();
    socket.emit("join_auction", id);
    socket.on("new_bid", ({ auction_id, amount }) => {
      if (auction_id === id) setCurrent(amount);
    });
    return () => {
      socket.emit("leave_auction", id);
      socket.off("new_bid");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [id]);

  if (!auction)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading auction...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{auction.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">{auction.description}</p>
          <p className="text-sm text-gray-500">Status: {auction.status}</p>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">
              {auction.status === "ended" ? "Highest Bid" : "Current Bid"}:{" "}
              <span className="text-green-600 font-bold">{current}</span>
            </h3>
            {auction.status === "ended" && auction.highest_bid_user && (
              <p className="text-sm text-gray-700 mt-1">
                By: <span className="font-medium">{auction.highest_bid_user.name}</span>
              </p>
            )}
          </div>

          {/* Show bidding input only if auction is active */}
          {auction.status === "active" && (
            <div className="flex gap-3 items-center">
              <Input
                type="number"
                placeholder="Enter your bid"
                value={myBid}
                onChange={(e) => setMyBid(e.target.value)}
              />
              <Button onClick={placeBid}>Place Bid</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
