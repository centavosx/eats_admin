import axios from 'axios'
import React, { useState } from 'react'
import Content, { Row, FormInput } from '../components/Content'
import socket from '../socket'
const Payment = () => {
  const [bank, setBank] = useState({})
  const [gcash, setGcash] = useState({})
  React.useEffect(() => {
    getData()
    socket.on('bank', (data) => {
      setBank(data)
    })
    socket.on('gcash', (data) => {
      setGcash(data)
    })
  }, [])
  const getData = async () => {
    const resp = await axios.get(process.env.REACT_APP_API + 'getPayment')
    setBank(resp.data[0])
    setGcash(resp.data[1])
  }
  return (
    <div className="main-panel">
      <Content>
        <Row>
          <PaymentWhat
            title="GCASH"
            isBank={false}
            img={gcash.url}
            accountHolder={gcash.holder}
            accountNumber={gcash.number}
          />
          <PaymentWhat
            title="BANK"
            isBank={true}
            img={bank.url}
            bank={bank.bank}
            accountHolder={bank.holder}
            accountNumber={bank.number}
          />
        </Row>
      </Content>
    </div>
  )
}

const PaymentWhat = (props) => {
  const [image, setImage] = useState(null)
  const [imgurl, setImgurl] = useState(null)
  const [accountHolder, setAccountHolder] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bank, setBank] = useState('')
  const filechange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.onload = function (e) {
        setImgurl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const update = async () => {
    await axios.patch(process.env.REACT_APP_API + 'updateQRdata')
    await axios.patch(process.env.REACT_APP_API + 'updateQRcode')
  }
  return (
    <div className="col-md-6">
      <div className="card card-user">
        <div className="card-header">
          <h5 className="card-title">{props.title}</h5>
        </div>
        <div className="card-body">
          <form>
            <Row>
              <FormInput
                type="text"
                label="Account Holder"
                placeHolder={props.accountHolder ?? 'Type Account Number'}
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Account Number"
                placeHolder={props.accountNumber ?? 'Type Account Number'}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Row>
            {props.isBank ? (
              <Row>
                <FormInput
                  type="text"
                  label="Bank"
                  placeHolder={props.bank ?? 'Type Bank'}
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                />
              </Row>
            ) : null}
            <Row>
              <div className="col-md-12" style={{ padding: '10px' }}>
                <center>
                  <img
                    src={imgurl !== null ? imgurl : props.img ?? ''}
                    style={{ width: '150px', height: '150px' }}
                  />
                </center>
              </div>
            </Row>
            <Row>
              <FormInput
                id="imgfile"
                type="file"
                label="QRCode"
                placeHolder="Select QrCode"
                onChange={(e) => filechange(e)}
                accept="image/*"
              />
            </Row>

            <Row>
              <div className="update ml-auto mr-auto">
                <button type="submit" className="btn btn-primary btn-round">
                  Update Profile
                </button>
              </div>
            </Row>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Payment
