export const getTextWidth = (text: string, font: string = '14px Inter, sans-serif'): number => {
    if (typeof document === 'undefined') return 0;

    // Use a cached canvas if possible, or create one on the fly (cheap enough for occasional use)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
        context.font = font;
        return context.measureText(text).width;
    }

    return 0;
};
