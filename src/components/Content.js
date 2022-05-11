import axios from 'axios'
import React, { useState } from 'react'

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

const Content = (props) => <div className="content">{props.children}</div>
export const Row = (props) => <div className="row">{props.children}</div>
export const CardNum = (props) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card card-stats">
        <div className="card-body ">
          <div className="row">
            <div className="col-5 col-md-4">
              <div className="icon-big text-center icon-warning">
                <i
                  className={`nc-icon ${props.icon}`}
                  style={{ color: props.color }}
                ></i>
              </div>
            </div>
            <div className="col-7 col-md-8">
              <div className="numbers">
                <p className="card-category">{props.title}</p>
                <p className="card-title">{props.value}</p>
              </div>
            </div>
          </div>
        </div>
        {props.footer ? (
          <div className="card-footer ">
            <hr />
            <div className="stats">{props.desc}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
const Bar = (props) => {
  const [show, setShow] = useState(false)
  return (
    <div
      style={{ display: 'block', textAlign: 'center' }}
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
      onMouseEnter={() => setShow(true)}
    >
      <div
        style={{
          height: ((Number(props.percentage) / 100) * 212).toString() + 'px',
          backgroundColor: 'blue',
          width: '50px',
          margin: '2px',
        }}
      ></div>
      {props.name}
      {show ? (
        <div
          style={{
            top: '180px',
            position: 'absolute',
            height: '70px',
            width: '110px',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '5px',
            marginLeft: '-20px',
          }}
        >
          Amount: <br />
          Php{props.price.toFixed(2)}
        </div>
      ) : null}
    </div>
  )
}
export const Graph = () => {
  const [graphObject, setGraphObject] = useState([])
  const [what, setWhat] = useState('Daily Track')
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState(0)
  const [overall, setOverall] = useState(0)
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  React.useEffect(() => {
    const getDate = async () => {
      setShow(false)
      try {
        const resp = await axios.get(
          process.env.REACT_APP_API + 'weeklyTransaction',
          {
            params: {
              date: new Date().toString(),
              what: 'TODAY',
            },
          }
        )
        setGraphObject(resp.data.data)
        setOverall(resp.data.overall)
      } catch {
        setGraphObject([])
        setOverall(0)
      }
      setShow(true)
    }
    getDate()
  }, [])

  const changeTrack = (v) => {
    setMonth(null)
    setYear(null)
    switch (v) {
      case 'Daily':
        setWhat('Daily Track')
        setValue(new Date().toString())
        break

      case 'Weekly':
        setWhat('Weekly Track')
        setValue(null)
        break
      case 'Monthly':
        setWhat('Monthly Track')
        setValue(null)
        break
      case 'Yearly':
        setWhat('Yearly Track')
        setValue(null)
        break
    }
  }

  const graph = async () => {
    setShow(false)
    try {
      switch (what) {
        case 'Daily Track':
          const resp = await axios.get(
            process.env.REACT_APP_API + 'weeklyTransaction',
            {
              params: {
                what: 'TODAY',
              },
            }
          )
          setGraphObject(resp.data.data)
          setOverall(resp.data.overall)
          break

        case 'Weekly Track':
          const weekresp = await axios.get(
            process.env.REACT_APP_API + 'weeklyTransaction',
            {
              params: {
                date: new Date(value).toISOString(),
              },
            }
          )
          setGraphObject(weekresp.data.data)
          setOverall(weekresp.data.overall)
          break
        case 'Monthly Track':
          const monthresp = await axios.get(
            process.env.REACT_APP_API + 'monthlyTransaction',
            {
              params: {
                month: month,
                year: year,
              },
            }
          )
          setGraphObject(monthresp.data.data)
          setOverall(monthresp.data.overall)
          break
        case 'Yearly Track':
          const yearlyresp = await axios.get(
            process.env.REACT_APP_API + 'yearlyTransaction',
            {
              params: {
                year: year,
              },
            }
          )
          setGraphObject(yearlyresp.data.data)
          setOverall(yearlyresp.data.overall)
          break
      }
    } catch {
      setGraphObject([])
      setOverall(0)
    }
    setShow(true)
  }
  return (
    <div className="col-md-8">
      <div className="card card-chart" style={{ overflow: 'auto' }}>
        <div className="card-header">
          <h5 className="card-title">Bar Graph</h5>
          <p className="card-category">{what}</p>
          <h6 className="card-title">
            {what.toLowerCase().includes('daily') ? 'Today' : null}
            {what.toLowerCase().includes('week')
              ? value !== null
                ? new Date(value).toDateString()
                : null
              : null}
            {what.toLowerCase().includes('month')
              ? (months[month] ?? '') + ' ' + (year !== null ? year : '')
              : null}
            {what.toLowerCase().includes('year') ? year : null}
            &nbsp;
            <select onChange={(e) => changeTrack(e.target.value)}>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>{' '}
            &nbsp;
            {what.toLowerCase().includes('year') ? (
              <input
                type="number"
                onChange={(e) => setYear(Number(e.target.value))}
              />
            ) : what.toLowerCase().includes('week') ? (
              <input type="date" onChange={(e) => setValue(e.target.value)} />
            ) : what.toLowerCase().includes('month') ? (
              <>
                <select onChange={(e) => setMonth(Number(e.target.value))}>
                  <option value={null}>Select Month</option>
                  {Object.keys(months).map((data, index) => (
                    <option key={index} value={data}>
                      {months[data]}
                    </option>
                  ))}
                </select>
                &nbsp;
                <input
                  type="number"
                  placeholder="Year"
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </>
            ) : null}
            &nbsp;
            {show ? (
              <input type="button" value={'Graph'} onClick={() => graph()} />
            ) : (
              <span>Graphing...</span>
            )}
          </h6>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'block', alignItems: 'flex-end' }}>
              {[100, 80, 60, 40, 20, 0].map((data, index) => (
                <div
                  key={index}
                  style={{
                    height: '29px',
                    marginTop: '13px',
                    marginRight: '10px',
                    marginBottom: '3px',
                    fontSize: '11px',
                  }}
                >
                  {data}% -
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              {Object.keys(graphObject).map((data, index) => (
                <Bar
                  key={index}
                  percentage={
                    graphObject[data].percentage !== null
                      ? graphObject[data].percentage
                      : 0
                  }
                  price={graphObject[data].total}
                  name={graphObject[data].day}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <hr />
          <div className="card-stats">
            Total Money : Php {overall.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
export const Rankings = (props) => {
  return (
    <div className="col-md-4">
      <div className="card ">
        <div className="card-header ">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-category">{props.desc}</p>
        </div>
        <div
          className="card-body "
          style={{ maxHeight: '300px', overflow: 'auto' }}
        >
          {props.items?.map((data, index) => (
            <p key={index}>
              {index + 1}. {data} {props.items2 ? ' - ' : null}{' '}
              <b>{props.items2 ? props.items2[index] ?? null : null}</b>
              <br />
            </p>
          ))}
        </div>

        <div className="card-footer ">
          <hr />
          <div className="stats">{props.desc}</div>
        </div>
      </div>
    </div>
  )
}
export const FormInput = (props) => {
  return (
    <div className="col-md-12">
      <label>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        className="form-control"
        placeHolder={props.placeHolder}
        value={props.value}
        onChange={(v) => props.onChange(v)}
        onBlur={props.onFocusOut}
        onFocus={props.onFocus}
        accept={props.accept}
      />
    </div>
  )
}

export default Content
