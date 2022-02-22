import InputCell from "./InputCell";
import SelectProductCell from "./SelectProductCell";

export function CustomCell({ type, field, items, setItems, record, products, children, ...restProps}) {
    switch(type) {
        case 'input': return InputCell({ type, field, items, setItems, record, children, ...restProps});
        case 'product_select': return SelectProductCell({ type, field, items, setItems, record, products, children, ...restProps});
        default: return <td {...restProps}>{children}</td>
    }
}