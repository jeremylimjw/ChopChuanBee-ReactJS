import { EditOutlined, SaveOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message, Form, Input, InputNumber, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
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
    const data = {
        id: 1,
        name: 'Dried Abalone',
        description: 'test 1',
        images: ['test1.jpg', 'test11.jpg'],
        category: 'Dried Seafoods',
        product: 'Abalone',
    };

    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [catalogue, setCatalogue] = useState();
    // const [chargedUnder, setChargedUnder] = useState();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const breadcrumbs = [
        { url: '/catalogue/catalogues', name: 'Catalogue' },
        { url: '/catalogue/catalogues', name: 'Catalogues' },
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
                bannerTitle='Dried Abalone'
                bannerRight={renderDeactivateButton()}
            >
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
                        initialValues={{ ...data }}
                    >
                        <Form.Item label='Catalogue Name' name='name' rules={editing ? [REQUIRED] : []}>
                            {!editing ? (
                                <Typography>
                                    Dried Abalone
                                    {/* {chargedUnder.name || '-'} */}
                                </Typography>
                            ) : (
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label='Product' name='product' rules={editing ? [REQUIRED] : []}>
                            {!editing ? (
                                <Typography>
                                    Abalone
                                    {/* {chargedUnder.address || '-'} */}
                                </Typography>
                            ) : (
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label='Category' name='category' rules={editing ? [REQUIRED] : []}>
                            {!editing ? (
                                <Typography>
                                    Dried Seafood
                                    {/* {chargedUnder.shipping_address || '-'} */}
                                </Typography>
                            ) : (
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label='Description' name='description' rules={editing ? [REQUIRED] : []}>
                            {!editing ? (
                                <Typography>
                                    testing
                                    {/* {chargedUnder.contact_number || '-'} */}
                                </Typography>
                            ) : (
                                <Input.TextArea rows={4} />
                            )}
                        </Form.Item>

                        <Form.Item label='Upload Image(s)' name='images' rules={[REQUIRED]}>
                            <Upload.Dragger
                                listType='picture'
                                multiple
                                action={'http://localhost:3001/catalogue/catalogues'}
                                accept='.png,.jpeg,.svg'
                                // beforeUpload={(file) => {
                                //     console.log(file);
                                // }}
                            >
                                Drag image(s) here OR
                                <br />
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>{' '}
                </MyCard>
            </MyLayout>
            )
        </>
    );
}
