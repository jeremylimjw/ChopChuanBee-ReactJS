import { Form, Input, message, Modal, Select, Upload, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { CatalogueApiHelper } from '../../../api/CatalogueApiHelper';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import { UploadOutlined } from '@ant-design/icons';

export default function NewCatalogueModal({ isModalVisible, setIsModalVisible, myCallback }) {
    const { handleHttpError } = useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState();
    const [category, setCategory] = useState();
    const [allProduct, setAllProduct] = useState([]);
    const [allCategory, setAllCategory] = useState();

    const getProduct = () => {
        ProductApiHelper.get()
            .then((results) => {
                setAllProduct(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        CatalogueApiHelper.getAllCategory()
            .then((results) => {
                setAllCategory(results);
                getProduct();
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [isModalVisible, form, setAllCategory, setLoading]);

    function onCancel() {
        setIsModalVisible(false);
        form.resetFields();
        setProduct(null);
    }

    async function handleSubmit() {
        try {
            const menuItem = await form.validateFields();
            setLoading(true);

            CatalogueApiHelper.createNewMenu(menuItem)
                .then((newMenuItem) => {
                    myCallback(newMenuItem);
                    message.success('Catalogue successfully created!');
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) {}
    }

    return (
        <Modal
            width={600}
            title='Create a Catalogue'
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => onCancel()}
            destroyOnClose
            okButtonProps={{ loading: loading }}
        >
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete='off' labelAlign='left'>
                <Form.Item label='Catalogue Name' name='name' rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label='Product' name='product_id'>
                    <Select
                        showSearch
                        options={allProduct.map((x) => ({ label: x.name, value: x.id }))}
                        placeholder='Search Product'
                        onSelect={(_, option) => setProduct(option.label)}
                        filterOption={false}
                    />
                </Form.Item>

                <Form.Item rules={[REQUIRED]} label='Category' name='category_id'>
                    <Select
                        showSearch
                        options={allCategory?.map((x) => ({ label: x?.name, value: x?.id }))}
                        placeholder='Search Category'
                        onSelect={(_, option) => setCategory(option.label)}
                        filterOption={false}
                    />
                </Form.Item>

                <Form.Item label='Description' name='description' rules={[REQUIRED]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label='Upload Image' name='image' rules={[REQUIRED]}>
                    <Upload.Dragger listType='picture' accept='.png,.jpeg,.svg' beforeUpload={() => false} maxCount={1}>
                        Drag image here OR
                        <br />
                        <br />
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
}
