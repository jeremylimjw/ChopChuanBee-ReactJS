import React, { useEffect, useState } from 'react'
import { DeliveryApiHelper } from '../api/DeliveryApiHelper';
import { useSearchParams } from "react-router-dom";
import { useApp } from '../providers/AppProvider';
import { Layout, Result, Spin } from 'antd';

export default function CompleteDeliveryPage() {

    const { handleHttpError } = useApp();

    const [searchParams] = useSearchParams();

    const [id, setId] = useState(null);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    useEffect(() => {
        setId(searchParams.get('id'))
    }, [searchParams, setId]);

    useEffect(() => {
        if (id != null) {
            DeliveryApiHelper.completeOrder(id)
                .then(() => {
                    setSuccess(true);
                })
                .catch(handleHttpError)
                .catch(() => setFailure(true));
        }
    }, [id, handleHttpError]);
    
    return (
        <Layout.Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            { (id != null && success === false && failure === false) && 
                <Spin size="large" />
            }
            { success && 
                <Success id={id} />
            }
            { (id == null || failure) && 
                <Failure id={id} />
            }
        </Layout.Content>
    )
}

function Success({ id }) {
    return <Result
        status="success"
        title="Successfully completed Delivery Order!"
        subTitle={`Order number: ${id} Cloud server configuration takes 1-5 minutes, please wait.`}
    />
}

function Failure() {
    return <Result
        status="error"
        title="Unable to complete Delivery Order"
        subTitle="Please check if the delivery order ID is valid and try again."
    />
}
