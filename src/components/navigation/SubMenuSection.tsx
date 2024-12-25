import React from 'react';
import { Link } from 'react-router-dom';

interface SubMenuSectionProps {
  title: string;
  items: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

const ListItem = ({ href, title }: { href: string; title: string }) => (
  <li className="text-left text-black">
    <Link 
      to={href} 
      className="block text-sm hover:underline"
    >
      {title}
    </Link>
  </li>
);

const SubMenuSection = ({ title, items }: SubMenuSectionProps) => {
  return (
    <div>
      <h4 className="text-lg font-medium leading-none mb-3 text-[#700100] text-left">{title}</h4>
      <ul className="grid gap-1 pl-0"> 
        {items.map((item, index) => (
          <ListItem 
            key={`${item.href}-${index}`}
            href={item.href}
            title={item.title}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubMenuSection;