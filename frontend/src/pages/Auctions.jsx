import { useEffect, useState } from "react";
import API from "../lib/api";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Auctions({ currentUser }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_price: 10,
    bid_increment: 1,
    start_time: "",
    end_time: "",
  });
  const [timers, setTimers] = useState({}); // to store countdowns

  async function load() {
    const res = await API.get("/auctions");
    setList(res.data);
  }

  async function create() {
    const s = await API.post("/auctions", form);
    if (s.data?.id) {
      setForm({
        title: "",
        description: "",
        start_price: 10,
        bid_increment: 1,
        start_time: "",
        end_time: "",
      });
      load();
    }
  }

  async function startAuction(id) {
    try {
      await API.post(`/auctions/${id}/start`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start auction");
    }
  }

  async function endAuction(id) {
    try {
      await API.post(`/auctions/${id}/end`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to end auction");
    }
  }

  // Update countdown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTimers = {};
      list.forEach(a => {
        if (a.status === "upcoming") {
          const start = new Date(a.start_time);
          const diff = Math.max(0, start - now);
          newTimers[a.id] = formatTime(diff);
        } else if (a.status === "active") {
          const end = new Date(a.end_time);
          const diff = Math.max(0, end - now);
          newTimers[a.id] = formatTime(diff);
        }
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [list]);

  // Convert milliseconds to readable format
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Auctions</h2>

      {/* Auction Creation Form */}
      <Card className="max-w-2xl mx-auto mb-10 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Create Auction (Sellers)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Auction title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Auction description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_price">Start Price</Label>
              <Input
                id="start_price"
                type="number"
                value={form.start_price}
                onChange={(e) => setForm({ ...form, start_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bid_increment">Bid Increment</Label>
              <Input
                id="bid_increment"
                type="number"
                value={form.bid_increment}
                onChange={(e) => setForm({ ...form, bid_increment: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>

          <Button className="w-full" onClick={create}>
            Create Auction
          </Button>
        </CardContent>
      </Card>

      {/* Auction List */}
      <Card className="max-w-3xl mx-auto shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Active Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-gray-500">No auctions available yet.</p>
          ) : (
            <ul className="space-y-3">
              {list.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <Link
                      to={`/auctions/${a.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {a.title}
                    </Link>
                    <span className="ml-2 text-sm text-gray-500">
                      ({a.status})
                    </span>
                    {/* Timer */}
                    {timers[a.id] && (
                      <div className="text-sm text-gray-700">
                        {a.status === "upcoming"
                          ? `Starts in: ${timers[a.id]}`
                          : a.status === "active"
                          ? `Ends in: ${timers[a.id]}`
                          : null}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Start Auction button */}
                    {a.status === "upcoming" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startAuction(a.id)}
                      >
                        Start Auction
                      </Button>
                    )}
                    {/* End Auction button */}
                    {a.status === "active" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => endAuction(a.id)}
                      >
                        End Auction
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
