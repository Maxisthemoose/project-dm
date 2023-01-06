import React, { useState } from 'react';
import './App.css';
import Login from './Routes/Login/Login';
import Register from './Routes/Register/Register';
import { Routes, Route } from "react-router-dom";
import Create from './Routes/Create/Create';
import { RequireAuth } from 'react-auth-kit';
import Room from './Routes/Room/Room';
import Content from './Routes/Content/Content';
import CreateCharacter from './Routes/Content/CreateCharacter/CreateCharacter';
import EditCharacter from './Routes/Content/EditCharacter/EditCharacter';
import NotFound from './Routes/404/404';

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
        <Route path="/my-content" element={
          <RequireAuth loginPath="/">
            <Content />
          </RequireAuth>
        } />
        <Route path="/my-content/create-character" element={
          <RequireAuth loginPath='/'>
            <CreateCharacter />
          </RequireAuth>
        } />
        <Route path="/my-content/edit/:id" element={
          <RequireAuth loginPath='/'>
            <EditCharacter />
          </RequireAuth>
        } />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
