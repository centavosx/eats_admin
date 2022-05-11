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
              <input
                type="button"
                className="form-control"
                value="Submit"
                onClick={props.Submit}
                style={{ backgroundColor: 'green', color: 'white' }}
              />
              <br />
            </>
          ) : null}
          <div
            className="table-responsive"
            style={{ maxHeight: props.maxHeight, overflow: 'auto' }}
          >
            <table className="table">
              <thead className=" text-primary">
                {props.headers.map((data) => (
                  <th>
                    <center>{data}</center>
                  </th>
                ))}
              </thead>
              <tbody>
                {props.data.map((data, i) => (
                  <tr key={i}>
                    {props.needed.map((key, i2) => (
                      <td key={i2}>
                        <center>
                          {i2 === 0 ? (
                            <b>
                              {key === 'price' ? (
                                'Php' + data[1][key]
                              ) : key === 'link' ? (
                                <img
                                  src={data[1][key]}
                                  style={{ width: '200px', height: '100px' }}
                                />
                              ) : (
                                data[1][key]
                              )}
                            </b>
                          ) : key === 'price' ? (
                            'Php' + data[1][key]
                          ) : key === 'link' ? (
                            <img
                              src={data[1][key]}
                              style={{ width: '200px', height: '80px' }}
                            />
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
                          ) : (
                            data[1][key]
                          )}
                        </center>
                      </td>
                    ))}
                    <td>
                      <center>
                        <div style={{ display: 'block' }}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
