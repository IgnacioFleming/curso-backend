import { fakerES as faker } from "@faker-js/faker";

export const generateMockedProduct = () => {
  return {
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.string.numeric(5)),
    category: faker.commerce.department(),
    code: faker.string.alphanumeric(15),
    stock: parseInt(faker.string.numeric({ length: { min: 1, max: 3 } })),
    status: faker.datatype.boolean(),
    thumbnails: generateThumbnails(),
  };
};

const generateThumbnails = () => {
  let thumbnails = [];
  let numberOfThumbnails = faker.string.numeric(1);
  for (let i = 0; i < numberOfThumbnails; i++) {
    let thumbnail = faker.image.url();
    thumbnails.push(thumbnail);
  }
  return thumbnails;
};
