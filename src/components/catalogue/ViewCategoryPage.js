import { MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message, Table } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { CatalogueApiHelper } from '../../api/CatalogueApiHelper';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import MyCard from '../common/MyCard';
import MyLayout from '../common/MyLayout';
import MyToolbar from '../common/MyToolbar';
import { showTotal } from '../../utilities/table';
import { sortByDate, sortByString } from '../../utilities/sorters';
import { parseDate } from '../../utilities/datetime';

export default function ViewCataloguePage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [filteredCatalogue, setFilteredCatalogue] = useState();
    const [category, setCategory] = useState();
    const [loading, setLoading] = useState(false);

    const breadcrumbs = [
        { url: '/catalogue/categories', name: 'Catalogue' },
        { url: '/catalogue/categories', name: 'Categories' },
        { url: `/catalogue/categories/${category?.id}`, name: category?.name },
    ];

    const dataFetch = useCallback(() => {
        CatalogueApiHelper.getMenuCategoryById(id)
            .then((result) => {
                if (result.length === 0) {
                    navigate('../../');
                    return;
                }
                setCategory(result[0]);
                setFilteredCatalogue(result[0]?.attachedMenuItems);
            })
            .catch(handleHttpError);
    }, [setCategory, setFilteredCatalogue, id, navigate, handleHttpError]);

    useEffect(() => {
        dataFetch();
    }, [dataFetch]);

    function handleCategoryDeletion() {
        CatalogueApiHelper.deleteCategory(id)
            .then((updateMenuItem) => {
                setLoading(false);
                navigate('../categories');
                message.success('Category successfully deleted!');
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function renderDeletionButton() {
        if (!hasWriteAccessTo(View.CATALOGUE.name)) return <></>;

        return (
            <>
                <Popconfirm
                    title='Confirm delete?'
                    placement='leftTop'
                    onConfirm={handleCategoryDeletion}
                    disabled={filteredCatalogue?.length > 0 ? true : false}
                >
                    <Button
                        type='danger'
                        loading={loading}
                        icon={<MinusCircleOutlined />}
                        style={{ width: 100 }}
                        disabled={filteredCatalogue?.length > 0 ? true : false}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            </>
        );
    }

    function handleCatalogueDelete(id) {
        CatalogueApiHelper.deleteMenuItem(id)
            .then((updateMenuItem) => {
                setLoading(false);
                dataFetch();
                message.success('Catalogue successfully deleted!');
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
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
            ellipsis: true,
            sorter: (a, b) => sortByString(a.name, b.name),
            render: (product, record) => <Link to={`../menuItems/${record.id}`}>{product}</Link>,
        },
        {
            dataIndex: 'id',
            key: 'link',
            align: 'center',
            width: 100,
            render: (id, record) => (
                <Popconfirm
                    title='Confirm delete?'
                    placement='leftTop'
                    onConfirm={() => handleCatalogueDelete(record.id)}
                >
                    <Button shape='circle' icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${category?.name}`} bannerRight={renderDeletionButton()}>
                <MyCard style={{ width: 750 }}>
                    <MyToolbar title='Menu Items'></MyToolbar>
                    <Table
                        dataSource={filteredCatalogue}
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
