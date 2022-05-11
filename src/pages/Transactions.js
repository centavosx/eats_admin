import axios from 'axios'

import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'
const Transactions = () => {
  return (
    <div className="main-panel">
      <Content>
        <RowTransaction key="1" what="transaction" name="Order Transactions" />
        <RowTransaction
          key="2"
          what="reservation"
          name="Advance Order Transactions"
        />
      </Content>
    </div>
  )
}
const RowTransaction = (props) => {
  const [data, setData] = useState([])
  React.useEffect(() => {
    getTransact()
  }, [])
  const getTransact = async () => {
    const resp = await axios.post(process.env.REACT_APP_API + 'gettransact', {
      what: props.what,
    })
    setData(resp.data)
  }
  const updatePaymentStatus = async (data, value) => {}
  const updateStatus = async (data, value) => {
    try {
      const id = data[0]
      const set = { ...data[1] }
      const lastV = data[1].status
      set.status = value
      if (props.what === 'transaction') {
        if (value === 'Completed') {
          await axios.put(process.env.REACT_APP_API + 'updatetransactstatus', {
            idnum: set.userid,
            hid: id,
          })
          return
        }
        await axios.put(process.env.REACT_APP_API + 'updateaccounthistory', {
          idn: id,
          what: props.what,
          set: set,
          v2: lastV,
        })
        return
      }
      await axios.put(process.env.REACT_APP_API + 'updateaccountadv', {
        idn: id,
        set: set,
      })
      return
    } catch (e) {
      console.log(e)
      return
    }
  }
  return (
    <Row>
      {' '}
      <Table
        size="col-md-12"
        headers={[
          'Order Id',
          'UID',
          'Phone',
          'Address',
          'Price',
          'Payment Mode',
          'Payment Status',
          'Date',
          'Receipt',
          'Status',
          'Message',
          'Actions',
        ]}
        data={data}
        // data={products}
        needed={[
          'id',
          'uid',
          'phone',
          'address',
          'totalprice',
          'payment',
          'pstatus',
          'dateBought',
          'receipt',
          'status',
          'message',
        ]}
        name={props.name}
        changeStatus={(v) => updateStatus(v[0], v[1])}
        // maxHeight="680px"
        // delete={deleteItem}
        // edit={(v) => setEditProd(v)}
      />
    </Row>
  )
}

export default Transactions
