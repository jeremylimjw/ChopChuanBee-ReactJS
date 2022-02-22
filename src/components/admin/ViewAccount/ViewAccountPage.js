import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout/MyLayout';
import A1Form from './A1Form';
import A2Form from './A2Form';

export default function ViewAccountPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [employee, setEmployee] = useState()
    const [loading, setLoading] = useState(false);

    const breadcrumbs = [
      { url: '/admin/accounts', name: 'Admin' },
      { url: '/admin/accounts', name: 'Accounts' },
      { url: `/admin/accounts/${employee?.id}`, name: employee?.name },
    ]
  
    useEffect(() => {
        EmployeeApiHelper.get({ id: id })
            .then(result => {
                if (result.length === 0) {
                    navigate('../');
                    return;
                }
                setEmployee(result[0]);
            })
            .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function handleDeactivate() {
        setLoading(true);
        const promise = employee.discharge_date == null ? EmployeeApiHelper.deactivate(employee.id) : EmployeeApiHelper.activate(employee.id);
        promise.then(newFields => {
            setLoading(false);
            setEmployee({...employee, ...newFields });
            message.success(`Employee successfully ${employee.discharge_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
      if (!hasWriteAccessTo(View.ADMIN.name)) return <></>

      return (
        <>
          { employee.discharge_date == null ? 
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
        {employee != null && 
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${employee.name} ${ employee.discharge_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
            
                <Row>
                    <Col>
                        <MyCard style={{ width: 550, height: 625 }}>
                            <A1Form employee={employee} setEmployee={setEmployee} />
                        </MyCard>
                    </Col>

                    <Col>
                        <MyCard style={{ width: 550, height: 625 }}>
                            <A2Form employee={employee} setEmployee={setEmployee} />
                        </MyCard>
                    </Col>
                </Row>
            
            </MyLayout>
        }
      </>
    )
}
