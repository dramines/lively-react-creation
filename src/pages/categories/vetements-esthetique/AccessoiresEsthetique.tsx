
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const AccessoiresEsthetique = () => {
  const data = {
    ...categoriesContent['vetements-esthetique']['accessoires'],
    products: categoriesContent['vetements-esthetique']['accessoires'].products.map(product => ({
      ...product,
      id: product.id.toString()
    }))
  };

  return (
    <CategoryTemplate
      data={data}
      parentPath="/vetements-esthetique"
      parentName="vêtements esthétique"
    />
  );
};

export default AccessoiresEsthetique;
