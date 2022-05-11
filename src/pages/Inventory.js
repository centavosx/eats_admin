import axios from 'axios'
import React, { useState } from 'react'
import Content, { Row, FormInput } from '../components/Content'
import { Table } from '../components/Table'
import { encryptJSON } from '../encryption'
import socket from '../socket'

const Inventories = () => {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState(null)
  const [discount, setDiscount] = useState(0)
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
  const [categoryN, setCategoryN] = useState('')
  const [supplierN, setSupplierN] = useState('')

  const addSupplierOrCateg = async (what, data, val) => {
    await axios.post(process.env.REACT_APP_API + 'addsupplierorcategory', {
      wh: what,
      d: { name: data },
    })
    val('')
  }
  const deleteSuppOrCat = async (what, id) => {
    await axios.delete(process.env.REACT_APP_API + 'removebyid', {
      params: {
        what,
        id: id,
      },
    })
  }

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
    socket.on('suppliers', (data) => {
      setSuppliers(data)
    })
    socket.on('categories', (data) => {
      setCategories(data)
    })
  }, [])
  React.useEffect(() => {
    try {
      Reset()
    } catch {}
  }, [editProd])
  const getProducts = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_API + 'getWhat', {
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
      const resp = await axios.get(process.env.REACT_APP_API + 'getWhat', {
        params: {
          what: 'categories',
        },
      })
      setCategories(resp.data.data)
    } catch {
      setCategories([])
    }
  }
  const getSuppliers = async () => {
    try {
      const resp = await axios.get(process.env.REACT_APP_API + 'getWhat', {
        params: {
          what: 'suppliers',
        },
      })

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
        discount: Number(discount),
        type: categ,
        n: image.name,
        c: Number(RemoveComma(critical)),
      }
      const form = new FormData()
      form.append('image', image)
      form.append('set', JSON.stringify(set))
      const resp = await axios.post(
        process.env.REACT_APP_API + 'add-products',
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
      await axios.delete(process.env.REACT_APP_API + 'deleteprod', {
        params: {
          id: id,
        },
      })
    } catch {}
  }
  const Reset = () => {
    document.getElementById('imgfile').value = null
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
                setEditProd([false, null])
              }}
              NumberFormat={NumberFormat}
              RemoveComma={RemoveComma}
              isNumberKey={isNumberKey}
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
                        id="imgfile"
                        type="file"
                        label="Product Image"
                        placeHolder="Select Image"
                        onChange={(e) => filechange(e)}
                        accept="image/*"
                      />
                    </Row>
                    <Row>
                      <FormInput
                        type="number"
                        label="Discount"
                        placeHolder="Discount in %"
                        value={Number(discount)}
                        onChange={(e) =>
                          e.target.value <= 0
                            ? setDiscount(0)
                            : e.target.value >= 100
                            ? setDiscount(100)
                            : setDiscount(e.target.value)
                        }
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
            size="col-md-9"
            headers={[
              'Id',
              'Name',
              'Image',
              'Price',
              'Discount',
              'Description',
              'Quantity',
              'Critical Amount',
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
              'discount',
              'description',
              'numberofitems',
              'critical',
              'seller',
              'type',
            ]}
            name="Products"
            maxHeight="680px"
            delete={deleteItem}
            edit={(v) => setEditProd(v)}
          />
        </Row>

        <Row>
          <Table
            size="col-md-6"
            headers={['Id', 'Name', 'Actions']}
            data={suppliers}
            needed={['id', 'name']}
            name="Suppliers"
            maxHeight="380px"
            delete={(v) => deleteSuppOrCat('suppliers', v)}
            noedit={true}
            inputText={true}
            value={supplierN}
            placeHolder="Type Supplier Name"
            label="Add Supplier"
            onChange={(v) => setSupplierN(v)}
            Submit={() =>
              supplierN.length > 0
                ? addSupplierOrCateg('suppliers', supplierN, setSupplierN)
                : null
            }
          />
          <Table
            size="col-md-6"
            headers={['Id', 'Name', 'Actions']}
            data={categories}
            needed={['id', 'name']}
            name="Categories"
            maxHeight="380px"
            delete={(v) => deleteSuppOrCat('categories', v)}
            noedit={true}
            inputText={true}
            placeHolder="Type Category Name"
            label="Add Category"
            onChange={(v) => setCategoryN(v)}
            value={categoryN}
            Submit={() =>
              categoryN.length > 0
                ? addSupplierOrCateg('categories', categoryN, setCategoryN)
                : null
            }
          />
        </Row>
        <Row>
          <AdvanceProduct data={products} />
        </Row>
      </Content>
    </div>
  )
}

