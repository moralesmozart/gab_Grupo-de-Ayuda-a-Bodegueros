# G.A.B · Libro (preview)

Preview interactiva del libro del [Grupo de Ayuda a Bodegueros](https://grupoayudabodegueros.org/).

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

En producción (GitHub Pages) el `base` de Vite es `/gab_Grupo-de-Ayuda-a-Bodegueros/`.

## Publicar en GitHub Pages

1. Crea el repositorio `gab_Grupo-de-Ayuda-a-Bodegueros` en GitHub (si aún no existe).
2. Sube esta rama `main`:

   ```bash
   git remote add origin https://github.com/<tu-usuario>/gab_Grupo-de-Ayuda-a-Bodegueros.git
   git commit -m "Initial commit: GAB libro preview + GitHub Pages"
   git push -u origin main
   ```

3. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Tras el primer push, el workflow **Deploy to GitHub Pages** generará el sitio. La URL será:

   `https://<tu-usuario>.github.io/gab_Grupo-de-Ayuda-a-Bodegueros/`

## Sincronizar textos de perros desde WordPress

```bash
npm run sync-dogs
```
