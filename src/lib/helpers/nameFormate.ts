export const capitalizeFirstTwoWords = (text: any) => {
    if (!text) return "--";
    let words = text.split(' ');
    if (words.length >= 2) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    } else if (words.length === 1) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return words.join(' ');
};

export const capitalizeFirstLetter = (name: any) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}