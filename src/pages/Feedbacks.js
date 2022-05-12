import axios from 'axios'
import React, { useState } from 'react'
import Content, { Row } from '../components/Content'
import socket from '../socket'
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [id, setId] = useState(null)
  const [msgdata, setMsgData] = useState({})
  const [msg, setMsg] = useState('')
  React.useEffect(() => {
    getFeedbacks()
    socket.on('feedbacks', (data) => {
      setFeedbacks(data)
    })
  }, [])
  const getFeedbacks = async () => {
    const resp = await axios.get(process.env.REACT_APP_API + 'getFeedBacks')
    setFeedbacks(resp.data)
  }
  const send = () => {
    if (msg.length <= 0 || id == null) return
    let newD = { ...msgdata }
    newD.key = id
    newD.answer = msg
    delete newD.date_created
    axios.post(process.env.REACT_APP_API + 'sendFeedback', {
      data: newD,
    })
  }
  return (
    <div className="main-panel">
      <Content>
        {' '}
        <Row>
          <div className="col-md-6" style={{ padding: '10px' }}>
            <div className="card card-user">
              <div className="card-header">
                <h5 className="card-title">Feedbacks</h5>
              </div>
              <div
                className="card-body"
                style={{ height: '550px', overflow: 'auto' }}
              >
                {feedbacks.map((data, index) => (
                  <BoxShadow key={index}>
                    <div className="alert alert-primary alert-dismissible fade show">
                      {!data[1].reply ? (
                        id !== data[0] ? (
                          <button
                            className="close"
                            style={{ width: '50px' }}
                            onClick={() => {
                              setMsg('')
                              setId(data[0])
                              setMsgData(data[1])
                            }}
                          >
                            <p style={{ textAlign: 'end', fontSize: '11px' }}>
                              Reply
                            </p>
                          </button>
                        ) : (
                          <button
                            className="close"
                            style={{ width: '50px' }}
                            onClick={() => {
                              setId(null)
                              setMsgData({})
                            }}
                          >
                            <i className="nc-icon nc-simple-remove"></i>
                          </button>
                        )
                      ) : null}
                      <span>
                        <span style={{ fontSize: '18px' }}>
                          <b>{data[1].subject}</b>
                        </span>
                        <br />
                        <b> {data[1].name}</b>
                        <br />
                        <span style={{ fontSize: '11px' }}>
                          {data[1].email}
                        </span>
                        <br />
                        <span style={{ fontSize: '10px', color: 'grey' }}>
                          {new Date(data[1].date_created).toDateString()}{' '}
                          {new Date(data[1].date_created).toLocaleTimeString()}
                        </span>
                        <br />
                        <br />
                        {data[1].message}
                      </span>
                    </div>
                    {data[1].reply ? (
                      <div className="alert alert-success">
                        <span>
                          Replied: <br />{' '}
                          <span style={{ fontSize: '10px', color: 'grey' }}>
                            {new Date(data[1].reply.date).toDateString()}{' '}
                            {new Date(data[1].reply.date).toLocaleTimeString()}
                          </span>{' '}
                          <br />
                          {data[1].reply.answer}
                        </span>
                      </div>
                    ) : data[0] === id ? (
                      <div className="type_msg" style={{ border: 'none' }}>
                        <div
                          className="input_msg_write"
                          style={{ display: 'flex', border: 'none' }}
                        >
                          <textarea
                            type="text"
                            className="write_msg"
                            placeholder="Type a message"
                            value={msg}
                            style={{ width: '100%', padding: '5px' }}
                            onChange={(e) => setMsg(e.target.value)}
                            //   onClick={props.seen}
                          />
                          <button
                            type="button"
                            style={{
                              borderRadius: '30px',
                              width: '45px',
                              border: 'none',
                              backgroundColor: 'skyblue',
                              margin: '3px',
                            }}
                            onClick={() => send()}
                          >
                            <i
                              className="fa fa-paper-plane-o"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </BoxShadow>
                ))}
              </div>
            </div>
          </div>

          <Reviews />
        </Row>
      </Content>
    </div>
  )
}
const BoxShadow = (props) => (
  <div
    className="card card-user"
    style={{
      padding: '10px',
      boxShadow: '2px 3px 4px 1px #888888',
    }}
  >
    {props.children}
  </div>
)

const Reviews = () => {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  React.useEffect(() => {
    getReviews()
    socket.on('reviews', (data) => {
      setData(data)
    })
  }, [])
  const getReviews = async () => {
    const resp = await axios.get(process.env.REACT_APP_API + 'getReviews')

    setData(resp.data)
  }
  return (
    <div className="col-md-6" style={{ padding: '10px' }}>
      <div className="card card-user">
        <div className="card-header">
          <h5 className="card-title">Product Reviews</h5>
        </div>

        <div
          className="card-body"
          style={{ height: '550px', overflow: 'auto' }}
        >
          <input
            type="text"
            className="form-control"
            placeHolder="Search product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <br />
          {data.map((d, i) =>
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            search.length <= 0 ? (
              <div key={i} className="alert alert-danger">
                <Row style={{ padding: '10px' }}>
                  <Content>
                    <span style={{ fontSize: '18px' }}>
                      <b>{d.title}</b>
                    </span>
                    <br />
                    <span>
                      {d.avgrating !== null ? d.avgrating : '0'}/5 Ratings
                    </span>
                    <br />
                    <br />
                    <span>Comments</span>
                  </Content>
                  <div
                    className="col-md-12"
                    style={{
                      padding: '10px',
                      backgroundColor: 'white',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                  >
                    {d.comments ? (
                      d.comments.length > 0 ? (
                        d.comments.map((msg, index) => (
                          <div key={index} className="alert alert-info">
                            <b>
                              {msg.id}{' '}
                              {msg.user.length > 18
                                ? msg.user.substr(0, 18) + '...'
                                : msg.user}
                            </b>
                            <br />
                            <span style={{ fontSize: '11px' }}>
                              {msg.email}
                            </span>
                            <br />
                            <span style={{ fontSize: '11px' }}>
                              Rating {msg.rating}/5
                            </span>
                            <br />
                            <span style={{ fontSize: '10px', color: 'grey' }}>
                              {new Date(msg.date).toDateString()}{' '}
                              {new Date(msg.date).toLocaleTimeString()}
                            </span>
                            <br />
                            <br />
                            {msg.message}
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'black' }}>No Comments</p>
                      )
                    ) : (
                      <p style={{ color: 'black' }}>No Comments</p>
                    )}
                  </div>
                </Row>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
export default Feedbacks
