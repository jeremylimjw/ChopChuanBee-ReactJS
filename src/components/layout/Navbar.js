import { BellOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons/lib/icons'
import { Menu, Layout, Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { Header } = Layout
  return (
    <Header>
      <Menu mode='horizontal' theme='dark' style={{ float: 'right' }}>
        <Menu.Item key='1'>
          <UserOutlined style={{ fontSize: '16px' }} />
        </Menu.Item>
        <Menu.Item key='2'>
          <BellOutlined style={{ fontSize: '16px' }} />
        </Menu.Item>
        <Menu.Item key='3'>
          <LineChartOutlined style={{ fontSize: '16px' }} />
        </Menu.Item>
      </Menu>
    </Header>
  )
}

export default Navbar
