import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyLayout from '../../common/MyLayout';
import BalanceSheet from './BalanceSheet';

export default function ViewbalanceSheetObjectPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [balanceSheetObject, setBalanceSheetObject] = useState(null)
    const [loading, setLoading] = useState(false);
  
    const breadcrumbs = [
      { url: '/accounting/balanceSheetObjects', name: 'Accounting' },
      { url: '/accounting/balanceSheetObjects', name: 'Balance Sheets' },
      { url: `/accounting/balanceSheetObjects/${balanceSheetObject?.name}`, name: balanceSheetObject?.name },
    ]
  
    useEffect(() => {
        AccountingAPIHelper.getBalanceSheetById(id)
          .then(result => {
            if (result.length === 0) {
              navigate('../');
              return;
            }
            setBalanceSheetObject(result[0]);
          })
          .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);
    
    function handleDeactivate() {
        setLoading(true);
        const promise = balanceSheetObject.deleted_date == null ? AccountingAPIHelper.deactivatebalanceSheetObject(balanceSheetObject.id) : AccountingAPIHelper.activatebalanceSheetObject(balanceSheetObject.id);
        promise.then(newFields => {
          setLoading(false);
          setBalanceSheetObject({...balanceSheetObject, ...newFields });
          message.success(`Balance Sheet successfully ${balanceSheetObject.deleted_date == null ? 'unlisted' : 'relisted' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
        if (!hasWriteAccessTo(View.ACCOUNTING.name)) return <></>
    
        return (
          <>
            { balanceSheetObject.deleted_date == null ? 
              <Popconfirm title="Confirm unlist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                <Button type="danger" loading={loading} icon={<MinusCircleOutlined />} style={{ width: 120 }}>Unlist</Button>
              </Popconfirm>
              :
              <Popconfirm title="Confirm relist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                <Button type="primary" loading={loading} icon={<PlusCircleOutlined />} style={{ width: 120 }}>Relist</Button>
              </Popconfirm>
            }
          </>
        )
    }
        
    return (
        <>
        {balanceSheetObject != null && 
          <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${balanceSheetObject.name} ${ balanceSheetObject.deleted_date == null ? '' : '(Unlisted)' }`} bannerRight={renderDeactivateButton()}>
            <BalanceSheet balanceSheetObject={balanceSheetObject} setBalanceSheetObject={setBalanceSheetObject} />     
          </MyLayout>
        }
        </>
    )
    
}