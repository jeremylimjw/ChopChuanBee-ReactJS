import { Button, DatePicker, Select, Table } from 'antd'
import React, { useState } from 'react'
import MyToolbar from '../../layout/MyToolbar'

export default function C3AccountReceivable() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    return (
        <>
            <MyToolbar title="Account Receivables">
                <DatePicker.RangePicker />
                <Select style={{ width: 180 }} placeholder="Filter by Status" allowClear>
                    <Select.Option value="paid">Paid</Select.Option>
                    <Select.Option value="unpaid">Not Paid</Select.Option>
                </Select>
                <Button>Reset</Button>
            </MyToolbar>
            <Table dataSource={items} columns={columns} loading={loading} rowKey={() => Math.random()} />
        </>
    )
}

const columns = [
    {
      title: "Date",
      dataIndex: "payment_date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "payment_amount",
      key: "amount",
    },
    {
      title: "Method",
      dataIndex: "payment_method",
      key: "method",
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "status",
    },
]
