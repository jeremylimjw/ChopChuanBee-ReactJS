import { BellOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons/lib/icons'
import { Menu, Layout, Popover, Button, Modal, Typography, Space } from 'antd'
import React, { useState } from 'react'
import { useApp } from '../../providers/AppProvider'
import ChangePasswordForm from '../general/ChangePasswordForm'
import { useNavigate } from "react-router";

const Navbar = () => {
  const { Header } = Layout
  const { user, logout, removeSession } = useApp();

  const navigate = useNavigate();

  const [changePasswordModalVisibility, setChangePasswordModalVisibility] = useState(false);
  const [successMessageVisibility, setSuccessMessageVisibility] = useState(false);
  const [failureMessageVisibility, setFailureMessageVisibility] = useState(false);
  const [failureMessage, setFailureMessage] = useState();

  const content = (
    <>
      <Space direction='vertical'>
        <Button style={{ padding: '0' }} onClick={() => navigate('/myProfile')} type="link">My Profile</Button>
        <Button style={{ padding: '0' }} onClick={() => navigate('/myLeaves')} type="link">My Leaves</Button>
        <Button style={{ padding: '0' }} onClick={() => setChangePasswordModalVisibility(true)} type="link">Change Password</Button>
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
          <Popover placement="bottom" content={content} trigger="click">
            <UserOutlined style={{ fontSize: '16px' }} />
          </Popover>
        </Menu.Item>
      </Menu>

      <Modal
        title='Change password?'
        visible={changePasswordModalVisibility}
        onOk={() => { setSuccessMessageVisibility(true) }}
        onCancel={() => { setChangePasswordModalVisibility(false) }}
        footer={null}
        width={600}
        destroyOnClose={true}>
        <ChangePasswordForm
          setChangePasswordModalVisibility={setChangePasswordModalVisibility}
          setSuccessMessageVisibility={setSuccessMessageVisibility}
          setFailureMessageVisibility={setFailureMessageVisibility}
          setFailureMessage={setFailureMessage}
        />
      </Modal>

      <Modal
        title='Your password has been changed successfully.'
        visible={successMessageVisibility}
        footer={null}>
        <Button onClick={() => setSuccessMessageVisibility(false)} type="primary">Okay</Button>
      </Modal>

      <Modal
        title='Your password cannot be changed. Please try again or contact admin for support.'
        visible={failureMessageVisibility}
        footer={null}>
        <Typography>{failureMessage}</Typography>
        <Button style={{ marginTop: '20px' }} onClick={() => setFailureMessageVisibility(false)} type="primary">Okay</Button>
      </Modal>

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
