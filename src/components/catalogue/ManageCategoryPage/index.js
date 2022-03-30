import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table, Tag, Typography } from 'antd';
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
import NewCategoryModal from './NewCategoryModal';

const breadcrumbs = [
    { url: '/catalogue/categories', name: 'Category' },
    { url: '/catalogue/categories', name: 'Categories' },
];

export default function ManageCategoryPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState();
    // const [catalogues, setCatalogues] = useState([]);
    const [categories, setCategories] = useState();
    const [form] = Form.useForm();
    // const data = [
    //     {
    //         id: 1,
    //         name: 'Dried Abalone',
    //         description: 'test 1',
    //         images: ['test1.jpg', 'test11.jpg'],
    //         category: 'Dried Seafoods',
    //         product: 'Abalone',
    //     },
    //     {
    //         id: 2,
    //         name: 'Dried Squid',
    //         description: 'test 2',
    //         images: ['test2.jpg', 'test22.jpg'],
    //         category: 'Dried Foods',
    //         product: '墨鱼 squid',
    //     },
    //     {
    //         id: 3,
    //         name: 'Dried Sea Cucumber',
    //         description: 'test 3',
    //         images: ['test3.jpg', 'test33.jpg'],
    //         category: 'Nuts',
    //         product: '海参 squid',
    //     },
    // ];

    const data = [
        { id: 1, name: 'Dried Seafoods', catalogue: ['test1', 'test2', 'test3', 'test4'] },
        { id: 2, name: 'Dried Foods', catalogue: ['test1', 'test2', 'test3', 'test4'] },
        { id: 3, name: 'Nuts', catalogue: ['test1', 'test2', 'test3', 'test4'] },
    ];

    useEffect(() => {
        setLoading(true);
        setCategories(data);
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

    function myCallback(newCategory) {
        setCategories([newCategory, ...categories]);
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Categories'>
            <MyCard>
                <MyToolbar title='Category'>
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

            <NewCategoryModal
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
        title: 'Catalogue amount',
        dataIndex: 'catalogue',
        key: 'catalogue',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
        render: (catalogue) => <Typography>{catalogue.length}</Typography>,
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
