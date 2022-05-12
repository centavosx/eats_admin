import axios from 'axios'

import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'
import socket from '../socket'
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
  const [secondData, setSecondData] = useState([null, {}])
  React.useEffect(() => {
    getTransact()
    socket.on(props.what, (data) => {
      setData(data)
    })
  }, [])

  React.useEffect(() => {
    if (data.length > 0 && secondData[0] !== null) {
      setSecondData(data.find((d) => d[0] === secondData[0]) ?? [null, {}])
    }
  }, [data])

  const getTransact = async () => {
    const resp = await axios.post(process.env.REACT_APP_API + 'gettransact', {
      what: props.what,
    })
    setData(resp.data)
  }
  const updatePaymentStatus = async (id, value) => {
    try {
      await axios.put(process.env.REACT_APP_API + 'setpstatus', {
        what: props.what,
        id: id,
        paid: value,
      })
    } catch {}
  }
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
      return
    }
  }
  const setFee = async (id, data) => {
    try {
      await axios.put(process.env.REACT_APP_API + 'setfee', {
        what: props.what,
        id: id,
        fee: data,
      })
    } catch {}
  }
  const changeItemStatus = async (index, transactionid, data, value) => {
    const oldstatus = data.status
    const newd = value
    await axios.patch(process.env.REACT_APP_API + 'updateAdvanceItem', {
      v0: null,
      id: transactionid,
      index: index,
      d: newd,
      v2: oldstatus,
    })
  }
  return (
    <Row>
      {' '}
      {secondData[0] === null ? (
        <Table
          size="col-md-12"
          maxHeight="550px"
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
            'Delivery fee',
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
            'deliveryfee',
            'status',
            'message',
          ]}
          name={props.name}
          changeStatus={(v) => updateStatus(v[0], v[1])}
          changePStatus={(v) => updatePaymentStatus(v[0], v[1])}
          changeFee={(v) => setFee(v[0], v[1])}
          showItem={(v) => setSecondData(v)}
          // delete={deleteItem}
          // edit={(v) => setEditProd(v)}
        />
      ) : (
        <Table
          maxHeight="550px"
          name={
            <>
              Order <b>{secondData[1].id}</b>'s Items
              <br />
              <button
                type="submit"
                className="btn btn-round"
                style={{
                  backgroundColor: 'red',
                  width: 'auto',
                  height: 'auto',
                  fontSize: '15px',
                  padding: '8px',
                }}
                onClick={() => setSecondData([null, {}])}
              >
                Back
              </button>
            </>
          }
          size="col-md-12"
          headers={
            props.what === 'transaction'
              ? ['Id', 'Product Name', 'Image', 'Price', 'Amount']
              : ['Id', 'Product Name', 'Image', 'Price', 'Amount', 'Status']
          }
          data={secondData[1].items ?? []}
          needed={
            props.what === 'transaction'
              ? ['id', 'title', 'link', 'price', 'amount']
              : ['id', 'title', 'link', 'price', 'amount', 'status']
          }
          getindex={true}
          changeStatus={(v) =>
            changeItemStatus(v.index, secondData[0], v.data[0][1], v.data[1])
          }
        />
      )}
    </Row>
  )
}

export default Transactions
