import { message, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { MovementType } from '../../../enums/MovementType';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';
import { CustomCell } from '../../common/CustomCell';

export default function NewDeliveryOrderModal({ purchaseOrder, setPurchaseOrder, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();
    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);

    tableColumns[4].title = isModalVisible === 1 ? 'Top Up' : 'Refund';
    tableColumns[4].onCell = (record) => ({ type: 'input_number', field: 'top_up', record, handleSave });

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
  
    function handleSave(newRecord) {
        const newItems = [...items];
        const index = newItems.findIndex(x => x.id === newRecord.id);
        const item = newItems[index];
        newItems.splice(index, 1, { ...item, ...newRecord });
        setItems(newItems);
    };

    function renderTitle() {
        switch(isModalVisible) {
            case 1: return 'Receive New Delivery';
            case 2 : return 'Refund Delivery';
            default: return '';
        }
    }

    function handleFormSubmit() {
        // Validation
        if (isModalVisible === 1) { // Make movement
            for (let item of items) {
                if (item.top_up > (item.quantity - item.total_received)) {
                    message.error('Top up cannot exceed total value.')
                    return;
                }
            }
        } else { // Make refund
            for (let item of items) {
                if (item.top_up > item.total_received) {
                    message.error('Refund cannot exceed received quantity.')
                    return;
                }
            }
        }

        const inventoryMovements = items.filter(x => x.top_up !== 0).map(x => {
            const movement = {
                product_id: x.product_id,
                purchase_order_item_id: x.id,
                quantity: x.top_up,
                unit_cost: x.unit_cost*(1+purchaseOrder.gst_rate/100),
            }
            if (isModalVisible === 1) { // Make movement
                return {...movement, movement_type_id: MovementType.PURCHASE.id }
            } else if (isModalVisible === 2) { // Make refund
                return {...movement, movement_type_id: MovementType.REFUND.id, quantity: -x.top_up}
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
                components={{ body: { cell: CustomCell } }}
                pagination={false} 
                rowKey="id"
            />

        </Modal>
    )
}
    
const tableColumns = [
    { 
        title: 'No', 
        dataIndex: 'no', 
        render: (_, record, index) => index+1 
    },
    { 
        title: 'Product', 
        dataIndex: 'product', 
        key: 'product', 
        render: (item) => item?.name, align: 'left'
    },
    { 
        title: 'Ordered Quantity', 
        dataIndex: 'quantity', 
        key: 'quantity', 
        align: 'center' 
    },
    { 
        title: 'Received Quantity', 
        dataIndex: 'total_received', 
        key: 'total_received', 
        align: 'center' 
    },
    { 
        title: 'Top Up', 
        dataIndex: 'top_up', 
        key: 'top_up', align: 'center', 
    }
]
