# Personnalisation du menu

Dans notre démo, nous avons utilisé différentes structures de menu. Pour personnaliser votre menu, commencez par sélectionner la structure de menu que vous préférez pour votre application.

---

### Menu vertical

Si vous préférez utiliser le menu vertical dans votre système, vous pouvez adapter le fichier **menus.ts** pour qu'il corresponde à vos besoins.

```ts filename="lib/menus.ts" /children/
export function getMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: "",
      id: "ecommerce",
      menus: [
        {
          id: "ecommerce",
          href: "/ecommerce/frontend",
          label: t("ecommerce"),
          active: pathname.includes("/ecommerce"),
          icon: "heroicons-outline:shopping-bag",
          submenus: [
            {
              href: "/ecommerce/frontend",
              label: t("userApp"),
              active: pathname.includes("/ecommerce/frontend"),
              icon: "heroicons-outline:user",
              children: [
                {
                  href: "/ecommerce/frontend",
                  label: t("products"),
                  active: pathname === "/ecommerce/frontend",
                },
                {
                  href: "/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t",
                  label: t("productDetails"),
                  active:
                    pathname ===
                    "/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t",
                },
                {
                  href: "/ecommerce/frontend/checkout/cart",
                  label: t("cart"),
                  active: pathname === "/ecommerce/frontend/checkout/cart",
                },
                {
                  href: "/ecommerce/frontend/wishlist",
                  label: t("wishlist"),
                  active: pathname === "/ecommerce/frontend/wishlist",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
```

---

### Menu horizontal

Si vous préférez utiliser le menu horizontal dans votre système, vous pouvez adapter le fichier **menus.ts** pour qu'il corresponde à vos besoins.

```js filename="lib/menus.ts" /children/
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: "",
      id: "ecommerce",
      menus: [
        {
          id: "ecommerce",
          href: "/ecommerce/frontend",
          label: t("ecommerce"),
          active: pathname.includes("/ecommerce"),
          icon: "heroicons-outline:shopping-bag",
          submenus: [
            {
              href: "/ecommerce/frontend",
              label: t("userApp"),
              active: pathname.includes("/ecommerce/frontend"),
              icon: "heroicons-outline:user",
              children: [
                {
                  href: "/ecommerce/frontend",
                  label: t("products"),
                  active: pathname === "/ecommerce/frontend",
                },
                {
                  href: "/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t",
                  label: t("productDetails"),
                  active:
                    pathname ===
                    "/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t",
                },
                {
                  href: "/ecommerce/frontend/checkout/cart",
                  label: t("cart"),
                  active: pathname === "/ecommerce/frontend/checkout/cart",
                },
                {
                  href: "/ecommerce/frontend/wishlist",
                  label: t("wishlist"),
                  active: pathname === "/ecommerce/frontend/wishlist",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
```
