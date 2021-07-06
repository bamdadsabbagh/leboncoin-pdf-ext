/**
 * @function
 * @name AdTitle
 * @description pdf: title block
 * @param {object} json - state in JSON format
 * @param {*} pdf - PDF instance
 * @returns {Array.<object>} - title data
 */
export function AdTitle (json, pdf) {

    return [
        {
            'isHR': true,
        },
        {
            // title
            'text': json.subject,
            'type': pdf.type.bold,
        },
        {
            // price
            'text': `Prix : ${json.price[0].toString () || '?'} euros`,
            'size': pdf.size.small,
        },
        {
            'text': `Lieu : ${json.location.city}, ${json.location.zipcode}, ${json.location.department_name}`,
            'size': pdf.size.small,
        },
        {
            'text': `GPS : ${json.location.lat}, ${json.location.lng}`,
            'size': pdf.size.small,
        },
        {
            'isLink': true,
            'text': 'Google Maps',
            'url': `https://www.google.com/maps/place/${json.location.lat},${json.location.lng}`,
            'size': pdf.size.xsmall,
        },
    ]

}
