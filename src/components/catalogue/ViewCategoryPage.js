import { EditOutlined, SaveOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message, Form, Input, InputNumber, Typography, Upload, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { CatalogueApiHelper } from '../../api/CatalogueApiHelper';
import { ProductApiHelper } from '../../api/ProductApiHelper';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import MyCard from '../common/MyCard';
import MyLayout from '../common/MyLayout';
import MyToolbar from '../common/MyToolbar';
import { REQUIRED } from '../../utilities/form';
import { DeleteOutlined } from '@ant-design/icons/lib/icons';
import { showTotal } from '../../utilities/table';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { parseDate, parseDateTimeSeconds } from '../../utilities/datetime';

export default function ViewCataloguePage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const data = [
        { id: 1, name: 'Dried Abalone' },
        { id: 2, name: 'Dried Squid' },
        { id: 3, name: 'Dried Sea Cucumber' },
    ];
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [catalogue, setCatalogue] = useState();
    // const [chargedUnder, setChargedUnder] = useState();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const breadcrumbs = [
        { url: '/catalogue/categories', name: 'Categories' },
        { url: '/catalogue/categories', name: 'Categories' },
        //   { url: `/catalogue/catalogue/${catalogue?.id}`, name: catalogue?.name },
    ];

    // useEffect(() => {
    //     CatalogueApiHelper.get({ id: id })
    //         .then(result => {
    //             if (result.length === 0) {
    //                 navigate('../../');
    //                 return;
    //             }
    //             setChargedUnder(result[0]);
    //         })
    //         .catch(handleHttpError)
    // }, [id, handleHttpError, navigate]);

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            setCatalogue({ ...catalogue, ...values });
            message.success(`Scheme successfully updated!`);
            setLoading(false);
            setEditing(false);
            // CatalogueApiHelper.update({ ...catalogue, ...values })
            //     .then(() => {
            //         setCatalogue({ ...catalogue, ...values });
            //         message.success(`Scheme successfully updated!`);
            //         setLoading(false);
            //         setEditing(false);
            //     })
            //     .catch(handleHttpError)
            //     .catch(() => setLoading(false));
        } catch (err) {}
    }

    function handleDeactivate() {
        setLoading(true);
        message.success(`Catalogue successfully deleted!`);
        setLoading(false);

        // const promise = catalogue.deactivated_date == null ? CatalogueApiHelper.deactivate(catalogue.id) : CatalogueApiHelper.activate(catalogue.id);
        // promise.then(newFields => {
        //     setLoading(false);
        //     setCatalogue({...catalogue, ...newFields });
        //     message.success(`Catalogue successfully ${catalogue.deactivated_date == null ? 'unlisted' : 'relisted' }!`);
        // })
        // .catch(handleHttpError)
        // .catch(() => setLoading(false));
    }

    function renderDeactivateButton() {
        if (!hasWriteAccessTo(View.CATALOGUE.name)) return <></>;

        return (
            <>
                <Popconfirm title='Confirm delete?' placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
                    <Button type='danger' loading={loading} icon={<MinusCircleOutlined />} style={{ width: 100 }}>
                        Delete
                    </Button>
                </Popconfirm>
            </>
        );
    }

    return (
        <>
            <MyLayout
                breadcrumbs={breadcrumbs}
                // bannerTitle={`${chargedUnder.name} ${chargedUnder.deactivated_date == null ? '' : '(Unlisted)'}`}
                bannerTitle='Dried Seafood'
                bannerRight={renderDeactivateButton()}
            >
                <MyCard
                // style={{ width: 550 }}
                >
                    <MyToolbar title='Details'></MyToolbar>
                    <Table
                        dataSource={data}
                        columns={columns}
                        loading={loading}
                        rowKey='id'
                        pagination={{ showTotal: showTotal }}
                    />
                </MyCard>
            </MyLayout>
            )
        </>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 50,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },

    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        dataIndex: 'id',
        title: 'Action',
        key: 'link',
        width: 100,
        ellipsis: true,
        render: (id) => <Button>Delete</Button>,
    },
];
