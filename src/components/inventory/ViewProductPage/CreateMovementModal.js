import { Form, InputNumber, message, Modal } from 'antd';
import React, { useState, useCallback } from 'react'
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { useApp } from '../../../providers/AppProvider';

export default function CreateMovementModal({ product, setProduct, isModalVisible, setIsModalVisible, setMovements }) {

    const { handleHttpError } = useApp();

    const [form, setForm] = useState({
        quantity: 0,
    })
    const [loading, setLoading] = useState(false);

    function createDamagedInventory() {
        setLoading(true);
        ProductApiHelper.createDamagedInventory(product.id, form.quantity)
            .then(newMovements => {
                setMovements(newMovements);

                return refreshProduct(product.id); // refresh product to update stock balance on view
            })
            .then(() => {
                message.success('Damaged inventory successfully recorded!')
                setLoading(false);
                setIsModalVisible(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    const refreshProduct = useCallback((productId) => {
        return ProductApiHelper.getById(productId)
          .then(result => {
            if (result.length !== 0) {
                setProduct(result[0]);
            }
          })
          .catch(handleHttpError)
      },[setProduct, handleHttpError],
    )

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
