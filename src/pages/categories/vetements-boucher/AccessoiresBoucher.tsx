
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const AccessoiresBoucher = () => {
  const data = {
    ...categoriesContent['vetements-boucher']['accessoires'],
    products: categoriesContent['vetements-boucher']['accessoires'].products.map(product => ({
      ...product,
      id: product.id.toString()
    }))
  };

  return (
    <CategoryTemplate
      data={data}
      parentPath="/vetements-boucher"
      parentName="vêtements boucher"
    />
  );
};

export default AccessoiresBoucher;
