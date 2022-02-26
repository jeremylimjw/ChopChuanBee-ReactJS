import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons/lib/icons';
import { Popconfirm, Button, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout';
import CU1Form from './CU1Form';

export default function ViewChargedUnderPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();
  
    const [chargedUnder, setChargedUnder] = useState()
    const [loading, setLoading] = useState(false);

    const breadcrumbs = [
        { url: '/admin/schemes', name: 'Admin' },
        { url: '/admin/schemes', name: 'Schemes' },
        { url: `/admin/schemes/${chargedUnder?.id}`, name: chargedUnder?.name },
    ]
  
    useEffect(() => {
        ChargedUnderApiHelper.get({ id: id })
            .then(result => {
                if (result.length === 0) {
                    navigate('../../');
                    return;
                }
                setChargedUnder(result[0]);
            })
            .catch(handleHttpError)
    }, [id, handleHttpError, navigate]);

    function handleDeactivate() {
        setLoading(true);
        const promise = chargedUnder.deactivated_date == null ? ChargedUnderApiHelper.deactivate(chargedUnder.id) : ChargedUnderApiHelper.activate(chargedUnder.id);
        promise.then(newFields => {
            setLoading(false);
            setChargedUnder({...chargedUnder, ...newFields });
            message.success(`Scheme successfully ${chargedUnder.deactivated_date == null ? 'unlisted' : 'relisted' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
      if (!hasWriteAccessTo(View.ADMIN.name)) return <></>

      return (
        <>
          { chargedUnder.deactivated_date == null ? 
            <Popconfirm title="Confirm unlist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
              <Button type="danger" loading={loading} icon={<MinusCircleOutlined />} style={{ width: 100 }}>Unlist</Button>
            </Popconfirm>
            :
            <Popconfirm title="Confirm relist?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
              <Button type="primary" loading={loading} icon={<PlusCircleOutlined />} style={{ width: 100 }}>List</Button>
            </Popconfirm>
          }
        </>
      )
    }

    return (
      <>
        {chargedUnder != null && 
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${chargedUnder.name} ${ chargedUnder.deactivated_date == null ? '' : '(Unlisted)' }`} bannerRight={renderDeactivateButton()}>
            
                <MyCard style={{ width: 550 }}>
                    <CU1Form chargedUnder={chargedUnder} setChargedUnder={setChargedUnder} />
                </MyCard>
            
            </MyLayout>
        }
      </>
    )
}
