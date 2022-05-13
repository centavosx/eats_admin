import { CSVExport } from './ExportData'
export const Table = (props) => {
  return (
    <div className={props.size}>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">{props.name}</h4>
        </div>
        <div className="card-body">
          {props.inputText ? (
            <>
              <label>{props.label}</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                placeHolder={props.placeHolder}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
              />
              <br />
              {!props.nosubmit ? (
                <input
                  type="button"
                  className="form-control"
                  value="Submit"
                  onClick={props.Submit}
                  style={{ backgroundColor: 'green', color: 'white' }}
                />
              ) : null}
              <br />
            </>
          ) : null}
          {props.csv ? (
            <CSVExport
              headers={props.csv.headers}
              keyVals={props.csv.keyVals}
              data={props.csv.data}
              fileName={props.csv.fileName}
            />
          ) : null}
          <div
            className="table-responsive"
            style={{ maxHeight: props.maxHeight, overflow: 'auto' }}
          >
            <table className="table">
              <thead className=" text-primary">
                {props.headers.map((data, indexx) => (
                  <th key={indexx}>
                    <center>{data}</center>
                  </th>
                ))}
              </thead>
              <tbody>
                {props.data.map((data, i) =>
                  (props.searchVal ? props.searchVal(data) : true) ? (
                    <tr key={i}>
                      {props.needed.map((key, i2) => (
                        <td key={i2}>
                          <center>
                            {i2 === 0 ? (
                              <b>
                                {key === 'price' ? (
                                  'Php' + data[1][key]
                                ) : key === 'link' ||
                                  key === 'img' ||
                                  key === 'receipt' ? (
                                  <img
                                    src={data[1][key]}
                                    style={{ width: '200px', height: '150px' }}
                                  />
                                ) : (
                                  data[1][key]
                                )}
                              </b>
                            ) : key.toLowerCase().includes('price') ||
                              key.toLowerCase().includes('totalspent') ? (
                              'Php' + Number(data[1][key])?.toFixed(2)
                            ) : key === 'link' ||
                              key === 'img' ||
                              key === 'receipt' ? (
                              data[1][key] ? (
                                <img
                                  src={data[1][key]}
                                  style={{ width: '140px', height: '80px' }}
                                />
                              ) : (
                                'No Image'
                              )
                            ) : key.toLowerCase().includes('date') ? (
                              (key === 'dateDelivered' &&
                                data[1].status === 'Completed') ||
                              key !== 'dateDelivered' ? (
                                data[1][key] ? (
                                  <>
                                    {new Date(data[1][key]).toDateString()}{' '}
                                    {new Date(
                                      data[1][key]
                                    ).toLocaleTimeString()}
                                  </>
                                ) : (
                                  <>No date</>
                                )
                              ) : (
                                <>Not yet delivered</>
                              )
                            ) : key === 'addresses' ? (
                              <select style={{ width: '200px' }}>
                                {data[1][key] ? (
                                  Object.keys(data[1].addresses).map(
                                    (v, innn) => (
                                      <option key={innn}>
                                        {data[1].addresses[v].address}
                                      </option>
                                    )
                                  )
                                ) : (
                                  <option>No address</option>
                                )}
                              </select>
                            ) : key === 'deliveryfee' ? (
                              <select
                                onChange={(e) =>
                                  Number(e.target.value) !==
                                  Number(data[1].deliveryfee)
                                    ? props.changeFee([
                                        data[0],
                                        Number(e.target.value),
                                      ])
                                    : null
                                }
                              >
                                <option
                                  value={0}
                                  selected={
                                    !data[1].deliveryfee ||
                                    0 === Number(data[1].deliveryfee)
                                  }
                                >
                                  0
                                </option>
                                <option
                                  value={29}
                                  selected={29 === Number(data[1].deliveryfee)}
                                >
                                  29
                                </option>
                                <option
                                  value={39}
                                  selected={39 === Number(data[1].deliveryfee)}
                                >
                                  39
                                </option>
                                <option
                                  value={49}
                                  selected={49 === Number(data[1].deliveryfee)}
                                >
                                  49
                                </option>
                                <option
                                  value={59}
                                  selected={59 === Number(data[1].deliveryfee)}
                                >
                                  59
                                </option>
                                <option
                                  value={69}
                                  selected={69 === Number(data[1].deliveryfee)}
                                >
                                  69
                                </option>
                                <option
                                  value={79}
                                  selected={79 === Number(data[1].deliveryfee)}
                                >
                                  79
                                </option>
                                <option
                                  value={89}
                                  selected={89 === Number(data[1].deliveryfee)}
                                >
                                  89
                                </option>
                                <option
                                  value={99}
                                  selected={99 === Number(data[1].deliveryfee)}
                                >
                                  99
                                </option>
                              </select>
                            ) : key === 'status' ? (
                              <select
                                onChange={(e) =>
                                  e.target.value !== data[1].status
                                    ? !props.getindex
                                      ? props.changeStatus([
                                          data,
                                          e.target.value,
                                        ])
                                      : props.changeStatus({
                                          index: i,
                                          data: [data, e.target.value],
                                        })
                                    : null
                                }
                              >
                                <option
                                  value="Pending"
                                  selected={data[1].status === 'Pending'}
                                >
                                  Pending
                                </option>
                                <option
                                  value="Processing"
                                  selected={data[1].status === 'Processing'}
                                >
                                  Processing
                                </option>
                                <option
                                  value="Delivering"
                                  selected={data[1].status === 'Delivering'}
                                >
                                  Delivering
                                </option>
                                <option
                                  value="Completed"
                                  selected={data[1].status === 'Completed'}
                                >
                                  Completed
                                </option>
                                <option
                                  value="Cancelled"
                                  selected={data[1].status === 'Cancelled'}
                                >
                                  Cancelled
                                </option>
                              </select>
                            ) : key === 'pstatus' ? (
                              <select
                                onChange={(e) =>
                                  e.target.value !== data[1].pstatus
                                    ? props.changePStatus([
                                        data[0],
                                        e.target.value,
                                      ])
                                    : null
                                }
                              >
                                <option
                                  value="Paid"
                                  selected={data[1].pstatus === 'Paid'}
                                >
                                  Paid
                                </option>
                                <option
                                  value="Not Paid"
                                  selected={data[1].pstatus === 'Not Paid'}
                                >
                                  Not Paid
                                </option>
                              </select>
                            ) : key === 'discount' ? (
                              (data[1]['discount'] ?? 0) + '%'
                            ) : key === 'adv' ? (
                              <select>
                                {data[1].adv ? (
                                  Object.keys(data[1].adv).map((d3, i3) => (
                                    <option key={i3}>
                                      {new Date(
                                        data[1].adv[d3].date
                                      ).toDateString()}
                                    </option>
                                  ))
                                ) : (
                                  <option>No dates</option>
                                )}
                              </select>
                            ) : data[1][key] ? (
                              <input
                                type="text"
                                value={data[1][key]}
                                style={{
                                  border: 'none',
                                  width: '140px',
                                  textAlign: 'center',
                                }}
                                readOnly={true}
                              />
                            ) : (
                              '---'
                            )}
                          </center>
                        </td>
                      ))}
                      {props.headers.length > props.needed.length ? (
                        <td>
                          <center>
                            <div style={{ display: 'block' }}>
                              {props.showItem ? (
                                <p
                                  style={{
                                    marginRight: '10px',
                                    color: 'blue',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                  }}
                                  onClick={() => props.showItem(data)}
                                >
                                  Show items
                                </p>
                              ) : null}
                              {props.edit ? (
                                <p
                                  style={{
                                    marginRight: '10px',
                                    color: 'blue',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                  }}
                                  onClick={() => props.edit([true, data])}
                                >
                                  Edit
                                </p>
                              ) : null}{' '}
                              {props.delete ? (
                                <p
                                  style={{
                                    color: 'red',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                  }}
                                  onClick={() => props.delete(data[0])}
                                >
                                  Delete
                                </p>
                              ) : null}
                            </div>
                          </center>
                        </td>
                      ) : null}
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
