import React, { useState } from 'react';
import { Row, Col, Button, Input, Form } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import { REQUIRED } from '../utilities/form';
import { useApp } from '../providers/AppProvider';
import { httpLogin } from '../api/auth';
import ForgotPasswordModal from './general/ForgotPasswordModal';

const LoginPage = () => {

  const { setUser, handleHttpError } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function onSubmit(values) {
    setLoading(true);
    httpLogin(values.username, values.password)
      .then(user => {
        setLoading(false);
        // Set the user in session
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        // Redirect to dashboard or any previously entered url
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false));

  }

  function quickLogin(username, password) {
    onSubmit({ username, password: password });
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col span={5} >
        <div style={{ width: 300 }}>

          <div style={{ textAlign: 'center', margin: '60px 0' }}>
            <img className='image' src="Chop_Chuan_Bee_Logo.png" alt="company_logo" height="150" width="150"></img>
          </div>

          <Form form={form} onFinish={onSubmit}>
            <Form.Item name="username" rules={[REQUIRED]}>
              <Input placeholder='Username' />
            </Form.Item>

            <Form.Item name="password" rules={[REQUIRED]}>
              <Input.Password placeholder='Password' autoComplete='off' />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%'}}>Sign In</Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" style={{ width: '100%'}} onClick={() => setIsModalVisible(true)}>Forgot password</Button>
            </Form.Item>
            
            <Form.Item>
              <Button disabled={loading} onClick={() => quickLogin("admin", "password")} style={{ width: '100%'}}>Quick Login (Admin)</Button>
            </Form.Item>

            <Form.Item>
              <Button disabled={loading} onClick={() => quickLogin("alice", "password")} style={{ width: '100%'}}>Quick Login (Staff)</Button>
            </Form.Item>
          </Form>

        </div>
      </Col>

      <ForgotPasswordModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </Row>
  )
}

export default LoginPage
