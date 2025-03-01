
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const VestesBoucher = () => {
  const data = {
    ...categoriesContent['vetements-boucher']['vestes'],
    products: categoriesContent['vetements-boucher']['vestes'].products.map(product => ({
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

export default VestesBoucher;
