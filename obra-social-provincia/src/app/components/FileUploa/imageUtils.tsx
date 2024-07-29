const base64ToImageUrl = (base64String: string) => {
    let img = new Image();
    img.src = base64String;
    return img;
};

export default base64ToImageUrl;
