import { SearchOutlined } from '@ant-design/icons/lib/icons'
import { Button, DatePicker, Input, Table } from 'antd'
import React from 'react'
import MyToolbar from '../../layout/MyToolbar'

export default function C4History() {
    // const [loading, setLoading] = useState(false);
    // const [items, setItems] = useState([]);

    return (
        <>
            <MyToolbar title="Past Order History">
                <Input placeholder="Search ID" suffix={<SearchOutlined className='grey' />} />
                <DatePicker.RangePicker />
                <Button>Reset</Button>
            </MyToolbar>
            <Table dataSource={[]} columns={columns} loading={false} rowKey={() => Math.random()} />
        </>
    )
}

const columns = [
    { 
        title: 'Date', 
        dataIndex: 'created_at', 
        key: 'created_at', 
        width: '16%', 
    },
    { 
        title: 'Order ID', 
        dataIndex: 'id', 
        key: 'id', 
        width: '11%', 
    },
    { 
        title: 'Supplier', 
        dataIndex: 'supplier', 
        key: 'supplier', 
    },
    { 
        title: 'Payment Term', 
        key: 'payment_term', 
        align: 'center', 
        width: '11%', 
    },
    { 
        title: 'Total', 
        key: 'total', 
        align: 'center', 
        width: '8%', 
    },
    { 
        title: 'Paid', 
        key: 'payments_total', 
        align: 'center', 
        width: '8%', 
    },
    { 
        title: 'Delivery', 
        dataIndex: '', 
        key: 'delivery', 
        width: '8%', 
        align: 'center', 
    },
    { 
        title: 'Status', 
        key: 'purchase_order_status_id', 
        align: 'center', 
        width: '8%', 
    },
    { 
        dataIndex: "id", 
        title: "", 
        key: "link", 
        width: '8%', 
    }
]
