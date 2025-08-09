# Personnalisation de la couleur du thème

La personnalisation de la couleur du thème dans Dashcode est très flexible, ce qui vous permet d'utiliser n'importe quelle couleur personnalisée comme couleur de thème.

---

### Ajout d'une nouvelle couleur :

Pour commencer, ouvrez le fichier **theme.css** et ajoutez votre nouvelle couleur en suivant l'extrait de code fourni.

> Assurez-vous d'utiliser les valeurs de couleur HSL.

```css filename="app/[locale]/theme.css"
.theme-dark {
      --sidebar: 222.2 84% 4.9%;
      --header: 222.2 84% 4.9%;
}
.theme-rose {
      --sidebar: 341, 64%, 43%;
      --header: 341, 64%, 43%;
      --secondary: 339, 60%, 51%;
       --menu-arrow: 339, 60%, 51%;
     --menu-arrow-active: 336, 67%, 60%;
      
}

.theme-gray {
      --sidebar:  210, 10%, 23%;
      --header:  210, 10%, 23%;

       --secondary: 207, 14%, 31%;
       --menu-arrow: 207, 14%, 31%;
     --menu-arrow-active: 203, 16%, 43%;
}
```

### Définition de votre couleur :

Après avoir créé votre couleur, définissez-la dans le fichier **use-config.ts** en vous référant à l'extrait de code fourni.

```ts filename="hooks/use-config.ts"
export const Config = {
  collapsed: false,
  theme: "violet",
  skin: "default",
  layout: "vertical",
  sidebar: "draggable",
  menuHidden: false,
  showSearchBar: true,
  topHeader: "default",
  contentWidth: "wide",
  navbar: "sticky",
  footer: "sticky",
  isRtl: false,
  showSwitcher: true,
  subMenu: false,
  hasSubMenu: false,
  sidebarTheme: "redwood",
  headerTheme: "light",
  radius: 0.5,
};
```

---

# Personnalisation de la mise en page

Par défaut, Dashcode inclut trois mises en page prédéfinies. Cependant, vous pouvez créer de nouvelles mises en page en fonction de vos besoins.

### Ajout d'une nouvelle mise en page :

Commencez par ouvrir le fichier **layout.tsx** et ajoutez votre nouvelle mise en page à l'aide de l'extrait de code fourni.

```tsx filename="app/[locale]/layout.tsx"
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const direction = getLangDir(locale);
  return (
    <html lang={locale} dir={direction}>
      <body className={`${inter.className} starter-next`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
                       
            <ThemeProvider attribute="class" defaultTheme="light">
                           
              <MountedProvider>
                               
                <DirectionProvider direction={direction}>
                                    {children}               
                </DirectionProvider>
                             
              </MountedProvider>
                            <Toaster />
                            <SonnerToaster />           
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Définition de votre mise en page :

Une fois que vous avez créé votre mise en page, définissez-la dans le fichier **use-config.ts** en suivant l'extrait de code fourni.

```ts filename="hooks/use-config.ts"
export type Config = {
  collapsed: boolean;
  theme: string;
  skin: "default" | "bordered";
  layout: layoutType;
  sidebar: sidebarType;
  menuHidden: boolean;
  showSearchBar: boolean;
  showSwitcher: boolean;
  topHeader: "default" | "links";
  contentWidth: "wide" | "boxed";
  navbar: navBarType;
  footer: "sticky" | "default" | "hidden";
  isRtl: boolean;
  subMenu: boolean;
  hasSubMenu: boolean;
  sidebarTheme: string;
  headerTheme: string;
  sidebarBgImage?: string;
  radius: number;
};
```
