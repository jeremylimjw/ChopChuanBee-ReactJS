import { EditOutlined, SaveOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message, Form, Input, Select, Typography, Upload, Image } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CatalogueApiHelper } from '../../api/CatalogueApiHelper';
import { ProductApiHelper } from '../../api/ProductApiHelper';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import MyCard from '../common/MyCard';
import MyLayout from '../common/MyLayout';
import MyToolbar from '../common/MyToolbar';
import { REQUIRED } from '../../utilities/form';
import { DeleteOutlined } from '@ant-design/icons/lib/icons';

export default function ViewCataloguePage(props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [catalogue, setCatalogue] = useState();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [allProduct, setAllProduct] = useState([]);
    const [allCategory, setAllCategory] = useState();
    const [product, setProduct] = useState();
    const [category, setCategory] = useState();
    const [form] = Form.useForm();

    const breadcrumbs = [
        { url: '/catalogue/menuItems', name: 'Catalogue' },
        { url: '/catalogue/menuItems', name: 'Menu Items' },
        { url: `/catalogue/menuItems/${catalogue?.id}`, name: catalogue?.name },
    ];

    useEffect(() => form.resetFields(), [catalogue]);

    useEffect(() => {
        CatalogueApiHelper.getMenuItemById(id)
            .then((result) => {
                console.log(result);
                if (result.length === 0) {
                    navigate('../../');
                    return;
                }
                setCatalogue(result[0]);
                getCategory();
                getProduct();
            })
            .catch(handleHttpError);
    }, [id, handleHttpError, navigate]);

    const getProduct = () => {
        ProductApiHelper.get()
            .then((results) => {
                setAllProduct(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    };

    const getCategory = () => {
        CatalogueApiHelper.getAllCategory()
            .then((results) => {
                setAllCategory(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    };

    async function onFinish() {
        try {
            const values = await form.validateFields();
            console.log(values);
            setLoading(true);
            CatalogueApiHelper.updateMenuItem({ ...catalogue, ...values })
                .then(() => {
                    setCatalogue({ ...catalogue, ...values });
                    message.success(`Scheme successfully updated!`);
                    setLoading(false);
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) {}
    }

    function handleDelete() {
        CatalogueApiHelper.deleteMenuItem(id)
            .then((updateMenuItem) => {
                // console.log(id);
                setLoading(false);
                navigate('../menuItems');
                message.success('Catalogue successfully deleted!');
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function renderDeleteButton() {
        if (!hasWriteAccessTo(View.CATALOGUE.name)) return <></>;

        return (
            <>
                <Popconfirm title='Confirm delete?' placement='leftTop' onConfirm={handleDelete} disabled={loading}>
                    <Button type='danger' loading={loading} icon={<MinusCircleOutlined />} style={{ width: 100 }}>
                        Delete
                    </Button>
                </Popconfirm>
            </>
        );
    }

    return (
        <>
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle={catalogue?.name} bannerRight={renderDeleteButton()}>
                <MyCard style={{ width: 550 }}>
                    <MyToolbar title='Details'>
                        {hasWriteAccessTo(View.CATALOGUE.name) && (
                            <Form.Item>
                                {editing ? (
                                    <Button
                                        type='primary'
                                        onClick={onFinish}
                                        icon={<SaveOutlined />}
                                        loading={loading}
                                        style={{ width: 85 }}
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setEditing(true)}
                                        icon={<EditOutlined />}
                                        style={{ width: 85 }}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </Form.Item>
                        )}
                    </MyToolbar>
                    <Form
                        form={form}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete='off'
                        labelAlign='left'
                        initialValues={{ ...catalogue }}
                    >
                        <Form.Item label='Catalogue Name' name='name' rules={editing ? [REQUIRED] : []}>
                            {!editing ? <Typography>{catalogue?.name || '-'}</Typography> : <Input />}
                        </Form.Item>

                        <Form.Item label='Product' name='product_name'>
                            {!editing ? (
                                <Typography>{catalogue?.product_name || '-'}</Typography>
                            ) : (
                                <Select
                                    showSearch
                                    options={allProduct.map((x) => ({ label: x.name, value: x.id }))}
                                    placeholder='Search Product'
                                    defaultValue={{ value: catalogue?.product_id, label: catalogue?.product_name }}
                                    onSelect={(_, option) => setProduct(option.label)}
                                    filterOption={false}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label='Category' name='menu_category_id'>
                            {!editing ? (
                                <Typography>{catalogue?.menu_category_name}</Typography>
                            ) : (
                                <Select
                                    showSearch
                                    options={allCategory?.map((x) => ({ label: x?.name, value: x?.id }))}
                                    placeholder='Search Category'
                                    defaultValue={{ value: catalogue?.category_id, label: catalogue?.category_name }}
                                    onSelect={(_, option) => setCategory(option.label)}
                                    filterOption={false}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label='Description' name='description' rules={editing ? [REQUIRED] : []}>
                            {!editing ? (
                                <Typography>{catalogue?.description}</Typography>
                            ) : (
                                <Input.TextArea defaultValue={catalogue?.description} rows={4} />
                            )}
                        </Form.Item>

                        <Form.Item label='Upload Image' name='image'>
                            {!editing ? (
                                <Image src={catalogue?.image} />
                            ) : (
                                <Upload.Dragger
                                    listType='picture'
                                    accept='.png,.jpeg,.svg'
                                    beforeUpload={() => false}
                                    defaultFileList={[
                                        {
                                            // uid: 'abc',
                                            // name:"existing_file.png"
                                            url: `${catalogue?.image}`,
                                        },
                                    ]}
                                >
                                    Drag image here OR
                                    <br />
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload.Dragger>
                            )}
                        </Form.Item>
                    </Form>{' '}
                </MyCard>
            </MyLayout>
            )
        </>
    );
}
