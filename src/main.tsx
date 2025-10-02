import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages imported via absolute alias as in project structure
import Home from '@/Pages/Home';
import Explore from '@/Pages/Explore';
import Properties from '@/Pages/Properties';
import Dashboard from '@/Pages/Dashboard';
import Settings from '@/Pages/Settings';
import Portfolio from '@/Pages/Portfolio';
import PortfolioSimulator from '@/Pages/PortfolioSimulator';
import TREFs from '@/Pages/TREFs';
import Investments from '@/Pages/Investments';
import Events from '@/Pages/Events';
import OwnerPortal from '@/Pages/OwnerPortal';
import CreateToken from '@/Pages/CreateToken';
import Referral from '@/Pages/Referral';
import Wallet from '@/Pages/Wallet';
import Watchlist from '@/Pages/Watchlist';
import SecondaryMarket from '@/Pages/SecondaryMarket';

import Layout from '@/Layout';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout currentPageName="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/Properties" element={<Properties />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Portfolio" element={<Portfolio />} />
          <Route path="/PortfolioSimulator" element={<PortfolioSimulator />} />
          <Route path="/TREFs" element={<TREFs />} />
          <Route path="/Investments" element={<Investments />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/OwnerPortal" element={<OwnerPortal />} />
          <Route path="/CreateToken" element={<CreateToken />} />
          <Route path="/Referral" element={<Referral />} />
          <Route path="/Wallet" element={<Wallet />} />
          <Route path="/Watchlist" element={<Watchlist />} />
          <Route path="/SecondaryMarket" element={<SecondaryMarket />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
