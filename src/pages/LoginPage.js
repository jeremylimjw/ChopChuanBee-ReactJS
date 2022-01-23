import React, { useState } from 'react'
import { httpLogin } from '../api/auth'
import { Button, Input, Spin } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import '../css/LoginPage.css'
import { useApp } from '../providers/AppProvider'
import { message as antMessage } from 'antd'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useApp()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (form.username && form.password) {
      login(form.username, form.password)
    }
  }

  async function login(username, password) {
    setLoading(true)

    httpLogin(username, password)
      .then((user) => {
        // Set the user in session
        sessionStorage.setItem('user', JSON.stringify(user))
        setUser(user)

        // Redirect to dashboard or any previously entered url
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      })
      .catch((err) => {
        if (err.text) {
          err.text().then((message) => antMessage.error(message))
        } else {
          antMessage.error('An unexpected error has occured')
        }
        setLoading(false)
      })
  }

  return (
    <div className='container'>
      <form onSubmit={onSubmit}>
        <div className='form'>
          <img className='image' src='logo512.png' height='200' width='200'></img>

          <Input
            type='text'
            className='input'
            value={form.username}
            placeholder='Username'
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <Input
            type='password'
            className='input'
            value={form.password}
            placeholder='Password'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button
            type='primary'
            htmlType='submit'
            className='button'
            disabled={loading}
            onClick={onSubmit}
            shape='round'
            size='large'
          >
            {loading ? <Spin /> : 'Sign In'}
          </Button>

          <i>These buttons are for developer's convenience. Remove this whenever</i>
          <Button
            className='button'
            disabled={loading}
            onClick={() => login('admin', 'password')}
            shape='round'
            size='large'
          >
            {loading ? <Spin /> : 'Quick Login (Admin)'}
          </Button>

          <Button
            className='button'
            disabled={loading}
            onClick={() => login('alice', 'password')}
            shape='round'
            size='large'
          >
            {loading ? <Spin /> : 'Quick Login (Staff)'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
