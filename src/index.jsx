import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import GoalBuildup from "./pages/GoalBuildup.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />

      {import.meta.env.DEV && <Route path="/preview/goal-buildup" element={<GoalBuildup />} />}
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
