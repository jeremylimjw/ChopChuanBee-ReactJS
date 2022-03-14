import { Form, InputNumber, message, Modal } from 'antd';
import React, { useState } from 'react'
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { useApp } from '../../../providers/AppProvider';

export default function CreateMovementModal({ product, isModalVisible, setIsModalVisible, setMovements }) {

    const { handleHttpError } = useApp();

    const [form, setForm] = useState({
        quantity: 0,
    })
    const [loading, setLoading] = useState(false);

    function createDamagedInventory() {
        setLoading(true);
        ProductApiHelper.createDamagedInventory(product.id, form.quantity)
            .then(newMovements => {
                message.success('Damaged inventory successfully recorded!')
                setMovements(newMovements);
                setLoading(false);
                setIsModalVisible(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <Modal title="Create Damaged Inventory" visible={isModalVisible} width={400}
            onOk={createDamagedInventory} 
            onCancel={() => setIsModalVisible(false)}
            okButtonProps={{ disabled: (form.quantity === 0 || loading) }}
        >
            <Form labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} autoComplete="off" labelAlign="left">
                <Form.Item label="Quantity">
                    <InputNumber style={{ width: '100%' }}
                        value={form.quantity} min={0}
                        onChange={(value) => setForm({...form, quantity: value })}
                    />
                </Form.Item>
            </Form>
  
        </Modal>
    )
}
