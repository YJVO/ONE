# ONE — Music

Página web musical estática, lista para GitHub Pages.

## Estructura

- `index.html` — estructura de la aplicación.
- `style.css` — diseño responsive.
- `script.js` — reproductor, búsqueda, favoritos, playlists y cola.
- `assets/covers/` — portadas SVG incluidas.
- `assets/audio/` — coloca aquí tus archivos MP3.

## Añadir música

Abre `script.js` y agrega objetos al arreglo `songs` siguiendo el mismo formato:

```js
{
  id: 9,
  title: "Mi canción",
  artist: "Mi artista",
  album: "Mi álbum",
  genre: "Pop",
  duration: "3:30",
  audio: "assets/audio/mi-cancion.mp3",
  cover: "assets/covers/mi-portada.svg"
}
```

## Publicar en GitHub Pages

1. Crea un repositorio llamado `ONE`.
2. Sube todo el contenido de esta carpeta.
3. Ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub publique el sitio.

No requiere Node.js, npm ni servidor.
