
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const TableirsBoucher = () => {
  const data = {
    ...categoriesContent['vetements-boucher']['tabliers'],
    products: categoriesContent['vetements-boucher']['tabliers'].products.map(product => ({
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

export default TableirsBoucher;
