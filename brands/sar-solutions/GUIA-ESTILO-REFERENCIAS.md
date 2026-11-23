# Guía de estilo SAR · "Referencias edtech" (oct 2026)

Estilo pedido por Oscar el 25-oct-2026 a partir de 21 anuncios de referencia (Coursera, Udemy Business, HubSpot, Meta for Business, Blip, Hotmart, Articulate, Mercado Pago, Nuukmaan, Global Tecnologías). Se toma el **lenguaje de diseño**, nunca sus colores: cada pieza usa los colores de SAR o de su categoría. Hilo de origen: "SAR · Diseño · Referencias".
Esta guía define **cómo se ve**. Qué se dice (ángulos, ganchos, textos) sigue mandando `Estrategia/guia-anuncios.md` y `ofertas/`.


## 0. Primero el sello SAR (corrección de Oscar, 25-oct-2026)
Oscar vio la primera tanda y dijo que "se ve como copia" de los anuncios de referencia. De las referencias solo se toma la **idea de acomodo**; todo lo demás tiene que verse SAR. En cada pieza van, sí o sí:
- **Escuadras en las 4 esquinas** del lienzo (líneas delgadas en L, 64 px, 2 px).
- **Cuadritos del logo** (pixeles) flotando en diagonal, en el color de la categoría, chicos y medianos.
- **Etiqueta con raya**: rayita de 44 px + texto en mayúsculas muy espaciado (letter-spacing .28em).
- **Titular en dos tonos**: primer renglón sólido y el segundo en degradado claro del color de la categoría.
- **Letra Jost** (títulos 600–700) e Inter para lo chico.
- **Tarjeta de precio de cristal o de color**: rótulo chico ("TODOS LOS MÓDULOS POR"), precio enorme con "MXN" chico y botón **píldora blanca "Regístrate →" con halo**.
- Mosaicos/tiles con **brillo diagonal** (reflejo blanco suave en la esquina).
- Inocuidad: **tiras verticales de largo desigual** y amarillo en contornos delgados; etiqueta sólida "INOCUIDAD ALIMENTARIA".
- Logo de una sola tinta (blanco, tinta o morado) cuando el azul del logo choque con la paleta de la categoría.
Código de ejemplo de las 5 propuestas v2: carpeta del proyecto "SAR Diseno Referencias/proyecto/v2" (sar.css tiene el kit).

## 1. La idea en una frase
Fondo de un solo color fuerte (sólido o degradado profundo), titular grande alineado a la izquierda, un elemento héroe (persona latina real o un objeto 3D: laptop, celular, temario, certificado) y **tarjetas de interfaz flotando** alrededor que "demuestran" el beneficio. Mucho aire, poco texto, todo limpio.

## 2. Jerarquía fija (de arriba a abajo)
1. **Logo SAR** arriba a la izquierda, chico, versión sin fondo (claro sobre oscuro, original sobre claro). Nunca con caja blanca.
2. **Etiqueta** (overline) pequeña: MAYÚSCULAS, 26–30 px, peso 700, espaciado 2–3 px. Ej.: "CURSO EN LÍNEA | CON DC-3", "NUEVO 2026". Puede ir dentro de una píldora clara o de una cinta de color (estilo "NUEVA FUNCIÓN" / "CURSOS").
3. **Titular** 80–110 px, 2–4 renglones, interlineado 1.05. Dos recursos (usar uno, no los dos):
   - Peso mixto: primera parte 800 y el resto 400 ("**Domina SAP** desde cero").
   - Palabra clave en el color acento de la categoría (como "WhatsApp" en verde de Meta) o un punto final de color (como el "." naranja de HubSpot).
4. **Subtítulo** 38–44 px, peso 400, máximo 2 renglones.
5. **Botón "Regístrate"**: rectángulo con esquinas 10–14 px (o píldora), relleno sólido, texto 700, flecha → opcional. Alto ~90 px. Nunca otro texto.
6. Precio, cuando va: **tarjeta de precio** blanca (estilo Mercado Pago) con el precio grande 800 y, al lado, un bloque de color con el dato extra ("9 cursos", "DC-3"). Precio exacto de la oferta, sin inventar descuentos.

