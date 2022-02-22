import { Modal } from 'antd';
import React, { useState } from 'react'
import { PurchaseOrder } from '../../../models/PurchaseOrder';

export default function NewOrderItemModal({ supplier, purchaseOrder, setPurchaseOrder, isModalVisible, setIsModalVisible, loading, setLoading }) {

    const [selectedProducts, setSelectedProducts] = useState([]);

    // This is just to trigger re-render of the menu table items to clear the selected checkboxes
    const [selectedSupplier, setSelectedSupplier] = useState(supplier);

    function handleFormSubmit() {
        const itemsToAdd = selectedProducts.filter(x => x.quantity !== 0).map(x => ({ 
            product_id: x.product_id, 
            quantity: x.quantity,
            inventory_movements: [],
            product: x.product,
            purchase_order_id: purchaseOrder.id,
            unit_cost: null,
        }));
        const newItems = [...purchaseOrder.purchase_order_items, ...itemsToAdd];

        setPurchaseOrder(new PurchaseOrder({...purchaseOrder, purchase_order_items: newItems }));
        setSelectedProducts([]);
        setSelectedSupplier({...supplier})
        setIsModalVisible(false);
    }

    return (
        <Modal title="Add new item" visible={isModalVisible} width={1200}
            onOk={handleFormSubmit} 
            onCancel={() => setIsModalVisible(false)}
            okButtonProps={{ disabled: loading }}
        >
            {/* <SupplierMenuTable 
                selectedSupplier={selectedSupplier} 
                selectedProducts={selectedProducts} 
                setSelectedProducts={setSelectedProducts} 
                disabledProductsMap={purchaseOrder.purchase_order_items.reduce((prev, current) => {
                    prev[current.product.id] = true;
                    return prev;
                }, {})}
            /> */}

        </Modal>
    )
}
