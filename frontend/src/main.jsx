import React from 'react';
 import ReactDOM from 'react-dom/client';
 import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 import App from './App.jsx';
 import Login from './pages/Login.jsx';
 import Register from './pages/Register.jsx';
 import Auctions from './pages/Auctions.jsx';
 import AuctionDetail from './pages/AuctionDetail.jsx';
 const router = createBrowserRouter([

{ path: '/', element: <App /> },
 { path: '/login', element: <Login /> },
 { path: '/register', element: <Register /> },
 { path: '/auctions', element: <Auctions /> },
 { path: '/auctions/:id', element: <AuctionDetail /> },
 ]);
 ReactDOM.createRoot(document.getElementById('root')).render(
 <RouterProvider router={router} />
 );