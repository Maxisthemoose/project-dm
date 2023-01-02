import React, { useState } from 'react';
import './App.css';
import Login from './Routes/Login/Login';
import Register from './Routes/Register/Register';
import { Routes, Route } from "react-router-dom";
import Create from './Routes/Create/Create';
import { RequireAuth } from 'react-auth-kit';
import Room from './Routes/Room/Room';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={
          <RequireAuth loginPath="/">
            <Create />
          </RequireAuth>
        } />
        <Route path="/room/:id" element={
          <RequireAuth loginPath="/">
            <Room />
          </RequireAuth>
        } />
      </Routes>
    </div>
  );
}

export default App;
