import './login.css'
import React, { useState } from 'react'
import axios from 'axios'
import { encryptJSON, decryptJSON, encrypt } from '../encryption'
const Login = (props) => {
  const [user, setUser] = useState('')
  const [pw, setPw] = useState('')
  const resetLogin = async () => {
    await axios.get(process.env.REACT_APP_API + 'resetpass')
    alert('Password has been resetted!')
  }
  const login = async (e) => {
    e.preventDefault()
    const resp = await axios.post(
      process.env.REACT_APP_API + 'login',
      encryptJSON({
        user: encrypt(user),
        pass: encrypt(pw),
      })
    )
    let response = decryptJSON(resp.data.data)
    if (!response || !response.login) return props.login(false)
    localStorage.setItem('user', response.user)
    localStorage.setItem('pass', response.pass)
    props.login(response.login)
  }
  return (
    <div className="login-body">
      <div className="login-form">
        <form onSubmit={(e) => login(e)}>
          <h1>Login</h1>
          <div className="content">
            <div className="input-field">
              <input
                type="text"
                placeholder="Username"
                autocomplete="nope"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                autocomplete="new-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            <a
              href={void 0}
              className="link"
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'blue',
              }}
              onClick={() => resetLogin()}
            >
              Reset password
            </a>
          </div>
          <div className="action">
            <button>Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