Letra: Avenir Next / Inter (la de SAR). Variante "editorial" ocasional (como Hotmart): titular en Bodoni Moda con la primera palabra en color acento; ya existe aprobada en el estilo revista premium.

## 3. Elemento héroe (elegir uno)
- **Persona latina/mexicana real** (stock gratis, mostrar miniaturas antes), recortada o en foto completa con degradado oscuro hacia abajo para que el texto se lea. Trabajando en laptop, con tablet, sonriendo a cámara.
- **Objeto 3D en perspectiva**: laptop con pantalla del curso (estilo Coursera), celular con la plataforma, temario/folleto inclinado (estilo Udemy/HubSpot "reporte"), certificado DC-3. Siempre hecho en código o captura real, nunca texto generado por IA.

## 4. Tarjetas flotantes (lo que más distingue el estilo)
- Blancas o "cristal" (blanco 85–90 % con desenfoque), esquinas 18–24 px, sombra suave grande (0 20px 60px rgba(0,0,0,.25)).
- Tipos que funcionan para SAR:
  - **Tarjeta credencial** (Coursera): cuadro con icono/logo del curso + nombre del curso en 2 renglones + "Constancia DC-3".
  - **Chips con icono de línea** (Coursera Power BI): "100 % en línea", "A tu ritmo", "Constancia DC-3", "Acceso inmediato".
  - **Notificaciones** (Blip): "Nuevo mensaje · Me interesa el curso", "Inscripción confirmada ✓", "Ana completó el módulo 3".
  - **Mini gráfica de barras** redondeadas o tarjeta de avance de curso.
  - **Sello circular** con check (Udemy) o insignia redonda tipo estampa (Hotmart) para "DC-3" / "2026".
- Máximo 3–4 tarjetas por pieza; ligeramente encimadas sobre el héroe, nunca tapando la cara.

## 5. Detalles finos (usar 1 o 2 por pieza)
- Marco de selección delgado con puntitos en las esquinas alrededor del titular (Coursera).
- Círculos con icono de línea conectados por líneas finas (red de nodos).
- Ondas o listones suaves de luz en el fondo (Udemy reporte, Articulate).
- Brillo/halo detrás del héroe (resplandor radial del color de la categoría).
- Anillos de pulso alrededor del botón o un chip (Meta WhatsApp).
- Flecha dibujada a mano apuntando al botón (HubSpot).
- Bloques de color grandes con esquinas redondeadas formando un mosaico (Udemy Business) — solo con colores permitidos de la categoría.

## 6. Paletas por categoría (obligatorias)
| Categoría | Fondo | Acento / botón | Tarjetas y texto | Prohibido |
|---|---|---|---|---|
| **SAR general / SAP** | Degradado azul `#1E6BFF` → marino `#071530` (estilo Coursera). SAP: `#275D90 / #2F5E95 / #356CA8` | Cian `#22D3EE`, botón `#1E6BFF` | Blanco, texto `#071530` | — |
| **Logística** | Degradado morado `#9B5DE5` → `#5B2E9E` → `#3B1E6E` (estilo Udemy violeta) o fondo `#F7F4FC` claro | Botón `#5B2E9E` o blanco con texto morado | Blanco, lilas `#F2ECFB / #E0D5F3 / #C9B8EA` | Todo lo que no sea morado o blanco (ni verde menta, ni naranja, ni azul) |
| **Inocuidad** | Naranja sólido `#F26A1B` (estilo HubSpot) o blanco con rellenos naranja | Amarillo `#FFC629` (en línea aprobada: solo contornos delgados), verde agua `#14B8A6` | Blanco, crema `#FFF3D1`, texto `#1B1B1F` | Azules, morados |
| **ISO** | Color de la norma: 9001 azul `#1E6BFF`, 14001 verde `#16A34A`, 45001 naranja `#F2701C`, 19011 negro `#111111` | Una banda de color detrás del nombre de la norma (estilo Nuukmaan "ISO 9001:2015") | Blanco | Mezclar colores de normas en una sola pieza individual (en el paquete de 4 sí, una tarjeta por norma) |

