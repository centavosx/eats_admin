import axios from 'axios'
import { encryptJSON, decryptJSON, encrypt } from '../encryption'
export const checkLogin = async (user, pw) => {
  try {
    console.log(user, pw)
    const resp = await axios.post(
      process.env.REACT_APP_API + 'login',
      encryptJSON({
        user: user,
        pass: pw,
      })
    )

    let response = decryptJSON(resp.data.data)
    return response && response.login
  } catch {
    return false
  }
}
