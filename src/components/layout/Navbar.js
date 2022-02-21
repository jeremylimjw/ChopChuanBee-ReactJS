import { BellOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons/lib/icons'
import { Menu, Layout, Popover, Button, Modal, Typography, Space } from 'antd'
import React, { useState } from 'react'
import { useApp } from '../../providers/AppProvider'
import { useNavigate } from "react-router";
import ChangePasswordModal from '../../pages/User/ChangePasswordModal'

const Navbar = () => {
  const { Header } = Layout
  const { logout } = useApp();

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const content = (
    <>
      <Space direction='vertical'>
        <Button style={{ padding: '0' }} onClick={() => navigate('/myProfile')} type="link">My Profile</Button>
        <Button style={{ padding: '0' }} onClick={() => navigate('/myLeaves')} type="link">My Leaves</Button>
        <Button style={{ padding: '0' }} onClick={() => setIsModalVisible(true)} type="link">Change Password</Button>
        <Button style={{ padding: '0' }} type="link" onClick={logout}>Logout</Button>
      </Space>
    </>
  );

  return (
    <Header style={styles.header}>
      <Menu mode='horizontal' theme='dark' style={{ float: 'right' }}>
        <Menu.Item key='1'>
          <LineChartOutlined style={{ fontSize: '16px' }} />
        </Menu.Item>
        <Menu.Item key='2'>
          <BellOutlined style={{ fontSize: '16px' }} />
        </Menu.Item>
        <Menu.Item key='3'>
          <Popover placement="bottom" content={content}>
            <UserOutlined style={{ fontSize: '16px' }} />
          </Popover>
        </Menu.Item>
      </Menu>

      <ChangePasswordModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />

    </Header>
  )
}

export default Navbar

const styles = {
  header: {
    height: 48,
    lineHeight: '48px',
  }
}
