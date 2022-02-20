import React, { useState } from 'react';
import { Form } from 'antd';
import { httpLogin } from '../../api/auth';
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from '../../providers/AppProvider'
import { message as antMessage, Spin, Input, Button } from 'antd';

const LoginForm = () => {
  const [loginForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useApp();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (form.username && form.password) {
      login(form.username, form.password)
    }
  }

  async function login(username, password) {
    setLoading(true);

    httpLogin(username, password)
      .then(user => {
        // Set the user in session
        sessionStorage.setItem("user", JSON.stringify(user.data));
        setUser(user.data);

        // Redirect to dashboard or any previously entered url
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      })
      .catch(err => {
        if (err.text) {
          err.text().then(message => antMessage.error(message));
        } else {
          antMessage.error("An unexpected error has occured");
        }
        setLoading(false);
      })
  }

  return (
    <>
      <Form form={loginForm}
        initialValues={{ remember: true, }}
        onFinish={onSubmit}
        autoComplete="off"
        style={{ textAlign: 'center' }}>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Username required',
            },
          ]}
        >
          <Input type="text" className='input' value={form.username} placeholder='Username' onChange={e => setForm({ ...form, username: e.target.value })} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Password required',
            },
          ]}
        >
          <Input.Password type="password" className='input' value={form.password} placeholder='Password' onChange={e => setForm({ ...form, password: e.target.value })} />
        </Form.Item>

        <Form.Item>
          <Button className='button' type="primary" htmlType="submit" disabled={loading} onClick={onSubmit} loading={loading}>
            Sign In
          </Button>
        </Form.Item>

        {/* <Form.Item>
            <Link to='/forgotPassword'>Forgot password?</Link>
          </Form.Item> */}
          
           <i>These buttons are for developer's convenience. Remove this whenever</i>
           <Button className='button' disabled={loading} onClick={() => login("admin", "password")} shape="round" size="large" loading={loading}>
            Quick Login (Admin)
           </Button>
           <Button className='button' disabled={loading} onClick={() => login("alice", "password")} shape="round" size="large" loading={loading}>
            Quick Login (Staff)
           </Button>
      </Form>
    </>
  )
}

export default LoginForm