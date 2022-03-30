import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useApp } from '../../../providers/AppProvider';
import { CatalogueApiHelper } from '../../../api/CatalogueApiHelper';
import { getRole, getRoleTag, Role } from '../../../enums/Role';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { getAccessRightTag, View } from '../../../enums/View';
import { parseDate, parseDateTimeSeconds } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { getActiveTag } from '../../../enums/ActivationStatus';
import { showTotal } from '../../../utilities/table';
import NewCatalogueModal from './NewCatalogueModal';

const breadcrumbs = [
    { url: '/catalogue/catalogues', name: 'Catalogue' },
    { url: '/catalogue/catalogues', name: 'Catalogues' },
];

export default function ManageAccountsPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState();
    const [catalogues, setCatalogues] = useState([]);
    const [form] = Form.useForm();
    const data = [
        {
            id: 1,
            name: 'Dried Abalone',
            description: 'test 1',
            images: ['test1.jpg', 'test11.jpg'],
            category: 'Dried Seafoods',
            product: 'Abalone',
        },
        {
            id: 2,
            name: 'Dried Squid',
            description: 'test 2',
            images: ['test2.jpg', 'test22.jpg'],
            category: 'Dried Foods',
            product: '墨鱼 squid',
        },
        {
            id: 3,
            name: 'Dried Sea Cucumber',
            description: 'test 3',
            images: ['test3.jpg', 'test33.jpg'],
            category: 'Nuts',
            product: '海参 squid',
        },
    ];

    const categories = [
        { id: 1, name: 'Dried Seafoods' },
        { id: 2, name: 'Dried Foods' },
        { id: 3, name: 'Nuts' },
    ];

    useEffect(() => {
        setLoading(true);
        setCatalogues(data);
        setLoading(false);
        //   CatalogueApiHelper.get()
        //     .then(results => {
        //         setCatalogues(results);
        //         setLoading(false);
        //     })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false))
    }, [handleHttpError, setLoading]);

    function onValuesChange(_, form) {
        console.log('searching');
        // CatalogueApiHelper.get(form)
        //     .then((results) => {
        //         setCatalogues(results);
        //         setLoading(false);
        //     })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false));
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function myCallback(newCatalogue) {
        setCatalogues([newCatalogue, ...catalogues]);
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Catalogues'>
            <MyCard>
                <MyToolbar title='Catalogues'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='name'>
                            <Input
                                placeholder='Search name'
                                style={{ width: 180 }}
                                suffix={<SearchOutlined className='grey' />}
                            />
                        </Form.Item>

                        <Form.Item name='Category'>
                            <Select style={{ width: 140 }} placeholder='Filter by Category'>
                                {categories.map((category) => (
                                    <Select.Option value={category.name}>{category.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    {hasWriteAccessTo(View.CATALOGUE.name) && (
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                            New
                        </Button>
                    )}
                </MyToolbar>

                <Table
                    dataSource={data}
                    columns={columns}
                    loading={loading}
                    rowKey='id'
                    pagination={{ showTotal: showTotal }}
                />
            </MyCard>

            <NewCatalogueModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                myCallback={myCallback}
            />
        </MyLayout>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
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
        title: 'Product',
        dataIndex: 'product',
        key: 'product',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (category) => <Link to={`../../category/${category}`}>{category}</Link>,
        // render: (category) => <Tag>{category}</Tag>,
        // sorter: (a, b) => sortByNumber(a.discharge_date ? 1 : 0, b.discharge_date ? 1 : 0),
    },
    {
        dataIndex: 'id',
        title: 'Action',
        key: 'link',
        width: 100,
        ellipsis: true,
        render: (id) => <Link to={`./${id}`}>View</Link>,
    },
];
