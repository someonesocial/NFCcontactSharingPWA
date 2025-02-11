export const generateUniqueUrl = (base: string, id: string): string => {
    return `${base}/contact/${id}`;
};

export const isValidUrl = (url: string): boolean => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|localhost|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP address (v4) 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
};