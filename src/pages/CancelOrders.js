import axios from 'axios'

import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'

import socket from '../socket'
const CancelOrders = () => {
  const [show, setShow] = useState(false)
  const [order, setOrders] = useState([])
  const [advanced, setAdvanced] = useState([])
  const [src, setSrc] = useState('')
  const [sortAdv, setSortAdv] = useState('All')
  const [sortOrder, setSortOrder] = useState('All')

  React.useEffect(() => {
    getTransaction('transaction')
    getTransaction('reservation')
    socket.on('orderrequest', (data) => {
      setOrders(data)
    })
    socket.on('advancerequest', (data) => {
      setAdvanced(data)
    })
  }, [])
  const getTransaction = async (w) => {
    const resp = await axios.get(
      process.env.REACT_APP_API + 'getCancelRequest',
      {
        params: {
          what: w,
        },
      }
    )
    if (w === 'transaction') return setOrders(resp.data)
    return setAdvanced(resp.data)
  }

  const updateData = async (what, id, data, accepted) => {
    await axios.patch(process.env.REACT_APP_API + 'approveRequest', {
      what,
      id,
      uid: data.userid,
      accepted,
      totalprice: data.totalprice,
      paid: data.pstatus === 'Paid' ? true : false,
    })
  }

  return (
    <div className="main-panel">
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

        <h3 style={{}}>Order Now</h3>
        <div
          style={{
            width: '100%',
            overflow: 'auto',
            minHeight: '200px',
            maxHeight: '500px',
          }}
        >
          <table class="styled-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>UID</th>
                <th>Price</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Creation Date</th>
                <th>Payment Date</th>
                <th>Receipt</th>
                <th>Status</th>
                <th class="dropdown">
                  <th class="dropbtn">Reason</th>
                  <div class="dropdown-content">
                    <a
                      disabled=""
                      value={null}
                      selected={true}
                      onClick={() => setSortOrder('All')}
                    >
                      All
                    </a>
                    <a
                      value="Want to change payment method"
                      onClick={() =>
                        setSortOrder('Want to change payment method')
                      }
                    >
                      Want to change payment method
                    </a>
                    <a
                      value="Change/Combine order"
                      onClick={() => setSortOrder('Change/Combine order')}
                    >
                      Change/Combine Order
                    </a>
                    <a
                      value="Delivery time is too long"
                      onClick={() => setSortOrder('Delivery time is too long')}
                    >
                      Delivery time is too long
                    </a>
                    <a
                      value="Duplicate Order"
                      onClick={() => setSortOrder('Duplicate Order')}
                    >
                      Duplicate Order
                    </a>
                    <a
                      value="Change of mind"
                      onClick={() => setSortOrder('Change of mind')}
                    >
                      Change of mind
                    </a>
                    <a
                      value="Decided for alternative product"
                      onClick={() =>
                        setSortOrder('Decided for alternative product')
                      }
                    >
                      Decided for alternative product
                    </a>

                    <a value="Refund" onClick={() => setSortOrder('Refund')}>
                      Request Refund
                    </a>

                    <a value="Others" onClick={() => setSortOrder('Others')}>
                      Others
                    </a>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {order.map((data, i) =>
                sortOrder === 'All' || data.val.reason.includes(sortOrder) ? (
                  <tr>
                    <td>{data.val.id} </td>
                    <td>{data.val.uid}</td>
                    <td>Php{data.val.totalprice.toFixed(2)}</td>
                    <td>{data.val.payment}</td>
                    <td>{data.val.pstatus}</td>
                    <td>
                      {data.val.dateBought ? (
                        <>
                          {new Date(data.val.dateBought).toDateString()}{' '}
                          {new Date(data.val.dateBought).toLocaleTimeString()}
                        </>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>
                      {data.val.datePaid ? (
                        <>
                          {new Date(data.val.datePaid).toDateString()}{' '}
                          {new Date(data.val.datePaid).toLocaleTimeString()}
                        </>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>
                      {data.val.receipt ? (
                        <img
                          src={data.val.receipt}
                          style={{ width: '50px', height: '50px' }}
                          onClick={() => {
                            setSrc(data.val.receipt)
                            setShow(true)
                          }}
                        />
                      ) : (
                        'No picture'
                      )}
                    </td>
                    <td>{data.val.status}</td>
                    <td>{data.val.reason}</td>
                    <td>
                      <table>
                        <tr>
                          <th>
                            <button
                              class="button-9"
                              role="button"
                              onClick={() =>
                                updateData(
                                  'transaction',
                                  data.id,
                                  data.val,
                                  true
                                )
                              }
                            >
                              Yes
                            </button>
                          </th>
                          <th>
                            <button
                              class="button-9"
                              role="button"
                              onClick={() =>
                                updateData(
                                  'transaction',
                                  data.id,
                                  data.val,
                                  false
                                )
                              }
                            >
                              No
                            </button>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
        <br />
        <h3>Advance Order</h3>
        <div
          style={{
            width: '100%',
            overflow: 'auto',
            minHeight: '200px',
            maxHeight: '500px',
          }}
        >
          <table class="styled-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>UID</th>
                <th>Price</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Creation Date</th>
                <th>Payment Date</th>
                <th>Receipt</th>
                <th>Status</th>
                <th class="dropdown">
                  <th class="dropbtn">Reason</th>
                  <div class="dropdown-content">
                    <a
                      disabled=""
                      value={null}
                      selected={true}
                      onClick={() => setSortAdv('All')}
                    >
                      All
                    </a>
                    <a
                      value="Want to change payment method"
                      onClick={() =>
                        setSortAdv('Want to change payment method')
                      }
                    >
                      Want to change payment method
                    </a>
                    <a
                      value="Change/Combine order"
                      onClick={() => setSortAdv('Change/Combine order')}
                    >
                      Change/Combine Order
                    </a>
                    <a
                      value="Delivery time is too long"
                      onClick={() => setSortAdv('Delivery time is too long')}
                    >
                      Delivery time is too long
                    </a>
                    <a
                      value="Duplicate Order"
                      onClick={() => setSortAdv('Duplicate Order')}
                    >
                      Duplicate Order
                    </a>
                    <a
                      value="Change of mind"
                      onClick={() => setSortAdv('Change of mind')}
                    >
                      Change of mind
                    </a>
                    <a
                      value="Decided for alternative product"
                      onClick={() =>
                        setSortAdv('Decided for alternative product')
                      }
                    >
                      Decided for alternative product
                    </a>

                    <a value="Refund" onClick={() => setSortAdv('Refund')}>
                      Request Refund
                    </a>

                    <a value="Others" onClick={() => setSortAdv('Others')}>
                      Others
                    </a>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {advanced.map((data, i) =>
                sortAdv === 'All' || data.val.reason.includes(sortAdv) ? (
                  <tr>
                    <td>{data.val.id} </td>
                    <td>{data.val.uid}</td>
                    <td>Php{data.val.totalprice.toFixed(2)}</td>
                    <td>{data.val.payment}</td>
                    <td>{data.val.pstatus}</td>
                    <td>
                      {data.val.dateBought ? (
                        <>
                          {new Date(data.val.dateBought).toDateString()}{' '}
                          {new Date(data.val.dateBought).toLocaleTimeString()}
                        </>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>
                      {data.val.datePaid ? (
                        <>
                          {new Date(data.val.datePaid).toDateString()}{' '}
                          {new Date(data.val.datePaid).toLocaleTimeString()}
                        </>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>
                      {data.val.receipt ? (
                        <img
                          src={data.val.receipt}
                          style={{ width: '50px', height: '50px' }}
                          onClick={() => {
                            setSrc(data.val.receipt)
                            setShow(true)
                          }}
                        />
                      ) : null}
                    </td>
                    <td>{data.val.status}</td>
                    <td>{data.val.reason}</td>
                    <td>
                      <table>
                        <tr>
                          <th>
                            <button
                              class="button-9"
                              role="button"
                              onClick={() =>
                                updateData(
                                  'reservation',
                                  data.id,
                                  data.val,
                                  true
                                )
                              }
                            >
                              Yes
                            </button>
                          </th>
                          <th>
                            <button
                              class="button-9"
                              role="button"
                              onClick={() =>
                                updateData(
                                  'reservation',
                                  data.id,
                                  data.val,
                                  false
                                )
                              }
                            >
                              No
                            </button>
                          </th>
                        </tr>
                      </table>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </Content>
    </div>
  )
}

export default CancelOrders
