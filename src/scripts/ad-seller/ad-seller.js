import { PdfConstantsFontWeights } from '../pdf-constants-font-weights/pdf-constants-font-weights'
import { PdfConstantsFontSizes } from '../pdf-constants-font-sizes/pdf-constants-font-sizes'

/**
 * @function
 * @name AdSeller
 * @description ad: seller block
 * @param {object} json - state in JSON format
 * @returns {Array.<object>} - seller data
 */
export function AdSeller (json) {

    let type = json.owner.type

    if (type === 'private') type = 'particulier'

    const data = [
        {
            'isHR': true,
        },
        {
            'text': 'Vendeur',
            'size': PdfConstantsFontSizes.normal,
            'type': PdfConstantsFontWeights.bold,
        },
        {
            'isLink': true,
            'text': `Vendeur ${type} : ${json.owner.name}`,
            'url': `https://www.leboncoin.fr/profil/${json.owner.user_id}`,
            'size': PdfConstantsFontSizes.small,
        },
    ]

    if (json.owner.siren !== undefined) {

        data.push ({
            'text': `SIREN : ${json.owner.siren}`,
            'size': PdfConstantsFontSizes.xsmall,
        })
    
    }

    return data

}

