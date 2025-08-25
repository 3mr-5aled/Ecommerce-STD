exports.setImageURL = (
  doc,
  uploadPath,
  fieldName,
  groupName,
  multiple = false
) => {
  if (doc[fieldName]) {
    /**
     * Constructs a complete image URL by combining the base URL, upload path, and filename
     * @type {string} The full URL path to the image file
     */
    const imageUrl = `${process.env.BASE_URL}/${uploadPath}/${doc[fieldName]}`;
    doc[fieldName] = imageUrl;
  }
  if (multiple) {
    if (doc[groupName]) {
      const imagesList = [];
      doc[groupName].forEach((image) => {
        const imageUrl = `${process.env.BASE_URL}/${uploadPath}/${image}`;
        imagesList.push(imageUrl);
      });
      doc[groupName] = imagesList;
    }
  }
};
