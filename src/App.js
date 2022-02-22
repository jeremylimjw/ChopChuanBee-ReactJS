import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Sidebar />
        <Outlet />
      </Layout>
    </>
  )
}

export default App;
