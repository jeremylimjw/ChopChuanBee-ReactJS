import { message, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { PurchaseOrderApiHelper } from '../../../api/purchaseOrder';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';
import EditableCell from '../../general/EditableCell';

export default function NewDeliveryOrderModal({ purchaseOrder, setPurchaseOrder, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();
    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);

    useEffect(() => {
        const newItems = purchaseOrder.purchase_order_items.map(item => {
            const outstanding_quantity = item.inventory_movements.reduce((prev, current) => prev += current.quantity, 0);
            const remaining_quantity = +item.quantity - outstanding_quantity;
            if (isModalVisible === 1) {
                return {
                    ...item, 
                    total_received: outstanding_quantity,
                    top_up: remaining_quantity > 0 ? remaining_quantity : 0
                }
            } else {
                return {
                    ...item, 
                    total_received: outstanding_quantity,
                    top_up: 0
                }
            }
        })
        setItems(newItems);
    }, [purchaseOrder, isModalVisible])
    


    const tableColumns = [
        { title: 'No', dataIndex: 'no', render: (_, record, index) => index+1 },
        { title: 'Product', dataIndex: 'product', key: 'product', render: (item) => item?.name, align: 'left'},
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' },
        { title: 'Total Received', dataIndex: 'total_received', key: 'total_received', align: 'center' },
        { title: `${isModalVisible === 1 ? 'Top Up' : 'Refund'}`, dataIndex: 'top_up', key: 'top_up', align: 'center', onCell: (record) => 
            ({ editable: true, record, dataIndex: 'top_up', inputType: 'number', handleSave }) 
        },
    ]
  
    function handleSave(record) {
      const newData = [...items];
      const index = newData.findIndex((item) => record.id === item.id);
      if (newData && index >= 0) {
        newData.splice(index, 1, { ...newData[index], ...record });
        setItems(newData);
      }
    };

    function renderTitle() {
        switch(isModalVisible) {
            case 1: return 'Receive New Delivery';
            case 2 : return 'Refund Delivery';
            default: return '';
        }
    }

    function handleFormSubmit() {
        const inventoryMovements = items.filter(x => x.top_up !== 0).map(x => {
            const movement = {
                purchase_order_item_id: x.id,
                quantity: x.top_up,
                unit_cost: x.unit_cost*(1+purchaseOrder.gst_rate/100),
            }
            // movement_type_id: 1 is purchase
            // movement_type_id: 3 is refund
            if (isModalVisible === 1) { // Make movement
                return {...movement, movement_type_id: 1}
            } else if (isModalVisible === 2) { // Make refund
                return {...movement, movement_type_id: 3, quantity: -x.top_up}
            } else {
                return {};
            }

        })

        if (inventoryMovements.length === 0) return;

        setLoading(true);
        PurchaseOrderApiHelper.createInventoryMovement(inventoryMovements)
            .then(newInventoryMovements => {
                const newPurchaseOrder = JSON.parse(JSON.stringify(purchaseOrder));
                for (let inventoryMovement of newInventoryMovements) {
                    for (let item of newPurchaseOrder.purchase_order_items) {
                        if (inventoryMovement.purchase_order_item_id === item.id) {
                            item.inventory_movements.push(inventoryMovement);
                            break;
                        }
                    }

                }
                setLoading(false);
                setIsModalVisible(0);
                
                if (isModalVisible === 1) { // Make payment
                    message.success("Deliveries successfully registered!");
                } else if (isModalVisible === 2) { // Make refund
                    message.success("Refunds successfully registered!");
                }
                
                setPurchaseOrder(new PurchaseOrder(newPurchaseOrder));

            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <Modal title={renderTitle()} visible={isModalVisible !== 0}  width={800}
            onOk={handleFormSubmit} 
            onCancel={() => setIsModalVisible(0)}
            okButtonProps={{ disabled: (items.filter(x => x.top_up > 0).length === 0 || loading) }}
        >

            <Table dataSource={items} columns={tableColumns} 
                components={{ body: { cell: EditableCell } }}
                pagination={{ position: ['none', 'none'] }} 
                rowKey="id"/>

        </Modal>
    )
}
