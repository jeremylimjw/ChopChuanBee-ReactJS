import { Form, Input, InputNumber, message, Modal, Select, Upload, Button } from 'antd';
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
    const [allProduct, setAllProduct] = useState([]);

    const onSearch = useCallback(
        (name) => {
            ProductApiHelper.get()
                .then((results) => {
                    setAllProduct(results);
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        },
        [handleHttpError, setLoading]
    );

    // useEffect(() => {
    //     if (isModalVisible) {
    //         onSearch('');
    //     }
    // }, [isModalVisible, form, setProduct, onSearch]);

    function onCancel() {
        setIsModalVisible(false);
        form.resetFields();
        setProduct(null);
    }

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            message.success('Catalogue successfully created!');
            setLoading(false);
            setIsModalVisible(false);
            // CatalogueApiHelper.create(values)
            //     .then(newChargedUnder => {
            //         myCallback(newChargedUnder);
            //         message.success('Catalogue successfully created!')
            //         setLoading(false);
            //         setIsModalVisible(false);
            //     })
            //     .catch(handleHttpError)
            //     .catch(() => setLoading(false));
        } catch (err) {}
    }

    return (
        <Modal
            width={600}
            title='Create a Catalogue'
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
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
                        onSearch={onSearch}
                        onSelect={
                            (_, option) => setProduct(option.label)
                            // label: "陈阳 Signature Rosemary Roast Duck"
                            // value: "c29f44a4-ad67-4b5d-8a7c-983697b12ab2"
                        }
                        filterOption={false}
                    />
                </Form.Item>

                <Form.Item rules={[REQUIRED]} label='Category' name='category_id'>
                    <Select
                        showSearch
                        options={allProduct.map((x) => ({ label: x.name, value: x.id }))}
                        placeholder='Search Category'
                        onSearch={onSearch}
                        onSelect={
                            (_, option) => setProduct(option.label)
                            // label: "陈阳 Signature Rosemary Roast Duck"
                            // value: "c29f44a4-ad67-4b5d-8a7c-983697b12ab2"
                        }
                        filterOption={false}
                    />
                </Form.Item>

                <Form.Item label='Description' name='description' rules={[REQUIRED]}>
                    <Input.TextArea rows={4} />
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
            </Form>
        </Modal>
    );
}
