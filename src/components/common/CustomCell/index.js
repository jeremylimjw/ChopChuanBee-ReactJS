import InputCell from "./InputCell";
import SelectProductCell from "./SelectProductCell";

export function CustomCell(props) {
    switch(props.type) {
        case 'input': return InputCell(props);
        case 'product_select': return SelectProductCell(props);
        default: return <td {...props}>{props.children}</td>
    }
}