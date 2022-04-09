import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { Sidebar } from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import { ChatProvider } from './providers/ChatProvider';
import Chat from './components/chat';

function App() {
  return (
    <>
      <Layout>
        <Navbar />
        <Layout>
          <Sidebar />
          <Outlet />
        </Layout>
      </Layout>

      <ChatProvider>
        <Chat />
      </ChatProvider>
    </>
  )
}

export default App;
