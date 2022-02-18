import { Input, Select } from "antd";
import { useEffect, useState } from "react";

export function RenderCell({ type, field, items, setItems, record, products, children, ...restProps}) {
    switch(type) {
        case 'input': return RenderInput({ type, field, items, setItems, record, children, ...restProps});
        case 'product_select': return RenderProductSelect({ type, field, items, setItems, record, products, children, ...restProps});
        default: return <td {...restProps}>{children}</td>
    }
}

export function RenderInput({ field, items, setItems, record, ...restProps }) {
    const [value, setValue] = useState();

    useEffect(() => {
        setValue(record[`${field}`])
    }, [record, field])

    function save() {
        const newItems = [...items]
        // Allow match record by 'id' or 'key'
        const index = newItems.findIndex(x => {
            if (record.id) {
                return (x.id === record.id)
            } else if (record.key) {
                return (x.key === record.key)
            } else {
                return false;
            }
        });
        if (index >= 0) {
            newItems[index][`${field}`] = value;
        }
        setItems(newItems);
    }

    return (
        <td {...restProps}>
            <Input value={value} onChange={(e) => setValue(e.target.value)} onPressEnter={save} onBlur={save} />
        </td>
    )

}

export function RenderProductSelect({ field, items, setItems, record, products, children, ...restProps }) {
    const LIMIT = 10;

    const [value, setValue] = useState();
    const [options, setOptions] = useState();


    useEffect(() => {
      if (record) {
        setValue(record[`${field}`]?.name)
      }
      setOptions(products.map(x => ({ label: x.name, value: x.id, product: x })).splice(0, LIMIT));
    }, [record, products, field])

    function onChange(_, option) {
        setValue(option[`${field}`].name); 
        
        const newItems = [...items]
        // Allow match record by 'id' or 'key'
        const index = newItems.findIndex(x => {
            if (record.id) {
                return (x.id === record.id)
            } else if (record.key) {
                return (x.key === record.key)
            } else {
                return false;
            }
        });
        if (index >= 0) {
            newItems[index][`${field}`] = option.product;
        }
        setItems(newItems);
    }

    function onSearch(value) {
        const filtered = products.filter(x => x.name.toLowerCase().indexOf(value.toLowerCase()) >= 0);
        setOptions(filtered.map(x => ({ label: x.name, value: x.id, product: x })).splice(0, LIMIT));
    }

    return (
        <td {...restProps}>
            <Select showSearch style={{ width: 280 }}
                value={value}
                options={options}
                placeholder="Select Product" 
                onChange={onChange} 
                onSearch={onSearch}
                filterOption={false}
            />
        </td>
    )

}