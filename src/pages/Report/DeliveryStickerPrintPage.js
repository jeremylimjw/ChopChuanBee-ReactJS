import React from 'react'
import DeliveryStickerTemplate from '../../utilities/Report/Templates/DeliveryStickerTemplate'

const DeliveryStickerPrintPage = () => {
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <DeliveryStickerTemplate />
                <DeliveryStickerTemplate />
            </div>
            <div style={{ display: 'flex' }}>
                <DeliveryStickerTemplate />
                <DeliveryStickerTemplate />
            </div>
        </div>


    )
}

export default DeliveryStickerPrintPage