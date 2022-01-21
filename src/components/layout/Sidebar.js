import React from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useApp } from '../../providers/AppProvider';

const Sidebar = () => {
  const { hasViewAccessTo } = useApp();

  const { Sider } = Layout
  return (
    <Sider theme='light'>
      <Menu defaultSelectedKeys={['1']} mode='inline'>
        {/* <Menu.Item style={{ marginBottom: '10px', borderBottom: 'solid black 1px' }} key='1'>
          <Link to='/'>Admin</Link>
        </Menu.Item>
        <Menu.Item key='2'>
          <Link to='/accounting'>Accounting</Link>
        </Menu.Item>
        <Menu.Item key='3'>
          <Link to='/sales'>Sales </Link>
        </Menu.Item>
        <Menu.Item key='7'>
          <Link to='/settings'>Settings</Link>
        </Menu.Item> */}
        { hasViewAccessTo("SCM") && 
          <Menu.Item key='4'>
            <Link to='/suppliers'>Suppliers</Link>
          </Menu.Item>
        }
        { hasViewAccessTo("CRM") && 
          <Menu.Item key='5'>
            <Link to='/customers'>Customer</Link>
          </Menu.Item>
        }
        { hasViewAccessTo("HR") && 
          <Menu.Item key='6'>
            <Link to='/human-resource'>Human Resource</Link>
          </Menu.Item>
        }
      </Menu>
    </Sider>
  )
}

export default Sidebar
