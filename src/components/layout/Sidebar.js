import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { Sider } = Layout
  return (
    <Sider theme='light'>
      <Menu defaultSelectedKeys={['1']} mode='inline'>
        <Menu.Item style={{ marginBottom: '10px', borderBottom: 'solid black 1px' }} key='1'>
          <Link to='/'>Admin</Link>
        </Menu.Item>
        <Menu.Item key='2'>
          <Link to='/test'>Accounting</Link>
        </Menu.Item>
        <Menu.Item key='3'>
          <Link to='/invoicing'>Invoicing </Link>
        </Menu.Item>
        <Menu.Item key='4'>Inventory</Menu.Item>
        <Menu.Item key='5'>Customer</Menu.Item>
        <Menu.Item key='6'>Human Resource</Menu.Item>
        <Menu.Item key='7'>Settings</Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Sidebar
