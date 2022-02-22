import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { CustomerApiHelper } from '../../api/customer';
import C1Form from '../../components/customerModule/ViewCustomer/C1Form';
import C2Menu from '../../components/customerModule/ViewCustomer/C2Menu';
import C3History from '../../components/customerModule/ViewCustomer/C3History';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';

export default function ViewCustomerPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(false);

    const breadcrumbs = [
      { url: '/customers', name: 'Customer' },
      { url: '/customers', name: 'Customers' },
      { url: `/customers/${customer?.id}`, name: customer?.company_name },
    ]
  
    useEffect(() => {
      CustomerApiHelper.getById(id)
        .then(result => {
          if (result.length === 0) {
            navigate('../');
            return;
          }
          setCustomer(result[0]);
        })
        .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function handleDeactivate() {
        setLoading(true);
        const promise = customer.deactivated_date == null ? CustomerApiHelper.deactivate(customer.id) : CustomerApiHelper.activate(customer.id);
        promise.then(newFields => {
            setLoading(false);
            setCustomer({...customer, ...newFields });
            message.success(`Customer successfully ${customer.deactivated_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
      if (!hasWriteAccessTo(View.CRM.name)) return <></>
      return (
        <>
          { customer.deactivated_date == null ? 
            <Popconfirm title="Confirm deactivate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
              <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 120 }}>Deactivate</Button>
            </Popconfirm>
            :
            <Popconfirm title="Confirm activate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
              <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 120 }}>Activate</Button>
            </Popconfirm>
          }
        </>
      )
    }

    return (
      <>
      {customer != null && 
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${customer.company_name} ${ customer.deactivated_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
          
          <Row>
            <Col xl={10} xs={24}>
              <MyCard>
                  <C1Form customer={customer} setCustomer={setCustomer} />
              </MyCard>
            </Col>

            <Col xl={14} xs={24}>
              <MyCard title="Quick View">
                {customer.company_name} has outstanding account receivables of&nbsp;
                <Typography.Title level={5} style={{ display: 'inline-block'}}>$0.00</Typography.Title>.
              </MyCard>

              <MyCard>
                <C2Menu customer={customer} />
              </MyCard>
            </Col>
          </Row>

          <MyCard style={{ marginTop: 0 }}>
            <C3History />
          </MyCard>
        
        </MyLayout>
      }
      </>
    )
}
