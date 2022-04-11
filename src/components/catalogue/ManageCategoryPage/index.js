import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
import NewCategoryModal from './NewCategoryModal';

const breadcrumbs = [
    { url: '/catalogue/categories', name: 'Catalogue' },
    { url: '/catalogue/categories', name: 'Categories' },
];

export default function ManageCategoryPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState();
    const [categories, setCategories] = useState();

    useEffect(() => {
        setLoading(true);
        CatalogueApiHelper.getAllCategory()
            .then((results) => {
                setCategories(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [handleHttpError, setLoading]);

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
                    dataSource={categories}
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
        dataIndex: 'attachedMenuItems',
        key: 'id',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
        render: (attachedMenuItems, record, index) =>
            attachedMenuItems ? <Typography>{attachedMenuItems.length}</Typography> : <Typography>0</Typography>,
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
