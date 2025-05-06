
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

interface ProductsNavigationMenuProps {
  onPageChange: (page: string, category?: string, subcategory?: string, productId?: string) => void;
}

const ProductsNavigationMenu = ({ onPageChange }: ProductsNavigationMenuProps) => {
  const { t } = useTranslation();
  const { clientType } = useApp();

  const handleClick = (href: string, category: string, subcategory?: string, productId?: string) => {
    onPageChange(href, category, subcategory, productId);
  };

  const components: { title: string; href: string; category: string; subcategory?: string; translationKey: string; description: string }[] = [
    {
      title: "Coffret de Dattes",
      href: "products",
      category: "dattes-fraiches",
      subcategory: "coffret-cadeaux",
      translationKey: "navbar.gift_box",
      description: t("product_descriptions.gift_box_description", "Nos coffrets de dattes premium, parfaits pour les occasions spéciales")
    },
    {
      title: "Paquet de Dattes",
      href: "products",
      category: "dattes-fraiches",
      subcategory: "paquet",
      translationKey: "navbar.packages",
      description: t("product_descriptions.packages_description", "Nos paquets de dattes Deglet Nour de qualité supérieure")
    },
    {
      title: "Barquette de Dattes",
      href: "products",
      category: "dattes-transformees",
      subcategory: "barquette",
      translationKey: "navbar.trays",
      description: t("product_descriptions.trays_description", "Nos barquettes de dattes dénoyautées, prêtes à consommer")
    },
    {
      title: "Dattes Farcies",
      href: "products",
      category: "dattes-farcies",
      translationKey: "navbar.stuffed_dates",
      description: t("product_descriptions.stuffed_dates_description", "Nos dattes dénoyautées garnies d'amandes, de noix ou de pâte d'amande")
    }
  ];

  const figs: { title: string; href: string; category: string; productId?: string; translationKey: string; description: string }[] = [
    {
      title: "Figues Djebaa",
      href: "products",
      category: "figues-sechees-djebaa",
      productId: "15",
      translationKey: "navbar.djebaa_figs",
      description: t("product_descriptions.djebaa_figs_description", "Figues de Djebaa, riches en saveur et en tradition")
    },
    {
      title: "Figues ZIDI",
      href: "products",
      category: "figues-sechees-zidi",
      productId: "9",
      translationKey: "navbar.zidi_figs",
      description: t("product_descriptions.zidi_figs_description", "Figues ZIDI séchées selon les méthodes traditionnelles")
    },
    {
      title: "Figues Toujane",
      href: "products",
      category: "figues-sechees-toujane",
      productId: "14",
      translationKey: "navbar.toujane_figs",
      description: t("product_descriptions.toujane_figs_description", "Figues Toujane, une spécialité du sud tunisien")
    },
    {
      title: "Figues en Vrac",
      href: "products",
      category: "figues-sechees-vrac",
      productId: "10",
      translationKey: "navbar.bulk_dried_figs",
      description: t("product_descriptions.bulk_dried_figs_description", "Figues séchées en vrac pour les professionnels et particuliers")
    }
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-medium">
            {t('navbar.products')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 md:w-[600px] lg:w-[700px]">
              <div className="grid gap-3">
                <div className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick("products", "dattes-fraiches,dattes-transformees,dattes-farcies");
                      }}
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">
                        {t('navbar.dates')}
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        {t('product_descriptions.dates_intro', "Découvrez notre sélection de dattes Deglet Nour de qualité supérieure")}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </div>
                <ListItem
                  href="#"
                  title={t('navbar.date_syrup')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick("products", "sirop-dattes", undefined, "13");
                  }}
                >
                  {t('product_descriptions.date_syrup_short', "Notre sirop de dattes 100% naturel")}
                </ListItem>
                <ListItem
                  href="#"
                  title={t('navbar.date_sugar')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick("products", "sucre-dattes", undefined, "12");
                  }}
                >
                  {t('product_descriptions.date_sugar_short', "Notre sucre de dattes en poudre")}
                </ListItem>
                <ListItem
                  href="#"
                  title={t('navbar.date_coffee')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick("products", "cafe-dattes", undefined, "11");
                  }}
                >
                  {t('product_descriptions.date_coffee_short', "Notre café de noyaux de dattes torréfiés")}
                </ListItem>
              </div>
              <div className="grid gap-3">
                <div className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex flex-col justify-end rounded-md bg-gradient-to-b from-amber-500 to-yellow-700 p-6 no-underline outline-none focus:shadow-md"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick("products", "figues-sechees-zidi,figues-sechees-djebaa,figues-sechees-toujane,figues-sechees-vrac");
                      }}
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">
                        {t('navbar.dried_figs')}
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        {t('product_descriptions.figs_intro', "Notre gamme de figues séchées traditionnelles tunisiennes")}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </div>
                <ListItem
                  href="#"
                  title={t('navbar.all_products')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick("products-all");
                  }}
                >
                  {t('product_descriptions.all_products_short', "Voir tous nos produits")}
                </ListItem>
                {clientType === 'B2B' && (
                  <ListItem
                    href="#"
                    title={t('navbar.technical_products')}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick("technical-products", "technical-products");
                    }}
                  >
                    {t('product_descriptions.technical_products_short', "Nos solutions pour professionnels")}
                  </ListItem>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 pt-0 md:w-[600px] lg:w-[700px]">
              <div>
                <h4 className="mb-2 text-sm font-semibold">{t('navbar.dates')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={t(component.translationKey)}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(component.href, component.category, component.subcategory);
                      }}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">{t('navbar.dried_figs')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {figs.map((fig) => (
                    <ListItem
                      key={fig.title}
                      title={t(fig.translationKey)}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(fig.href, fig.category, undefined, fig.productId);
                      }}
                    >
                      {fig.description}
                    </ListItem>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    title: string; 
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; 
  }
>(({ className, title, children, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          onClick={onClick}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default ProductsNavigationMenu;
