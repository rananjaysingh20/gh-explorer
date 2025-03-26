import './App.scss'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RepositoryDetails from './pages/RepositoryDetails';
import Issues from './pages/Issues';
import UserProfile from './pages/UserProfile';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className='main-container'>
      <Navbar />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/repository/:owner/:repo" element={<RepositoryDetails />} />
            <Route path="/repository/:owner/:repo/issues" element={<Issues />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
