import { DeleteOutlined, PlusOutlined } from "@ant-design/icons/lib/icons";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CustomerApiHelper } from "../../../api/CustomerApiHelper";
import { useApp } from "../../../providers/AppProvider";
import { sortByNumber, sortByString } from "../../../utilities/sorters";
import { CustomCell } from "../../common/CustomCell";
import MyToolbar from "../../common/MyToolbar";


export default function NS2CustomerMenuTable({ selectedCustomer, selectedProducts, setSelectedProducts }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [myPrices, setMyPrices] = useState({});

    const disabledProductsMap = selectedProducts.reduce((prev, current) => ({...prev, [current?.product?.id]: true }), {});

    columns[2].onCell = (record) => ({ type: 'product_select', toggleable: 'true', field: 'product', record, handleSave, products: menuItems, disabledProductsMap });
    columns[5].render = (product) => product?.id ? (myPrices[product.id] ? `$${(+myPrices[product.id]).toFixed(2)}` : '-') : '-';
    columns[5].sorter = (a, b) => sortByNumber(+myPrices[a.product?.id] || 0, +myPrices[b.product?.id] || 0);
    columns[6].onCell = (record) => ({ type: 'input_number', field: 'quantity', record, handleSave });
    columns[7].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} />

    useEffect(() => {
        if (selectedCustomer != null) {
        setLoading(true);
        CustomerApiHelper.getMenu(selectedCustomer.id)
            .then(results => {
                setMenuItems(results.map(x => ({ ...x.product, product_alias: x.product_alias })));
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))

        // Get supplier's latest prices for all products
        CustomerApiHelper.getMyLatestPrices(selectedCustomer.id)
            .then(results => {
                setMyPrices(results.reduce((prev, current) => ({...prev, [current.product_id]: current.unit_price }), {}));
            })
            .catch(handleHttpError)
        }

    }, [handleHttpError, selectedCustomer, setSelectedProducts, setMenuItems])

    function handleAddRow() {
        const newItem = {
            product: null, 
            key: Math.random(),
            quantity: 0,
        }
        const newItems = [newItem, ...selectedProducts];
        setSelectedProducts(newItems);
    }

    function handleDeleteRow(record) {
        const newItems = selectedProducts.filter((item) => item.key !== record.key);
        setSelectedProducts(newItems);
    };

    function handleSave(newRecord) {
        const newItems = [...selectedProducts];
        const index = newItems.findIndex(x => x.key === newRecord.key);
        const item = newItems[index];
        newItems.splice(index, 1, { ...item, ...newRecord });
        setSelectedProducts(newItems);
    }

    return (
        <>
            <MyToolbar 
                title={`Add new items from ${selectedCustomer?.company_name}'s menu`} 
                left={<Link style={{ lineHeight: '25px', paddingLeft: 10 }} to={`/customer/customers/${selectedCustomer?.id}`}>Edit Menu</Link>}
            >
                
                <Button onClick={handleAddRow} icon={<PlusOutlined />}>New</Button>
            </MyToolbar>
            
            <Table loading={loading}
                columns={columns}
                dataSource={selectedProducts}
                rowKey="key"
                components={{ body: { cell: CustomCell } }}
            />
        </>
    )
  
}

const columns = [
    { 
        align: '',
        width: 50, 
        render: (_, record, index) => index+1 
    },
    {
        title: 'Alias',
        dataIndex: 'product',
        key: 'product_alias',
        width: 300,
        ellipsis: true,
        render: (product) => product?.product_alias || '-',
        sorter: (a, b) => sortByString(a.product?.product_alias, b.product?.product_alias),
    },
    {
        title: 'Product Name',
        dataIndex: 'product',
        key: 'product',
        width: 300,
        ellipsis: true,
        render: (product) => product?.name,
        sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    {
        title: 'Description',
        dataIndex: 'product',
        ellipsis: true,
        render: (product) => product?.description || '-',
        sorter: (a, b) => sortByString(a.product.description, b.product.description),
    },
    {
        title: 'Unit',
        dataIndex: 'product',
        width: 150, 
        ellipsis: true,
        render: (product) => product?.unit || '-',
        sorter: (a, b) => sortByString(a.product.unit, b.product.unit),
    },
    {
        title: 'Latest Price',
        dataIndex: 'product',
        key: 'latest_unit_cost',
        align: 'center',
        width: 120,
        ellipsis: true,
    },
    {
        title: '* Quantity',
        dataIndex: 'quantity',
        align: 'center',
        width: 150, 
    },
    {
        align: 'center',
        width: 100,
    },
];