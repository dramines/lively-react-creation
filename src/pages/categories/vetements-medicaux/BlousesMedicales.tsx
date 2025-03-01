
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const BlousesMedicales = () => {
  const data = {
    ...categoriesContent['vetements-medicaux']['blouses'],
    products: categoriesContent['vetements-medicaux']['blouses'].products.map(product => ({
      ...product,
      id: product.id.toString()
    }))
  };

  return (
    <CategoryTemplate
      data={data}
      parentPath="/vetements-medicaux"
      parentName="vêtements médicaux"
    />
  );
};

export default BlousesMedicales;
