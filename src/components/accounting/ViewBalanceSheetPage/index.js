import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { AccountingAPIHelper } from '../../../api/AccountingAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyLayout from '../../common/MyLayout';
import BalanceSheetAsset from './BalanceSheetAsset';

export default function ViewBalanceSheetPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [BalanceSheet, setBalanceSheet] = useState(null)
    const [loading, setLoading] = useState(false);
  
    const breadcrumbs = [
      { url: '/accounting/BalanceSheets', name: 'Accounting' },
      { url: '/accounting/BalanceSheets', name: 'Balance Sheets' },
      { url: `/accounting/BalanceSheets/${BalanceSheet?.name}`, name: BalanceSheet?.name },
    ]
  
    useEffect(() => {
        AccountingAPIHelper.getBalanceSheetById(id)
          .then(result => {
            if (result.length === 0) {
              navigate('../');
              return;
            }
            setBalanceSheet(result[0]);
          })
          .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);
    
    function handleDeactivate() {
        setLoading(true);
        const promise = BalanceSheet.deleted_date == null ? AccountingAPIHelper.deactivateBalanceSheet(BalanceSheet.id) : AccountingAPIHelper.activateBalanceSheet(BalanceSheet.id);
        promise.then(newFields => {
          setLoading(false);
          setBalanceSheet({...BalanceSheet, ...newFields });
          message.success(`Balance Sheet successfully ${BalanceSheet.deleted_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
        if (!hasWriteAccessTo(View.ACCOUNTING.name)) return <></>
    
        return (
          <>
            { BalanceSheet.deleted_date == null ? 
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
        {BalanceSheet != null && 
          <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${BalanceSheet.name} ${ BalanceSheet.deleted_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
            <BalanceSheetAsset BalanceSheet={BalanceSheet} setBalanceSheet={setBalanceSheet} />     
          </MyLayout>
        }
        </>
    )
    
}