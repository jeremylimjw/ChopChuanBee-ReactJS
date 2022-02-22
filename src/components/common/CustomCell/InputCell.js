import { Input } from "antd";
import { useEffect, useState } from "react";

export default function InputCell({ field, items, setItems, record, ...restProps }) {
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
