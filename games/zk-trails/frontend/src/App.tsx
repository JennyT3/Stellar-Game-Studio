import { Route, Switch, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <Header />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
