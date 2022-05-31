import axios from 'axios'

import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'
import socket from '../socket'
const CancelOrders = () => {
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
      </Content>
      <div><h3 style={{
        marginLeft: '100px',
      }}>Order Now</h3>
      <center><table class="styled-table">
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
            <th>Reason</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>sample id </td>
            <td>sample uid</td>
            <td>sample price</td>
            <td>sample Pmode</td>
            <td>sample Pstats</td>
            <td>sample Cdate</td>
            <td>sample Pdate</td>
            <td>sample Receipt</td>
            <td>sample status</td>
            <td>
            <div class="dropdown">
            <select name="reasons" id="reasons">
            <option value="blank"></option>
            <option value="reason1">Change of mind</option>
            <option value="reason2">Wrong Address</option>
            <option value="reason3">Found a cheaper option</option>
            </select>
            </div>
            </td>
            <td>
              <table>
                <tr>
                <th><button class="button-9" role="button">Yes</button></th>
                <th><button class="button-9" role="button">No</button></th></tr></table>
          </td>
        </tr>
    </tbody>
</table></center>
<h3 style={{
        marginLeft: '100px',
      }}>Advance Order</h3>
      <center><table class="styled-table" >
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
            <th>Reason</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>sample id </td>
            <td>sample uid</td>
            <td>sample price</td>
            <td>sample Pmode</td>
            <td>sample Pstats</td>
            <td>sample Cdate</td>
            <td>sample Pdate</td>
            <td>sample Receipt</td>
            <td>sample status</td>
            <td>
            <div class="dropdown">
            <select name="reasons" id="reasons">
            <option value="blank"></option>
            <option value="reason1">Change of mind</option>
            <option value="reason2">Wrong Address</option>
            <option value="reason3">Found a cheaper option</option>
            </select>
            </div>
            </td>
            <td>
              <table>
                <tr>
                <th><button class="button-9" role="button">Yes</button></th>
                <th><button class="button-9" role="button">No</button></th></tr></table>
          </td>
        </tr>
    </tbody>
</table></center>
</div>
    </div>
  )
}

export default CancelOrders
