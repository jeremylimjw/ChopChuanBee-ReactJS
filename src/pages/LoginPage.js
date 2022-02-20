import React, { useState } from 'react';
import '../css/LoginPage.css';
import { Row, Col, Button, Input, Spin } from 'antd';
import LoginForm from '../components/general/LoginForm';
import ForgotPasswordForm from '../components/general/ForgotPasswordForm';
import { httpLogin } from '../api/auth';
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from '../providers/AppProvider';

const LoginPage = () => {
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  return (
    // <div className='container'>
    //   <form onSubmit={onSubmit}>
    //     <div className='form'>
    //       <img className='image' src="Chop_Chuan_Bee_Logo.png" height="200" width="200"></img>

    //       <Input type="text" className='input'
    //           value={form.username} placeholder='Username'
    //           onChange={e => setForm({ ...form, username : e.target.value })} />

    //       <Input type="password" className='input'
    //           value={form.password} placeholder='Password'
    //           onChange={e => setForm({ ...form, password : e.target.value })} />

    //       <Button type="primary" htmlType="submit" className='button' disabled={loading} onClick={onSubmit} shape="round" size="large">
    //         {loading ? <Spin /> : "Sign In" }
    //       </Button>

    //       {/* <i>These buttons are for developer's convenience. Remove this whenever</i>
    //       <Button className='button' disabled={loading} onClick={() => login("admin", "password")} shape="round" size="large">
    //         {loading ? <Spin /> : "Quick Login (Admin)" }
    //       </Button>

    //       <Button className='button' disabled={loading} onClick={() => login("alice", "password")} shape="round" size="large">
    //         {loading ? <Spin /> : "Quick Login (Staff)" }
    //       </Button> */}

    //     </div>
    //   </form>
    // </div>

    <>
      <Row justify="center" align="middle" style={{ minHeight: '100vh', textAlign: 'center' }}>
        <Col span={5}>
          <img className='image' src="Chop_Chuan_Bee_Logo.png"></img>

          {showForgotPasswordForm
            ? <><ForgotPasswordForm setShowForgotPasswordForm={setShowForgotPasswordForm} /> <Button type="link" onClick={() => setShowForgotPasswordForm(false)}> Back to login page </Button></>
            : <><LoginForm /> <Button type="link" onClick={() => setShowForgotPasswordForm(true)}> Forgot Password? </Button></>}
        </Col>
      </Row>
    </>
  )
}

export default LoginPage
