export function UtilsGetMaxDimensions (width, height, canvasWidth, canvasHeight, margin = 0.5) {

    const compute = (margin) => {

        let maxWidth = canvasWidth - margin

        // todo: write a better fix because this one is clunky
        // (case when image get zoomed in too much and right margin is negative)
        if (maxWidth > canvasWidth) maxWidth = canvasWidth - 0.5

        const ratio = maxWidth / width
        const maxHeight = height * ratio

        return {
            'width': maxWidth,
            'height': maxHeight,
        }

    }

    const dimensions = compute (margin)
    const bottomDifference = canvasHeight - dimensions.height

    // if true, this means the bottom margin is not big enough
    if (bottomDifference <= margin) return compute (margin + bottomDifference)

    return dimensions

}
