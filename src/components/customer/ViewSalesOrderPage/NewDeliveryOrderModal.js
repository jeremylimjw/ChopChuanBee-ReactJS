import { message, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { MovementType } from '../../../enums/MovementType';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';
import { CustomCell } from '../../common/CustomCell';

export default function NewDeliveryOrderModal({ salesOrder, setSalesOrder, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();
    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);

    tableColumns[4].onCell = (record) => ({ type: 'input_number', field: 'top_up', record, handleSave });

    useEffect(() => {
        const newItems = salesOrder.sales_order_items.map(item => ({ 
            ...item, 
            top_up: 0, 
            total_balance: item.inventory_movements.reduce((prev, current) => prev += -current.quantity, 0),
        }))
        console.log(newItems)
        setItems(newItems);
    }, [salesOrder, isModalVisible])
  
    function handleSave(newRecord) {
        const newItems = [...items];
        const index = newItems.findIndex(x => x.id === newRecord.id);
        const item = newItems[index];
        newItems.splice(index, 1, { ...item, ...newRecord });
        setItems(newItems);
    };

    function handleFormSubmit() {
        // Validation
        for (let item of items) {
            if (item.top_up > item.total_balance) {
                message.error('Refund cannot exceed received quantity.')
                return;
            }
        }

        const inventoryMovements = items.filter(x => x.top_up !== 0).map(x => {
            let unitCost = 0;
            for (var i = x.inventory_movements.length - 1; i >= 0; i--) { // iterate backwards
                if (x.inventory_movements[i].quantity < 0) {
                    unitCost = x.inventory_movements[i].unit_cost; // if first inventory movement from the bottom of the array has negative quantity, it is the latest
                    break;
                }
            }
        
            return {
                product_id: x.product_id,
                sales_order_item_id: x.id,
                quantity: x.top_up,
                unit_cost: unitCost,
                movement_type_id: MovementType.REFUND.id,
            }
        })

        if (inventoryMovements.length === 0) return;

        setLoading(true);
        SalesOrderApiHelper.refundInventoryMovement(inventoryMovements)
            .then(newInventoryMovements => {
                const newSalesOrder = JSON.parse(JSON.stringify(salesOrder));
                for (let inventoryMovement of newInventoryMovements) {
                    for (let item of newSalesOrder.sales_order_items) {
                        if (inventoryMovement.sales_order_item_id === item.id) {
                            item.inventory_movements.push(inventoryMovement);
                            break;
                        }
                    }

                }
                setLoading(false);
                setIsModalVisible(0);
                
                message.success("Refunds successfully registered!");
                
                setSalesOrder(new SalesOrder(newSalesOrder));

            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <Modal title="Refund Items" visible={isModalVisible !== 0}  width={800}
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
        title: 'Sent Quantity', 
        dataIndex: 'total_balance', 
        key: 'total_balance', 
        align: 'center' 
    },
    { 
        title: 'Refund', 
        dataIndex: 'top_up', 
        key: 'top_up', align: 'center', 
    }
]
