import { Tag } from "antd";

export const MovementType = {
    PURCHASE: { id: 1, name: "Purchase", color: "blue" },
    SALE: { id: 2, name: "Sale", color: "green" },
    REFUND: { id: 3, name: "Refund", color: "red" },
    DAMAGED: { id: 4, name: "Damaged", color: "volcano" }
}
    
export function getMovementType(id) {
    const foundKey = Object.keys(MovementType).filter(key => MovementType[key].id === id);
    if (foundKey.length > 0) {
        return MovementType[foundKey];
    }
    return null;
}

export function getMovementTypeTag(id) {
    const item = getMovementType(id);
    if (item == null) return '-';
    return <Tag color={item.color}>{item.name}</Tag>
}