const EditProduct = (props) => {
  const [data, setData] = useState(['', {}])
  const [image, setImage] = useState(null)
  const [imgurl, setImgurl] = useState(null)
  const [state, setState] = useState(false)
  React.useEffect(() => {
    document.getElementById('fileImage').value = null
    setData(props.data)
    setImage(null)
    setImgurl(null)
  }, [props.data])
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
  const changeValue = (val, value) => {
    data[1][val] = value
    setState(!state)
  }
  const updateValue = async (e) => {
    e.preventDefault()
    let newObj = { ...data[1] }
    delete newObj.adv
    delete newObj.comments
    newObj.critical = Number(props.RemoveComma(newObj.critical))
    newObj.price = Number(props.RemoveComma(newObj.price))
    newObj.numberofitems = Number(props.RemoveComma(newObj.numberofitems))
    if (image === null) {
      await axios.post(
        process.env.REACT_APP_API + 'updateProduct',
        encryptJSON({
          id: data[0],
          data: newObj,
        })
      )

      return props.cancel()
    }
    const form = new FormData()
    form.append('image', image)
    form.append('set', JSON.stringify(newObj))
    form.append('imagename', image.name)
    form.append('title', newObj.title)
    form.append('imagetodelete', newObj.title + '/' + image.name)
    form.append('id', data[0])
    await axios.post(process.env.REACT_APP_API + 'updateProductwimg', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return props.cancel()
  }

  return (
    <div className="col-md-3">
      <div className="card card-user">
        <div className="card-header">
          <h5 className="card-title">Edit Product</h5>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => updateValue(e)}>
            <Row>
              <FormInput
                type="text"
                label="Product Name"
                placeHolder={data[1].title}
                value={data[1].title}
                onChange={(e) => changeValue('title', e.target.value)}
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Description"
                placeHolder={data[1].description}
                value={data[1].description}
                onChange={(e) => changeValue('description', e.target.value)}
              />
            </Row>
            <Row>
              <div className="col-md-12" style={{ padding: '10px' }}>
                <center>
                  <img
                    src={imgurl === null ? data[1].link : imgurl}
                    style={{ width: '150px', height: '150px' }}
                  />
                </center>
              </div>
            </Row>
            <Row>
              <FormInput
                id="fileImage"
                type="file"
                label="Product Image"
                placeHolder="Select Image"
                accept="image/*"
                onChange={(e) => filechange(e)}
              />
            </Row>
            <Row>
              <FormInput
                type="number"
                label="Discount"
                placeHolder="Discount in %"
                value={data[1].discount ?? 0}
                onChange={(e) =>
                  e.target.value <= 0
                    ? changeValue('discount', 0)
                    : e.target.value >= 100
                    ? changeValue('discount', 100)
                    : changeValue('discount', Number(e.target.value))
                }
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Quantity"
                placeHolder={data[1].numberofitems}
                value={data[1].numberofitems}
                onChange={(e) =>
                  props.isNumberKey(e)
                    ? changeValue('numberofitems', e.target.value)
                    : null
                }
                onFocusOut={() =>
                  changeValue(
                    'numberofitems',
                    props.NumberFormat(data[1].numberofitems)
                  )
                }
                onFocus={() =>
                  changeValue(
                    'numberofitems',
                    props.RemoveComma(data[1].numberofitems)
                  )
                }
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Critical Amount"
                placeHolder="Critical Amount"
                value={data[1].critical}
                onChange={(e) =>
                  props.isNumberKey(e)
                    ? changeValue('critical', e.target.value)
                    : null
                }
                onFocusOut={() =>
                  changeValue('critical', props.NumberFormat(data[1].critical))
                }
                onFocus={() =>
                  changeValue('critical', props.RemoveComma(data[1].critical))
                }
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                label="Price"
                placeHolder="Price"
                value={data[1].price}
                onChange={(e) =>
                  props.isNumberKey(e)
                    ? changeValue('price', e.target.value)
                    : null
                }
                onFocusOut={() =>
                  changeValue('price', props.NumberFormat(data[1].price))
                }
                onFocus={() =>
                  changeValue('price', props.RemoveComma(data[1].price))
                }
              />
            </Row>
            <Row>
              <div className="col-md-12">
                <label>Category</label>
                <select
                  style={{ width: '100%' }}
                  onChange={(e) =>
                    e.target.value !== null && e.target.value !== 'null'
                      ? changeValue('type', e.target.value)
                      : null
                  }
                >
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
                <select
                  style={{ width: '100%' }}
                  onChange={(e) =>
                    e.target.value !== null && e.target.value !== 'null'
                      ? changeValue('seller', e.target.value)
                      : null
                  }
                >
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

const AdvanceProduct = (props) => {
  const [data, setData] = useState(null)
  const [first, setFirst] = useState(null)
  const [second, setSec] = useState(null)
  React.useEffect(() => {
    if (data !== null) {
      setData(props.data.find((d) => d[0] === data[0]) ?? null)
    }
  }, [props.data])

  const deleteDate = async (id, id2) => {
    await axios.delete(process.env.REACT_APP_API + 'deletedate', {
      params: {
        id,
        id2,
      },
    })
  }
  const deleteAllDate = async (id) => {
    await axios.delete(process.env.REACT_APP_API + 'deleteAllDate', {
      params: {
        id,
      },
    })
  }
  const addDate = async (id, from, to) => {
    if (from === null && to === null) return false
    const firstDate = new Date(from === null ? to : from)
    const secondDate = new Date(to === null ? from : to)
    let dates = []
    while (true) {
      if (firstDate <= secondDate) {
        dates.push({ date: firstDate.toString() })
        firstDate.setDate(firstDate.getDate() + 1)
      } else {
        break
      }
    }
    await axios.put(process.env.REACT_APP_API + 'updatedate', {
      id: id,
      dates: dates,
    })
    setFirst(null)
    setSec(null)
    return true
  }
  return data === null ? (
    <Table
      size="col-md-12"
      headers={['Id', 'Name', 'Dates', 'Action']}
      data={props.data}
      needed={['id', 'title', 'adv']}
      name="Advance Order Dates"
      maxHeight="680px"
      edit={(v) => setData(v[1])}
      // delete={deleteItem}
      // edit={(v) => setEditProd(v)}
    />
  ) : (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">
            Edit <b>{data[1].title}</b> Advance Order dates
          </h5>
          <input
            type="button"
            value="Cancel"
            onClick={() => {
              setData(null)
              setFirst(null)
              setSec(null)
            }}
            style={{
              backgroundColor: 'red',
              borderRadius: '15px',
              border: 'none',
              color: 'white',
              padding: '10px',
            }}
          />
        </div>
        <div className="card-body">
          <hr />
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '50%',
                borderRight: '1px solid black',
                margin: '10px',
                padding: '20px',
              }}
            >
              <h6>Add a date</h6>
              <label>From</label>
              <input
                className="form-control"
                type="date"
                min={new Date().toLocaleDateString('en-ca')}
                onChange={(e) => setFirst(e.target.value)}
              />
              <label>To</label>
              <input
                className="form-control"
                type="date"
                min={new Date().toLocaleDateString('en-ca')}
                onChange={(e) => setSec(e.target.value)}
              />{' '}
              <br />
              <input
                className="form-control"
                type="button"
                value="Add"
                style={{ backgroundColor: 'green', color: 'white' }}
                onClick={() => addDate(data[0], first, second)}
              />
            </div>
            <div style={{ width: '50%', margin: '10px', padding: '20px' }}>
              <h6>Dates</h6>
              <input
                className="form-control"
                type="button"
                value="Delete all dates"
                style={{ backgroundColor: 'red', color: 'white' }}
                onClick={() => deleteAllDate(data[0])}
              />
              <table className="table">
                <thead className=" text-primary">
                  <td>Date</td>
                  <td>Action</td>
                </thead>
                <tbody>
                  {data[1].adv
                    ? Object.keys(data[1].adv).map((d, index) => (
                        <tr
                          key={index}
                          style={{ padding: '5px', paddingBottom: '10px' }}
                        >
                          <td>
                            {index + 1}. &nbsp;
                            {new Date(data[1].adv[d].date).toDateString()}
                          </td>
                          <td>
                            <span
                              style={{
                                color: 'red',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={() => deleteDate(data[0], d)}
                            >
                              Delete
                            </span>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventories
