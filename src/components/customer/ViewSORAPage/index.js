import { Button, Table } from 'antd';
import { PrinterOutlined } from '@ant-design/icons/lib/icons';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../../providers/AppProvider';
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { showTotal } from '../../../utilities/table';
import { parseDate } from '../../../utilities/datetime';
import { sortByDate, sortByNumber } from '../../../utilities/sorters';
import { Link } from 'react-router-dom';


export default function ViewSORAPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError } = useApp();

  const [customer, setCustomer] = useState(null);
  const [sora, setSora] = useState(null);

  const breadcrumbs = [
    { url: '/customer/customers', name: 'Customer' },
    { url: '/customer/customers', name: 'Customers' },
    { url: `/customer/customers/${id}`, name: customer?.company_name },
    { url: `/customer/customers/SORA/${id}`, name: 'Statement of Receivable Account'}
  ]

  useEffect(() => {
    CustomerApiHelper.getById(id)
      .then(result => {
        if (result.length === 0) {
          navigate('../');
          return;
        }
      setCustomer(result[0]);
      }).catch(handleHttpError)

    CustomerApiHelper.getSORA(id)
      .then(result => {
        setSora(result);
      })
      .catch(handleHttpError)
  }, [id, handleHttpError, navigate]);

  return (
    <>
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${customer?.company_name}`}>
          <MyCard>
              <MyToolbar title="Statement of Receivable Account">
                  <Button icon={<PrinterOutlined />} > Print </Button>
              </MyToolbar>
              <Table 
                  dataSource={sora} 
                  columns={columns}
                  rowKey="id" 
                  pagination={{ showTotal: showTotal }}
              />
          </MyCard>
      </MyLayout>
    </>
  ) 
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    ellipsis: true,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Order ID',
    dataIndex: 'so_id',
    key: 'so_id',
    ellipsis: true,
    render: (so_id) => so_id ? <Link to={`/customer/sales/${so_id}`}>{so_id}</Link> : '-',
    sorter: (a, b) => sortByNumber(a.so_id, b.so_id),
  },
  {
    title: 'Charges',
    dataIndex: 'charges',
    key: 'charges',
    width: 180,
    align: 'center',
    ellipsis: true,
    render: (charges) => `$${(+charges).toFixed(2)}`,
    sorter: (a, b) => sortByNumber(a.charged, b.charges),
  },
  {
    title: 'Amount Paid',
    dataIndex: 'amount_paid',
    key: 'amount_paid',
    width: 180,
    align: 'center',
    ellipsis: true,
    render: (amount_paid) => `$${(+amount_paid).toFixed(2)}`,
    sorter: (a, b) => sortByNumber(a.amount_paid, b.amount_paid),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    width: 180,
    align: 'center',
    ellipsis: true,
    render: (balance) => `$${(+balance).toFixed(2)}`,
    sorter: (a, b) => sortByNumber(a.balance, b.balance),
  },
]
  