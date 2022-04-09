import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useApp } from '../../../providers/AppProvider';
import { CatalogueApiHelper } from '../../../api/CatalogueApiHelper';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { View } from '../../../enums/View';
import { parseDate } from '../../../utilities/datetime';
import { sortByDate, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import NewCatalogueModal from './NewCatalogueModal';

const breadcrumbs = [
    { url: '/catalogue/menuItems', name: 'Catalogue' },
    { url: '/catalogue/menuItems', name: 'Menu Items' },
];

export default function ManageCataloguePage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [catalogues, setCatalogues] = useState([]);
    const [allCategory, setAllCategory] = useState();

    const [form] = Form.useForm();

    const dataFetch = useCallback(() => {
        CatalogueApiHelper.getAllMenuItems()
            .then((results) => {
                setCatalogues(results);
            })
            .catch(handleHttpError);

        CatalogueApiHelper.getAllCategory()
            .then((results) => {
                setAllCategory(results);
            })
            .catch(handleHttpError);
    }, [setCatalogues, setAllCategory]);

    useEffect(() => {
        dataFetch();
        setLoading(false);
    }, []);

    function onValuesChange(_, form) {
        setLoading(true);
        CatalogueApiHelper.getAllMenuItems(form)
            .then((results) => {
                setCatalogues(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function myCallback(newCatalogue) {
        setCatalogues([newCatalogue, ...catalogues]);
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
            dataIndex: 'product_name',
            key: 'product_name',
            width: '18%',
            ellipsis: true,
            sorter: (a, b) => sortByString(a.name, b.name),
            render: (product, record) => <Link to={`../../inventory/products/${record.product_id}`}>{product}</Link>,
        },
        {
            title: 'Category',
            dataIndex: 'menu_category_name',
            key: 'menu_category_name',
            width: 120,
            align: 'center',
            ellipsis: true,
            render: (category, record) => <Link to={`../categories/${record.menu_category_id}`}>{category}</Link>,
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

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Menu Items'>
            <MyCard>
                <MyToolbar title='Menu Items'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='name'>
                            <Input
                                placeholder='Search name'
                                style={{ width: 180 }}
                                suffix={<SearchOutlined className='grey' />}
                            />
                        </Form.Item>

                        <Form.Item name='menu_category_id'>
                            <Select style={{ width: 140 }} placeholder='Filter by Category'>
                                {allCategory?.map((category) => (
                                    <Select.Option value={category?.id}>{category?.name}</Select.Option>
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
                    dataSource={catalogues}
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
