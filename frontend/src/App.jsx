import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import { Signin } from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { SendMoney } from './pages/SendMoney';
import Transactions from './pages/Transactions';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with redirect if already authenticated */}
        <Route path="/" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <Signin />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/send" element={
          <PrivateRoute>
            <SendMoney />
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
