export const getConsistentImage = (images, key) => {
    if (!images || images.length === 0) return null;
    const index =
      key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      images.length;
    return images[index]?.src;
  };
  