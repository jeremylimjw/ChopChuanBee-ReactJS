import { Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { CustomerApiHelper } from '../../api/customer';
import C1Form from '../../components/customerModule/NewCustomer/C1Form';
import C2Menu from '../../components/customerModule/NewCustomer/C2Menu';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { useApp } from '../../providers/AppProvider';

export default function ViewCustomerPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null)

    const breadcrumbs = [
      { url: '/customers', name: 'Customers' },
      { url: `/customers/${customer?.company_name}`, name: customer?.company_name },
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

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="View Customer">

            <div className='flex-side-by-side' style={{ marginTop: 24 }}>

                <MyCard style={{ flexGrow: 0, width: '550px' }} title="Customer Details">
                    <C1Form customer={customer} setCustomer={setCustomer} />
                </MyCard>

                <div className='flex-stack' style={{ flexGrow: 1 }}>

                  <MyCard style={{ flexGrow: 0, width: 250 }} title="Amount Owed">
                    <Typography.Title level={4}>$100.00</Typography.Title>
                  </MyCard>

                  <MyCard style={{ flexGrow: 0 }}>
                      <C2Menu customer={customer} />
                  </MyCard>
                </div>

            </div>
        
        </MyLayout>
    )
}
