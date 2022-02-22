import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Popconfirm, Button, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { AccountingAPIHelper } from '../../api/accounting';
import SOFPAsset from '../../components/accountingModule/SOFPAsset';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';

export default function ViewSOFPPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [SOFP, setSOFP] = useState(null)
    const [loading, setLoading] = useState(false);
  
    const breadcrumbs = [
      { url: '/accounting/SOFPs', name: 'Accounting' },
      { url: '/accounting/SOFPs', name: 'SOFPs' },
      { url: `/accounting/SOFPs/${SOFP?.name}`, name: SOFP?.name },
    ]
  
    useEffect(() => {
        AccountingAPIHelper.getSOFPById(id)
          .then(result => {
            if (result.length === 0) {
              navigate('../');
              return;
            }
            setSOFP(result[0]);
          })
          .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);
    
    function handleDeactivate() {
        setLoading(true);
        const promise = SOFP.deleted_date == null ? AccountingAPIHelper.deactivateSOFP(SOFP.id) : AccountingAPIHelper.activateSOFP(SOFP.id);
        promise.then(newFields => {
          setLoading(false);
          setSOFP({...SOFP, ...newFields });
          message.success(`SOFP successfully ${SOFP.deleted_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
        if (!hasWriteAccessTo(View.ACCOUNTING.name)) return <></>
    
        return (
          <>
            { SOFP.deleted_date == null ? 
              <Popconfirm title="Confirm unlist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 100 }}>Unlist</Button>
              </Popconfirm>
              :
              <Popconfirm title="Confirm relist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 100 }}>Relist</Button>
              </Popconfirm>
            }
          </>
        )
    }
        
    return (
        <>
        {SOFP != null && 
          <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${SOFP.name} ${ SOFP.deleted_date == null ? '' : '(Unlisted)' }`} bannerRight={renderDeactivateButton()}>
            <SOFPAsset SOFP={SOFP} setSOFP={setSOFP} />     
          </MyLayout>
        }
        </>
    )
    
}