
import React from 'react';
import CategoryTemplate from '@/components/categories/CategoryTemplate';
import { categoriesContent } from '@/config/categoriesContent';

const TableirsCuisine = () => {
  const data = {
    ...categoriesContent['vetements-cuisine']['tabliers'],
    products: categoriesContent['vetements-cuisine']['tabliers'].products.map(product => ({
      ...product,
      id: product.id.toString()
    }))
  };

  return (
    <CategoryTemplate
      data={data}
      parentPath="/vetements-cuisine"
      parentName="vêtements cuisine"
    />
  );
};

export default TableirsCuisine;
