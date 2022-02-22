import { BellOutlined, LineChartOutlined, UserOutlined, KeyOutlined, ExportOutlined, ContainerOutlined } from '@ant-design/icons/lib/icons'
import { Menu, Layout, Popover, Button, Space } from 'antd'
import React, { useState } from 'react'
import { useApp } from '../../providers/AppProvider'
import { useNavigate } from "react-router";
import ChangePasswordModal from '../general/ChangePasswordModal';

export default function Navbar() {
  const { Header } = Layout
  const { user, logout } = useApp();

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  
  return (
    <Header style={styles.header}>
      <Menu mode='horizontal' selectable={false} theme="dark" style={{float: 'right'}}>

        <Menu.Item key="analytics" icon={<LineChartOutlined />}>
          Analytics
        </Menu.Item>
        
        <Menu.SubMenu key="subMenu" icon={<UserOutlined />} title={user.name}>
            <Menu.Item key="myProfile" onClick={() => navigate('/myProfile')} icon={<UserOutlined />}>My Profile</Menu.Item>
            <Menu.Item key="myLeaves" onClick={() => navigate('/myLeaves')} icon={<ContainerOutlined />}>My Leaves</Menu.Item>
            <Menu.Item key="changePassword" onClick={() => setIsModalVisible(true)} icon={<KeyOutlined />}>Change Password</Menu.Item>
            <Menu.Item key="logout" onClick={logout} icon={<ExportOutlined />}>Logout</Menu.Item>
        </Menu.SubMenu>
        
      </Menu>

      <ChangePasswordModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

    </Header>
  )

}

const styles = {
  header: {
    height: 48,
    lineHeight: '48px',
  }
}
