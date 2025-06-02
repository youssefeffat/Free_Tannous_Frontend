// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/Login';
import Signup from './login/Signup';
import AdminUsers from './admin/AdminUsers';
import Dashboard from './pages/DashboardLayout';
import ProductsView from "./pages/views/ProductsView";
import ProductCatalogView from "./pages/views/ProductCatalogView";
// import PlayQuizPage from './quiz/PlayQuizPage';
// import LeaderboardPage from './quiz/LeaderboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminUsers />} />
        {/* <Route path="/play/:id" element={<PlayQuizPage />} /> */}
        {/* <Route path="/quiz/:id/leaderboard" element={<LeaderboardPage />} /> */}
        {/* Add other routes here */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductsView />} />
        <Route path="/catalog" element={<ProductCatalogView />} />
        {/* <Route path="/quiz" element={<Quiz />} /> */}
        {/* <Route path="/create-quiz" element={<CreateQuiz />} /> */}
        {/* <Route path="/play/:id" element={<PlayQuizPage />} /> */}
        {/* <Route path="/quiz/:id/leaderboard" element={<LeaderboardPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
