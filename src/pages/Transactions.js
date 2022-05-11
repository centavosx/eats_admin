import React from 'react'
import Content, { Row } from '../components/Content'
import { Table } from '../components/Table'
const Transactions = () => {
  return (
    <div className="main-panel">
      <Content>
        {' '}
        <Row>
          {' '}
          <Table
            size="col-md-12"
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
            data={[]}
            // data={products}
            // needed={[
            //   'id',
            //   'title',
            //   'link',
            //   'price',
            //   'discount',
            //   'description',
            //   'numberofitems',
            //   'critical',
            //   'seller',
            //   'type',
            // ]}
            name="Order Transactions"
            // maxHeight="680px"
            // delete={deleteItem}
            // edit={(v) => setEditProd(v)}
          />
        </Row>
        <Row>
          {' '}
          <Table
            size="col-md-12"
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
            data={[]}
            // data={products}
            // needed={[
            //   'id',
            //   'title',
            //   'link',
            //   'price',
            //   'discount',
            //   'description',
            //   'numberofitems',
            //   'critical',
            //   'seller',
            //   'type',
            // ]}
            name="Advance Order Transactions"
            // maxHeight="680px"
            // delete={deleteItem}
            // edit={(v) => setEditProd(v)}
          />
        </Row>
      </Content>
    </div>
  )
}
const RowTransaction = () => {
  React.useEffect(() => {})
  return <Row></Row>
}

export default Transactions
