import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "./index.css"

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent className="flex flex-col items-center space-y-6 p-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Auction MVP
          </h1>

          <nav className="flex flex-col w-full gap-4">
            <Button variant="default" className="w-full" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/register">Register</Link>
            </Button>
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/auctions">Browse Auctions</Link>
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
