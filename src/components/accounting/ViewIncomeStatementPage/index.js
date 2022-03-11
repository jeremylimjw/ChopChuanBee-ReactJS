import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyLayout from '../../common/MyLayout';
import IncomeStatementAsset from './IncomeStatementAsset';

export default function ViewIncomeStatementPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [income, setIncome] = useState(null)
    const [loading, setLoading] = useState(false);
  
    const breadcrumbs = [
      { url: '/accounting/incomeStatements', name: 'Accounting' },
      { url: '/accounting/incomeStatements', name: 'Income Statements' },
      { url: `/accounting/incomeStatements/${income?.name}`, name: income?.name },
    ]

    useEffect(() => {
        AccountingAPIHelper.getIncomeStatementById(id)
          .then(result => {
            if (result.length === 0) {
              navigate('../');
              return;
            }
            setIncome(result[0]);
          })
          .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function handleDeactivate() {
        setLoading(true);
        const promise = income.deleted_date == null ? AccountingAPIHelper.deactivateIncomeStatement(income.id) : AccountingAPIHelper.activateIncomeStatement(income.id);
        promise.then(newFields => {
          setLoading(false);
          setIncome({...income, ...newFields });
          message.success(`Income statement successfully ${income.deleted_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
       
    }
    function renderDeactivateButton() {
        if (!hasWriteAccessTo(View.ACCOUNTING.name)) return <></>
    
        return (
          <>
            { income.deleted_date == null ? 
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
        {income != null && 
          <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${income.name} ${ income.deleted_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
            <IncomeStatementAsset income={income} setIncome={setIncome} />     
          </MyLayout>
        }
        </>
    )

}