import axios from 'axios'
import React, { useState } from 'react'
import Content, { Row, FormInput } from '../components/Content'
import { Table } from '../components/Table'
import socket from '../socket'

const Inventories = () => {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState(null)
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [supp, setSupp] = useState(null)
  const [categ, setCateg] = useState(null)
  const [imgurl, setImgurl] = useState('')
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [critical, setCritical] = useState('')
  const [editProd, setEditProd] = useState([false, null])
  const isNumberKey = (evt) => {
    const numbers = '1234567890.'
    return (
      numbers.includes(evt.nativeEvent.data) || evt.nativeEvent.data === null
    )
  }
  const NumberFormat = (n) => {
    try {
      let g = n.toString().split('.')
      let x = g[0].split('')
      x = x.reverse()
      if (x.length > 3) {
        for (let i = 3; i < x.length; i += 4) {
          x.splice(i, 0, ',')
        }
      }
      x.reverse()
      return g.length === 2 ? x.join('') + '.' + g[1] : x.join('')
    } catch {
      return '0'
    }
  }
  const RemoveComma = (v) => {
    let g = v.toString().split(',')
    return g.join('')
  }
  React.useEffect(() => {
    getProducts()
    getSuppliers()
    getCategories()
    socket.on('products', (data) => {
      setProducts(data)
    })
  }, [])
  const getProducts = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_LOCAL + 'getWhat', {
        params: {
          what: 'products',
        },
      })
      setProducts(resp.data.data)
    } catch {
      setProducts([])
    }
  }
  const getCategories = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_LOCAL + 'getWhat', {
        params: {
          what: 'categories',
        },
      })
      console.log(resp.data)
      setCategories(resp.data.data)
    } catch {
      setCategories([])
    }
  }
  const getSuppliers = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_LOCAL + 'getWhat', {
        params: {
          what: 'suppliers',
        },
      })
      console.log(resp.data)
      setSuppliers(resp.data.data)
    } catch {
      setSuppliers([])
    }
  }
  const filechange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.onload = function (e) {
        setImgurl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const AddCart = async (e) => {
    e.preventDefault()
    if (
      image === null ||
      name.length <= 0 ||
      desc.length <= 0 ||
      supp === null ||
      supp === 'null' ||
      categ === 'null' ||
      categ === null ||
      price.length <= 0 ||
      qty.length <= 0 ||
      critical <= 0
    )
      return alert('Fill up all the blanks')
    try {
      const set = {
        title: name,
        desc: desc,
        seller: supp,
        price: Number(RemoveComma(price)),
        itemnum: Number(RemoveComma(qty)),
        type: categ,
        n: image.name,
        c: Number(RemoveComma(critical)),
      }
      const form = new FormData()
      form.append('image', image)
      form.append('set', JSON.stringify(set))
      const resp = await axios.post(
        process.env.REACT_APP_LOCAL + 'add-products',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (!resp.data.success) return alert('Failed')
      Reset()
      return alert('Successful')
    } catch {
      return alert('Failed')
    }
  }
  const deleteItem = async (id) => {
    try {
      await axios.delete(process.env.REACT_APP_LOCAL + 'deleteprod', {
        params: {
          id: id,
        },
      })
    } catch {}
  }
  const Reset = () => {
    setName('')
    setDesc('')
    setImage(null)
    setImgurl('')
    setCateg(null)
    setSupp(null)
    setQty('')
    setPrice('')
    setCritical('')
  }

  return (
    <div className="main-panel">
      <Content>
        <Row>
          {editProd[0] ? (
            <EditProduct
              categories={categories}
              suppliers={suppliers}
              data={editProd[1]}
              cancel={() => {
                Reset()
                setEditProd([false, null])
              }}
            />
          ) : (
            <div className="col-md-3">
              <div className="card card-user">
                <div className="card-header">
                  <h5 className="card-title">Add Product</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => AddCart(e)}>
                    <Row>
                      <FormInput
                        type="text"
                        label="Product Name"
                        placeHolder="Enter Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Row>
                    <Row>
                      <FormInput
                        type="text"
                        label="Description"
                        placeHolder="Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      />
                    </Row>
                    <Row>
                      <div className="col-md-12" style={{ padding: '10px' }}>
                        <center>
                          <img
                            src={imgurl}
                            style={{ width: '150px', height: '150px' }}
                          />
                        </center>
                      </div>
                    </Row>
                    <Row>
                      <FormInput
                        type="file"
                        label="Product Image"
                        placeHolder="Select Image"
                        onChange={(e) => filechange(e)}
                        accept="image/*"
                      />
                    </Row>

                    <Row>
                      <FormInput
                        type="text"
                        label="Quantity"
                        placeHolder="Quantity"
                        value={qty}
                        onChange={(e) =>
                          isNumberKey(e) ? setQty(e.target.value) : null
                        }
                        onFocusOut={() => setQty(NumberFormat(qty))}
                        onFocus={() => setQty(RemoveComma(qty))}
                      />
                    </Row>
                    <Row>
                      <FormInput
                        type="text"
                        label="Critical Amount"
                        placeHolder="Critical Amount"
                        value={critical}
                        onChange={(e) =>
                          isNumberKey(e) ? setCritical(e.target.value) : null
                        }
                        onFocusOut={() => setCritical(NumberFormat(critical))}
                        onFocus={() => setCritical(RemoveComma(critical))}
                      />
                    </Row>
                    <Row>
                      <FormInput
                        type="text"
                        label="Price"
                        placeHolder="Price"
                        value={price}
                        onChange={(e) =>
                          isNumberKey(e) ? setPrice(e.target.value) : null
                        }
                        onFocusOut={() => setPrice(NumberFormat(price))}
                        onFocus={() => setPrice(RemoveComma(price))}
                      />
                    </Row>
                    <Row>
                      <div className="col-md-12">
                        <label>Category</label>
                        <select
                          style={{ width: '100%' }}
                          onChange={(e) => setCateg(e.target.value)}
                        >
                          <option value={null} selected={categ === null}>
                            Select Category
                          </option>
                          {categories.map((data, index) => (
                            <option
                              value={data[1].name}
                              key={index}
                              selected={categ === data[1].name}
                            >
                              {data[1].name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Row>
                    <Row>
                      <div className="col-md-12">
                        <label>Supplier</label>
                        <select
                          style={{ width: '100%' }}
                          onChange={(e) => setSupp(e.target.value)}
                        >
                          <option value={null} selected={supp === null}>
                            Select Supplier
                          </option>
                          {suppliers.map((data, index) => (
                            <option
                              value={data[1].name}
                              key={index}
                              selected={supp === data[1].name}
                            >
                              {data[1].name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <button
                          type="submit"
                          className="btn btn-primary btn-round"
                        >
                          Update Profile
                        </button>
                      </div>
                    </Row>
                  </form>
                </div>
              </div>
            </div>
          )}
          <Table
            headers={[
              'Id',
              'Name',
              'Image',
              'Price',
              'Description',
              'Quantity',
              'Supplier',
              'Category',
              'Actions',
            ]}
            data={products}
            needed={[
              'id',
              'title',
              'link',
              'price',
              'description',
              'numberofitems',
              'seller',
              'type',
            ]}
            name="Products"
            maxHeight="680px"
            delete={deleteItem}
            edit={(v) => setEditProd(v)}
          />
        </Row>
      </Content>
    </div>
  )
}

const EditProduct = (props) => {
  const [data, setData] = useState(['', {}])
  React.useEffect(() => {
    setData(props.data)
  }, [props.data])

  return (
    <div className="col-md-3">
      <div className="card card-user">
        <div className="card-header">
          <h5 className="card-title">Edit Product</h5>
        </div>
        <div className="card-body">
          <form>
            <Row>
              <FormInput
                type="text"
                label="Product Name"
                placeHolder={data[1].title}
                onChange={(e) => (data[1].title = e.target.value)}
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Description"
                placeHolder={data[1].description}
                onChange={(e) => (data[1].description = e.target.value)}
              />
            </Row>
            <Row>
              <div className="col-md-12" style={{ padding: '10px' }}>
                <center>
                  <img
                    src={data[1].link}
                    style={{ width: '150px', height: '150px' }}
                  />
                </center>
              </div>
            </Row>
            <Row>
              <FormInput
                type="file"
                label="Product Image"
                placeHolder="Select Image"
                accept="image/*"
              />
            </Row>

            <Row>
              <FormInput
                type="text"
                label="Quantity"
                placeHolder={data[1].numberofitems}
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Critical Amount"
                placeHolder="Critical Amount"
                value={data[1].critical}
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Price"
                placeHolder="Price"
                value={data[1].price}
              />
            </Row>
            <Row>
              <div className="col-md-12">
                <label>Category</label>
                <select style={{ width: '100%' }}>
                  <option value={null} selected={data[1].type === null}>
                    Select Category
                  </option>
                  {props.categories.map((d, index) => (
                    <option
                      value={d[1].name}
                      key={index}
                      selected={d[1].name === data[1].type}
                    >
                      {d[1].name}
                    </option>
                  ))}
                </select>
              </div>
            </Row>
            <Row>
              <div className="col-md-12">
                <label>Supplier</label>
                <select style={{ width: '100%' }}>
                  <option value={null} selected={data[1].seller === null}>
                    Select Supplier
                  </option>
                  {props.suppliers.map((d, index) => (
                    <option
                      value={d[1].name}
                      key={index}
                      selected={d[1].name === data[1].seller}
                    >
                      {d[1].name}
                    </option>
                  ))}
                </select>
              </div>
            </Row>
            <Row>
              <div className="update ml-auto mr-auto">
                <button type="submit" className="btn btn-primary btn-round">
                  Update Product
                </button>
              </div>
            </Row>
            <Row>
              <div className="update ml-auto mr-auto">
                <button
                  type="submit"
                  className="btn btn-round"
                  style={{ backgroundColor: 'red' }}
                  onClick={props.cancel}
                >
                  Cancel
                </button>
              </div>
            </Row>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Inventories
