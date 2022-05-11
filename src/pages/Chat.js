import axios from 'axios'
import React, { useRef, useState } from 'react'
import Content from '../components/Content'
import socket from '../socket'
const Chat = () => {
  const [data, setData] = useState([])
  const [id, setId] = useState(null)
  const [profileDetails, setProfileDetails] = useState({})
  const [userid, setUserId] = useState('')
  const [search, setSearch] = useState('')
  React.useEffect(() => {
    getChats()
    socket.on('dataChat', (data) => {
      let arr = []
      for (let x in data[0]) {
        const obj = {
          id: data[0][x],
          unreadnum: data[1][x],
          latestchat: data[2][x],
          userprof: data[3][x],
        }
        arr.push(obj)
      }
      setData(arr)
    })
  }, [])
  const getChats = async () => {
    const resp = await axios.get(process.env.REACT_APP_API + 'getUserChats')
    let data = resp.data
    let arr = []
    for (let x in data[0]) {
      const obj = {
        id: data[0][x],
        unreadnum: data[1][x],
        latestchat: data[2][x],
        userprof: data[3][x],
      }

      arr.push(obj)
    }

    if (data[0].length > 0) {
      setProfileDetails(data[3][0])
      setId(data[0][0])
    }

    setData(arr)
  }
  React.useEffect(() => {
    if (id !== null) readChat(id)
  }, [id])
  const readChat = async (id) => {
    await axios.patch(process.env.REACT_APP_API + 'readbya', {
      id: id,
    })
  }
  const addUser = async () => {
    if (userid.length > 0) {
      const resp = await axios.post(process.env.REACT_APP_API + 'addChat', {
        id: userid,
      })
      if (!resp.data) alert("User doesn't exist")
      setUserId('')
    }
  }
  return (
    <div className="main-panel">
      <Content>
        <div className="messaging">
          <div className="inbox_msg">
            <div className="inbox_people">
              <div className="headind_srch">
                <div className="recent_heading">
                  <h4>Recent</h4>
                </div>
                <div className="srch_bar">
                  <div className="stylish-input-group">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Add User"
                      value={userid}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                    <span className="input-group-addon">
                      <button type="button" onClick={() => addUser()}>
                        {' '}
                        <i className="fa fa-send" aria-hidden="true"></i>{' '}
                      </button>
                    </span>{' '}
                  </div>
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="inbox_chat">
                {data.map((d, key) =>
                  search.length <= 0 ||
                  d.userprof.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ? (
                    <UserChat
                      unreadnumber={d.unreadnum > 0 ? d.unreadnum : null}
                      onClick={() => {
                        setId(d.id)
                        setProfileDetails(d.userprof)
                      }}
                      key={key}
                      read={d.latestchat[3]}
                      active={d.id === id}
                      date={d.latestchat[2]}
                      msg={d.latestchat[1]}
                      name={d.userprof.name}
                      img={d.userprof.img}
                    />
                  ) : null
                )}
              </div>
            </div>

            <div className="mesgs">
              <Messages
                id={id}
                profile={profileDetails}
                seen={() => readChat(id)}
              />
            </div>
          </div>
        </div>
      </Content>
    </div>
  )
}
const UserChat = (props) => {
  return (
    <div
      className={props.active ? 'chat_list active_chat' : 'chat_list'}
      onClick={props.onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="chat_people">
        <div className="chat_img">
          {' '}
          <b style={{ color: 'red' }}>{props.unreadnumber}</b>
          <img
            src={
              props.img ??
              'http://eats-onlineph.herokuapp.com/assets/eatsonlinelogo.png'
            }
            alt="sunil"
          />{' '}
        </div>
        <div className="chat_ib">
          <h5>
            {props.name}{' '}
            <span className="chat_date">
              {new Date(props.date).toDateString()}{' '}
              {new Date(props.date).toLocaleTimeString()}
            </span>
          </h5>
          {props.read ? (
            <p>{props.msg}</p>
          ) : (
            <p>
              <b>{props.msg}</b>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
const Messages = (props) => {
  const [dataMSG, setData] = useState([])
  const [newChat, setNewChat] = useState({})
  const [chat, setChat] = useState('')
  const ref = useRef()
  React.useEffect(() => {
    if (props.id !== null) {
      setChat('')
      setData([])
      getChat()
      // socket.on(`newchat/${props.id}`, (data) => {
      //   console.log('helo')
      //   setData(data)
      // })

      socket.emit('chat', props.id)
      socket.on(`newchat/${props.id}`, (d) => {
        setNewChat(d[1])
      })
    }
  }, [props.id])
  React.useEffect(() => {
    if (Object.keys(newChat).length > 0) {
      setData([...dataMSG, newChat])
      setNewChat({})
    }
  }, [newChat])
  React.useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight
  }, [dataMSG])
  const getChat = async () => {
    const resp = await axios.post(process.env.REACT_APP_API + 'getSingleChat', {
      id: props.id,
    })
    setData(resp.data)
  }
  const sendMessage = async () => {
    if (chat.length > 0) {
      await axios.post(process.env.REACT_APP_API + 'sendChat', {
        id: props.id,
        m: chat,
      })
      setChat('')
    }
  }
  return (
    <>
      <div className="msg_history" ref={ref}>
        {dataMSG.map((d) =>
          d.who === 'user' ? (
            <Incoming
              msg={d.message}
              date={d.date}
              img={props.profile.img}
              name={props.profile?.name}
            />
          ) : (
            <OutGoing msg={d.message} date={d.date} />
          )
        )}
      </div>
      <div className="type_msg">
        <div className="input_msg_write" style={{ display: 'flex' }}>
          <textarea
            type="text"
            className="write_msg"
            placeholder="Type a message"
            value={chat}
            style={{ width: '100%' }}
            onChange={(e) => setChat(e.target.value)}
            onClick={props.seen}
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
            onClick={() => sendMessage()}
          >
            <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </>
  )
}
const OutGoing = (props) => (
  <div className="outgoing_msg">
    <div className="sent_msg">
      <p>{props.msg}</p>
      <span className="time_date">
        {new Date(props.date).toDateString()}{' '}
        {new Date(props.date).toLocaleTimeString()}
      </span>{' '}
    </div>
  </div>
)
const Incoming = (props) => (
  <div className="incoming_msg" style={{ margin: '10px' }}>
    <div className="incoming_msg_img">
      {' '}
      <img
        src={
          props.img ??
          'http://eats-onlineph.herokuapp.com/assets/eatsonlinelogo.png'
        }
        alt="sunil"
      />{' '}
    </div>
    <div className="received_msg">
      <b>{props.name}</b>
      <div className="received_withd_msg">
        <p>{props.msg}</p>
        <span className="time_date">
          {' '}
          {new Date(props.date).toDateString()}{' '}
          {new Date(props.date).toLocaleTimeString()}
        </span>
      </div>
    </div>
  </div>
)
export default Chat
