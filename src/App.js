import React, { useState } from 'react'
import 'antd/dist/antd.css'
import './App.css'
import { Outlet } from 'react-router-dom'
import { Button, Layout, Spin } from 'antd'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import ContentContainer from './components/layout/ContentContainer'
import { useApp } from './providers/AppProvider'
import { message as antMessage } from 'antd';
import { httpExample } from './api/example'

function App() {
  const { user, logout, removeSession } = useApp();
  
  const [loading, setLoading] = useState(false)

  async function exampleHttpRequest() {
    setLoading(true);

    httpExample()
      .then(res => {
        antMessage.success(JSON.stringify(res));
        setLoading(false);
      })
      .catch(err => {
        if (err.text) {
          err.text().then(message => {
            // Custom status code to indicate that user session timed out and need to login again
            if (err.status === 333) {
              removeSession();
            }
            antMessage.error(message);
          });
        } else {
          antMessage.error("An unexpected error has occured");
        }
        setLoading(false);
      })
  }

  return (
    <>
      <Navbar />
      <Layout>
        <Sidebar />
        <ContentContainer>
          {user && 
            <div>
              <i>This is just to show where and how to access the logged in user. Remove this whenever</i>
              <pre>{JSON.stringify(user, null, 2)}</pre>
              <Button type="primary" onClick={logout}>Logout</Button>
              <Button onClick={exampleHttpRequest}>{loading ? <Spin /> : "Example API request" }</Button>
            </div>}
          <Outlet />
        </ContentContainer>
      </Layout>
    </>
  )
}

export default App
