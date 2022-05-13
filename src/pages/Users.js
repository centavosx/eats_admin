import { Table } from '../components/Table'
import Content, { Row } from '../components/Content'
import React, { useState } from 'react'
import axios from 'axios'
import socket from '../socket'
const Users = (props) => {
  const [data, setData] = useState([])
  const [dataToExport, setDataToExport] = useState([])
  React.useEffect(() => {
    if (data.length > 0) {
      setDataToExport(
        data.map((v) => {
          return {
            id: v[1].id,
            name: v[1].name,
            email: v[1].email,
            phone: v[1].phone?.replaceAll(',', ' ') ?? '',
            address: v[1].addresses
              ? Object.keys(v[1].addresses)
                  .map(
                    (v2, i) =>
                      i +
                      1 +
                      '. ' +
                      v[1].addresses[v2].address.replaceAll(',', ' ')
                  )
                  .join(' ')
              : '',
            dateRegistered: v[1].dateCreated
              ? new Date(v[1].dateCreated).toDateString() +
                ' ' +
                new Date(v[1].dateCreated).toLocaleTimeString()
              : 'No date',
            verified: v[1].verified ? 'Yes' : 'No',
            spent: v[1].totalspent,
          }
        })
      )
    }
  }, [data])

  const [search, setSearch] = useState('')
  React.useEffect(() => {
    getAccount()
    socket.on('users', (data) => setData(data))
  }, [])
  const getAccount = async () => {
    const resp = await axios.get(process.env.REACT_APP_API + 'getAllAccounts')
    setData(resp.data)
  }
  const deleteUser = async (id) => {
    await axios.delete(process.env.REACT_APP_API + 'deleteUser', {
      params: {
        id: id,
      },
    })
  }

  const searchUser = (data) => {
    if (
      data[1].name.toLowerCase().includes(search.toLowerCase()) ||
      data[1].id.toLowerCase().includes(search.toLowerCase()) ||
      data[1].email.toLowerCase().includes(search.toLowerCase())
    )
      return true
    return false
  }
  return (
    <div className="main-panel">
      <Content>
        <Row>
          <Table
            csv={{
              headers: [
                'Id',
                'Name',
                'Email',
                'Phone Number',
                'Address',
                'Registration Date',
                'Verified',
                'Spent',
              ],
              keyVals: [
                'id',
                'name',
                'email',
                'phone',
                'address',
                'dateRegistered',
                'verified',
                'spent',
              ],
              data: dataToExport,

              fileName: 'UserAccounts',
            }}
            nosubmit={true}
            placeHolder="Search Id, Name, Email"
            value={search}
            onChange={(v) => setSearch(v)}
            searchVal={searchUser}
            inputText={true}
            maxHeight="680px"
            size="col-md-12"
            headers={[
              'Id',
              'Image',
              'Name',
              'Email',
              'Phone Number',
              'Address',
              'Registration Date',
              'Verified',
              'Total Spent',
              'Actions',
            ]}
            data={data}
            // data={products}
            needed={[
              'id',
              'img',
              'name',
              'email',
              'phoneNumber',
              'addresses',
              'dateCreated',
              'verified',
              'totalspent',
            ]}
            name={'Users'}
            delete={deleteUser}
            // changeStatus={(v) => updateStatus(v[0], v[1])}
            // changePStatus={(v) => updatePaymentStatus(v[0], v[1])}
            // changeFee={(v) => setFee(v[0], v[1])}
            // showItem={(v) => setSecondData(v)}
            // delete={deleteItem}
            // edit={(v) => setEditProd(v)}
          />
        </Row>
      </Content>
    </div>
  )
}
export default Users
