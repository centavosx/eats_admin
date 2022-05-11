import { TopNav } from '../components/Navigation'
import Content, { Row, CardNum, Rankings, Graph } from '../components/Content'
import Footer from '../components/Footer'
import React, { useState } from 'react'
import socket from '../socket'
import axios from 'axios'
const Dashboard = (props) => {
  const [transnum, setTransnum] = useState(0)
  const [advancenum, setAdvnum] = useState(0)
  const [totalNum, setTotalNum] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [products, setProducts] = useState([])
  const [feedBackNum, setFeedBackNum] = useState(0)
  const [topUsers, setTopUsers] = useState([])
  const [critical, setCritical] = useState([])
  const [users, setUsers] = useState([])
  React.useEffect(() => {
    setTotalNum(transnum + advancenum)
  }, [transnum, advancenum])
  React.useEffect(() => {
    getUsers()
    getProducts()
    getNumberOfTrans()
    getNumberOfAdv()
    getFeedbacksNumber()
    getTopUsers()
    getCriticalProducts()

    socket.on('numberofadvance', (data) => {
      setAdvnum(Number(data))
    })
    socket.on('numberoftransaction', (data) => {
      setTransnum(Number(data))
    })
    socket.on('registered', (data) => {
      setTotalUsers(Number(data))
    })
    socket.on('productssortsold', (data) => {
      setProducts(data)
    })
    socket.on('criticalproducts', (data) => {
      setCritical(data)
    })
    socket.on('feedbacknumber', (data) => {
      setFeedBackNum(data)
    })
  }, [])

  const getNumberOfTrans = async () => {
    try {
      const resp = await axios.get(
        process.env.REACT_APP_API + 'numberoftransactions'
      )
      setTransnum(resp.data.num)
    } catch {
      setTransnum(0)
    }
  }
  const getNumberOfAdv = async () => {
    try {
      const resp = await axios.get(
        process.env.REACT_APP_API + 'numberofadvance'
      )
      setAdvnum(resp.data.num)
    } catch {
      setAdvnum(0)
    }
  }
  const getUsers = async () => {
    try {
      const resp = await axios.get(
        process.env.REACT_APP_API + 'countRegistered'
      )
      setTotalUsers(resp.data.num)
    } catch {
      setTotalUsers(0)
    }
  }
  const getProducts = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_API + 'getAllprods')
      setProducts(resp.data)
    } catch {
      setProducts([])
    }
  }
  const getFeedbacksNumber = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_API + 'feedbacknumber')
      setFeedBackNum(resp.data.num)
    } catch {
      setFeedBackNum(0)
    }
  }
  const getTopUsers = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_API + 'getTopBuyer')
      let x = []
      for (let v in resp.data) {
        if (v > 9) {
          break
        }
        x.push(resp.data[v])
      }
      setUsers(resp.data)
      setTopUsers(x)
    } catch {
      setTopUsers([])
    }
    socket.on('topbuyers', (data) => {
      let x2 = []
      for (let v in data) {
        if (v > 9) {
          break
        }
        x2.push(data[v])
      }
      setUsers(data)
      setTopUsers(x2)
    })
  }
  const getCriticalProducts = async () => {
    try {
      const resp = await axios.get(
        process.env.REACT_APP_API + 'getCriticalProducts'
      )
      setCritical(resp.data)
    } catch {
      setCritical([])
    }
  }
  return (
    <div className="main-panel">
      <Content>
        <Row>
          <CardNum
            title="Users"
            value={totalUsers}
            icon="nc-single-02"
            footer={true}
            desc="Total # of users"
            color="blue"
          />
          <CardNum
            title="Products"
            value={products.length}
            icon="nc-box-2"
            footer={true}
            desc="Total # of products"
            color="green"
          />
          <CardNum
            title="Transactions"
            value={totalNum}
            icon="nc-delivery-fast"
            footer={true}
            desc="Total # of transactions made"
            color="orange"
          />
          <CardNum
            title="Feedbacks"
            value={feedBackNum}
            icon="nc-chat-33"
            footer={true}
            desc="Total # of feedbacks"
            color="grey"
          />
        </Row>
        <Row>
          <Graph />
          <Rankings
            title="Top Users"
            desc="Users who spent the most money"
            items={topUsers.map((data, index) =>
              index < 10 ? data.name : null
            )}
            items2={topUsers.map((data) => 'Php' + data.totalspent?.toFixed(2))}
          />
        </Row>
        <Row>
          <Rankings
            title="Products"
            desc="Number of sold per product"
            items={products.map((data) => data[1].title)}
            items2={products.map((data) => data[1].totalsold + ' items')}
          />{' '}
          <Rankings
            title="Critical Products"
            desc="Products that are in the critical limit"
            items={critical.map((data) => data.title)}
            items2={critical.map((data) => data.numberofitems + ' stock')}
          />{' '}
          <Rankings
            title="Registered Users"
            desc="Users registered in the website"
            items={users.map((data) => data.name)}
          />
        </Row>
      </Content>
      <Footer />
    </div>
  )
}
export default Dashboard
