# Mesa de Cotejo

Herramienta interna de Link Juice Club para llevar el outreach a medios: 47 fichas de editores,
con lo que cada uno ha confirmado por escrito, el borrador de respuesta y la fila que acaba
volcándose a la hoja de precios.

Es un único fichero HTML autocontenido. Se abre en el navegador, no necesita servidor ni build.

```
mesa-de-cotejo.html      la aplicación entera
tools/auditar.mjs        las comprobaciones de integridad, para CI
docs/                    por qué el modelo de datos es como es
```

---

## La idea que sostiene todo esto

La versión anterior guardaba **conclusiones, no correos**. El correo real vivía en Outlook y en la
ficha había cuatro copias a mano de lo que alguien había entendido de ese correo, escritas en
momentos distintos. Nada las mantenía de acuerdo entre sí.

El resultado medido, antes de arreglarlo: las **47 fichas** guardaban la misma conversación en tres
o más representaciones paralelas, **11** decían contestar desde un buzón distinto de donde vivía el
hilo, **8** enseñaban un correo más viejo que la última respuesta —una con 16 días de desfase— y
**32 de 132** celdas de precio contenían una cifra que no aparecía en ningún mensaje.

Ninguno de esos fallos fue de lectura. Los correos se habían leído bien. Fueron actualizaciones
parciales de un dato duplicado, y juicios registrados con la misma cara que los hechos citados.

Así que el modelo se invirtió: **hay un solo registro de mensajes por ficha y todo lo demás se
calcula de él.**

---

## Las tres invariantes

**1. El hilo vive en un sitio.** Cada ficha tiene `mensajes[]`, ordenado por fecha, donde cada
entrada dice cuándo, quién (`ellos` / `nosotros`), el texto y de qué tipo es la fuente: `cuerpo`
(correo entero), `fragmento` (una cita), `adjunto` (un xlsx o un pdf que se abrió), `marca` (un
correo nuestro del que solo sabemos la fecha) o `sin-texto` (**sabemos que contestaron y no tenemos
el texto**).

`cuerpoSemilla`, `ultimaRespuesta` y `nuestroUltimo` ya no se escriben: los deriva `normalizar()`
al arrancar. La discrepancia entre ellos no es que se detecte, es que **no se puede escribir**.

El tipo `sin-texto` es la pieza que faltaba: antes, saber que alguien contestó sin tener el texto no
tenía dónde vivir, así que o se perdía el dato o se dejaba el cuerpo viejo aparentando ser lo
último. Ahora el hueco se guarda **como hueco**.

**2. El remitente no se decide, se copia.** `sender` tiene que ser igual a `hilo.buzon`, que es el
buzón donde está verificado que vive la conversación. Contestar desde otro rompe el hilo en Outlook
y el medio acaba con dos conversaciones sueltas.

**3. Un precio no puede declararse confirmado sin un correo detrás.** El estado de cada celda
—«confirmado» o «pendiente»— se **deriva** de buscar la cifra en los mensajes de su propia ficha.
El respaldo se clasifica en tres:

| respaldo | qué significa |
|---|---|
| `suyo` | la cifra está escrita en un correo o adjunto del medio |
| `asentimiento` | la cifra sale de un correo **nuestro** y ellos dijeron «sí» / «correcto» |
| `null` | no aparece en ningún mensaje |

Sin respaldo, la celda **no puede quedarse en confirmado**: la página lo recalcula y sobrescribe lo
que hubiera escrito a mano.

La distinción `asentimiento` importa: si nos equivocamos al escribir la cifra en nuestra pregunta,
su «sí» confirma la errata. Es válido, pero no es lo mismo que una cifra que escribieran ellos.

---

## Comprobaciones

La página se audita a sí misma en cada render y muestra arriba, plegado, lo que no cuadra; se abre
solo si el problema es de la ficha que estás mirando.

Pero eso solo sirve si alguien abre la página. `tools/auditar.mjs` corre las mismas comprobaciones
sin navegador y sale con código 1 si algo está roto:

```bash
node tools/auditar.mjs              # informe
node tools/auditar.mjs --estricto   # falla también con precios sin fuente
```

No reimplementa nada: extrae del propio HTML los datos y las funciones, así que no puede quedarse
desincronizado con lo que ve el usuario.

Separa tres categorías, y la distinción es deliberada:

- **ROTO** — una invariante incumplida en la parte legible. Hace fallar el CI.
- **SIN FUENTE** — un precio comprobable que nadie ha comprobado. Trabajo pendiente, no avería.
- **A CIEGAS** — bloqueado porque el hilo vive en un buzón sin acceso. No es que esté mal: es que
  no hay forma de saberlo.

---

## La limitación que no es técnica

**26 de las 47 fichas tienen el hilo en `mauro@linkjuiceclub.com`, un buzón compartido al que la
cuenta que corre el barrido no tiene acceso** (`ErrorAccessDenied · 403 · sharedMailbox: true`).

Esas fichas no se pueden leer, refrescar ni contestar en su hilo, y de los precios sin respaldo que
quedan, la mayoría son suyos. Todo lo que hay en este repositorio **protege solo la mitad de la
mesa que se puede leer.**

Se desbloquea dando a `simon@linkjuiceclub.com` permiso de **acceso completo** sobre el buzón
compartido `mauro@linkjuiceclub.com`, desde la delegación de buzón en el centro de administración
de Microsoft 365. No hace falta tenant nuevo ni licencia: es un permiso sobre un buzón que ya
existe en el dominio.

---

## Lo que el código no puede garantizar

Que la lectura de una frase ambigua sea la correcta. «Un 30% sobre el precio» admite dos lecturas
—49 € o 21 €— y alguien tiene que elegir. Lo que sí está garantizado es que esa elección **se vea
como elección** y no quede escrita con la misma cara que un dato citado.

El siguiente paso en esa dirección es partir `statusText` en dos listas, confirmado y deducido,
donde lo confirmado obligue a señalar el mensaje. Hoy el campo mezcla las dos cosas y la única
defensa es el aviso de cifras sin respaldo.
