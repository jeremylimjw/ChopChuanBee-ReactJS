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

export function getSpecialMovementTypeTag(record) {
    const movement = getMovementType(record.movement_type_id);
    if (movement == null) return '-';
    if (movement.id === MovementType.REFUND.id) {
      if (record.purchase_order_item != null) {
        return <Tag color={movement.color}>{`Supplier ${movement.name}`}</Tag>
      } else {
        return <Tag color={movement.color}>{`Customer ${movement.name}`}</Tag>
      }
    }
    return <Tag color={movement.color}>{movement.name}</Tag>
  }