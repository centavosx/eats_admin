export const Table = (props) => {
  return (
    <div className="col-md-9">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">{props.name}</h4>
        </div>
        <div className="card-body">
          <div
            className="table-responsive"
            style={{ maxHeight: props.maxHeight, overflow: 'auto' }}
          >
            <table className="table">
              <thead className=" text-primary">
                {props.headers.map((data) => (
                  <th>{data}</th>
                ))}
              </thead>
              <tbody>
                {props.data.map((data, i) => (
                  <tr key={i}>
                    {props.needed.map((key, i2) => (
                      <td key={i2}>
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
                            style={{ width: '200px', height: '100px' }}
                          />
                        ) : (
                          data[1][key]
                        )}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex' }}>
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
                        </p>{' '}
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
                      </div>
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
