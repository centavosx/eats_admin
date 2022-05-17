import axios from 'axios'

import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'
import socket from '../socket'
const Transactions = () => {
  const [show, setShow] = useState(false)
  const [src, setSrc] = useState('')
  return (
    <div className="main-panel" onMouseEnter={() => setShow(false)}>
      <Content>
        {show ? (
          <div
            style={{
              height: '85%',
              width: '50vw',
              border: '1px solid black',
              backgroundColor: 'white',
              position: 'fixed',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 80,
              right: 0,
              textAlign: 'center',
              zIndex: 10,
              borderRadius: '10px',
              padding: '10px',
              overflow: 'auto',
            }}
          >
            <button
              onClick={() => setShow(false)}
              style={{
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: 'red',
                borderRadius: '10px',
              }}
            >
              close
            </button>
            <br />
            <img style={{ width: '100%' }} src={src} />
          </div>
        ) : null}

        <RowTransaction
          key="1"
          what="transaction"
          name="Order Transactions"
          filename="Order Transactions"
          show={(v) => setShow(v)}
          imagesource={(v) => setSrc(v)}
        />
        <RowTransaction
          key="2"
          what="reservation"
          name="Advance Order Transactions"
          filename="Advance Order Transactions"
          show={(v) => setShow(v)}
          imagesource={(v) => setSrc(v)}
        />
      </Content>
    </div>
  )
}
const RowTransaction = (props) => {
  const [data, setData] = useState([])
  const [secondData, setSecondData] = useState([null, {}])
  const [search, setSearch] = useState('')
  const [dataToExport, setDataToExport] = useState([])
  React.useEffect(() => {
    getTransact()
    socket.on(props.what, (data) => {
      setData(data)
    })
  }, [])
  React.useEffect(() => {
    if (data.length > 0)
      setDataToExport(
        data.map((x) => {
          return {
            id: x[1].id,
            uid: x[1].uid,
            phone: x[1].phone.replaceAll(',', ' '),
            address: x[1].address.replaceAll(',', ' '),
            totalprice: 'Php' + x[1].totalprice,
            payment: x[1].payment,
            pstatus: x[1].pstatus,
            dateBought: x[1].dateBought
              ? new Date(x[1].dateBought).toDateString() +
                ' ' +
                new Date(x[1].dateBought).toLocaleTimeString()
              : 'No date',
            dateDelivered: x[1].dateDelivered
              ? new Date(x[1].dateDelivered).toDateString() +
                ' ' +
                new Date(x[1].dateDelivered).toLocaleTimeString()
              : 'No date',
            datePaid: x[1].datePaid
              ? new Date(x[1].datePaid).toDateString() +
                ' ' +
                new Date(x[1].datePaid).toLocaleTimeString()
              : 'No date',
            deliveryfee: 'Php' + (x[1].deliveryfee ? x[1].deliveryfee : 0),
            status: x[1].status,
            message: x[1].message?.replaceAll(',', ' ') ?? '',
          }
        })
      )
  }, [data])
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
  const searchD = (data) => {
    if (
      data[1].id.toLowerCase().includes(search.toLowerCase()) ||
      data[1].uid.toLowerCase().includes(search.toLowerCase()) ||
      data[1].address.toLowerCase().includes(search.toLowerCase()) ||
      data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
      data[1].status.toLowerCase().includes(search.toLowerCase()) ||
      data[1].pstatus.toLowerCase().includes(search.toLowerCase()) ||
      data[1].payment.toLowerCase().includes(search.toLowerCase())
    )
      return true
    return false
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
          hover={(v) => {
            props.show(true)
            props.imagesource(v)
          }}
          csv={{
            headers: [
              'Order Id',
              'User Id',
              'Phone Number',
              'Address',
              'Total Price',
              'Payment Mode',
              'Creation Date',
              'Delivery Date',
              'Payment Date',
              'Delivery Fee',
              'Status',
              'Payment Status',
              'Message',
            ],
            keyVals: [
              'id',
              'uid',
              'phone',
              'address',
              'totalprice',
              'payment',
              'dateBought',
              'dateDelivered',
              'datePaid',
              'deliveryfee',
              'status',
              'pstatus',
              'message',
            ],
            data: dataToExport,
            fileName: props.filename,
          }}
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
            'Creation Date',
            'Delivery Date',
            'Payment Date',
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
            'dateDelivered',
            'datePaid',
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
          nosubmit={true}
          placeHolder="Search Order Id, UserId, Address, Phone, Status, Payment Status or Payment mode"
          value={search}
          inputText={true}
          onChange={(v) => setSearch(v)}
          searchVal={searchD}

          // delete={deleteItem}
          // edit={(v) => setEditProd(v)}
        />
      ) : (
        <Table
          maxHeight="550px"
          hover={(v) => {
            props.show(true)
            props.imagesource(v)
          }}
          hoverout={(v) => props.show(v)}
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