Texto oscuro sobre fondo claro y blanco sobre fondo oscuro; revisar contraste.

## 7. Composición en 9:16 (1080×1920) con zona segura x65–880, y384–1250
- Fuera de la zona: solo fondo, ondas, parte del héroe y tarjetas decorativas sin texto.
- Arriba de y384 no va texto (ahí está el nombre de la cuenta en historias). Debajo de y1250 tampoco (Instagram pone su propio botón "Más información" y el texto del anuncio).
- Acomodo base A (Coursera): logo y384 → tarjeta credencial ~y470–640 → héroe 3D detrás → titular ~y760–1000 → subtítulo → botón ~y1150–1240.
- Acomodo base B (Blip/HubSpot): tarjeta grande con titular+botón arriba a la izquierda dentro de la zona; persona real ocupando la mitad baja (fuera de zona, sin texto); notificaciones flotando a la derecha (dentro de x≤880 si llevan texto).
- 4:5 y 16:9 se sacan solo después de que Oscar apruebe la 9:16, reacomodando (en 16:9: texto a la izquierda, héroe a la derecha).

## 8. Qué NO copiar de las referencias
- Sus colores, logos o textos; el botón siempre "Regístrate".
- Fotos genéricas que no se vean latinas/mexicanas.
- Textos en inglés, fondos saturados de 4 colores (Coursera Power BI) fuera de la paleta de la categoría.
- Logo SAR con fondo blanco, jamás.

## 9. Referencias resumidas
1. Coursera Meta (historia y feed): degradado azul→marino, laptop 3D, tarjeta credencial blanca, titular blanco izquierda, botón rectangular con flecha.
2. Coursera Power BI: chips de beneficio con icono, marco de selección con nodos, círculos conectados.
3. Udemy reporte: folleto inclinado en perspectiva sobre degradado violeta con ondas, etiqueta píldora "2026".
4. Udemy webinar: fondo claro con resplandor lila, etiqueta en mayúsculas, titular de peso mixto, mosaico de tarjetas (gráfica, foto, nombre, sello check).
5. Udemy Business: fondo negro con bloques de color redondeados y persona recortada.
6. Udemy pregunta: solo tipografía grande sobre degradado violeta + botón negro.
7. HubSpot (morado y naranja): etiqueta "Reporte 2026", titular enorme, punto de color, botón sólido, hojas del reporte inclinadas abajo, flecha a mano.
8. Meta WhatsApp: fondo verde oscuro, etiqueta clara, palabra clave en color acento, celular con interfaz, anillos de pulso.
9. Meta temporada / Meta AI: foto real con ilustración 3D o burbujas de chat y pasos "Recopilando información…".
10. Blip: persona latina real con laptop, tarjeta blanca con titular en mayúsculas pesado, notificaciones flotando.
11. Articulate: titular centrado pesado, botón píldora blanco, persona latina sonriendo al centro, tarjetas de curso y gráfica alrededor.
12. Hotmart: foto a todo color con degradado a oscuro, titular serif con palabra acento, cinta píldora de color con texto en mayúsculas, sello circular.
13. Mercado Pago: fondo oscuro, logo en bloque de color, tarjeta de precio con bloque de dato al lado, producto a la derecha.
14. Nuukmaan ISO: foto industrial oscurecida, texto centrado en mayúsculas, banda azul detrás de "ISO 9001:2015".
15. Global Tecnologías: etiqueta "CURSOS" en cinta, fila de iconos de herramientas en un panel.
