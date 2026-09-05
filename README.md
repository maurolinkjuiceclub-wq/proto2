# Mesa de Cotejo · Link Juice Club

Una sola página HTML para llevar el outreach a medios: qué nos ha dicho cada
editor, qué le toca a quién, y qué hay que volcar a la hoja de tarifas.

Sin build, sin dependencias, sin servidor. `mesa-cotejo.html` se abre con doble
clic y funciona.

## Qué hay aquí

| | |
|---|---|
| `mesa-cotejo.html` | La aplicación. 43 fichas, 119 filas de outreach, 407 KB |
| `datos/outreach.tsv` | Las 119 filas completas, listas para pegar en la hoja |
| `datos/outreach-solo-confirmado.tsv` | Igual, pero solo las celdas confirmadas por correo. Las demás van vacías para no pisar nada que ya esté bien |
| `datos/fichas.json` | Las 43 fichas en JSON: condiciones, borradores, cuerpos reales de sus correos |
| `docs/estado.md` | Quién espera a quién, hoy |
| `docs/como-funciona.md` | El mecanismo, y los errores que lo obligaron a existir |

## Qué resuelve

Llevábamos el outreach con una hoja de cálculo y dos buzones (`simon@` y
`mauro@`). Los tres problemas que se repetían:

**Se rompían los hilos.** Outlook decide qué continúa una conversación por el
asunto. Contestar con un asunto distinto abre un correo nuevo, y el editor
acaba con dos conversaciones sueltas. Cada ficha guarda ahora el asunto exacto
que tiene el hilo en el buzón, verificado contra el correo.

**Se preguntaba dos veces lo mismo.** La mesa se construía con el resumen de
250 caracteres que devuelve la búsqueda de Outlook, y en una respuesta ese
resumen suele ser *nuestro propio correo citado*. Así se guardaban preguntas
nuestras como si fueran respuestas suyas. Ahora se lee el cuerpo entero.

**No se sabía de quién era el turno.** La carpeta dependía de una marca a mano
que nadie limpiaba. Ahora la mesa compara la fecha de su último correo con la
del nuestro, leyendo las bandejas de entrada **y** de enviados de los dos
buzones, y coloca la ficha sola.

## Cómo se usa

1. Abrir `mesa-cotejo.html`.
2. **Refrescar correo.** Lee los dos buzones y recoloca las 43 fichas. Mientras
   no se haga, sale una franja naranja avisando de que los datos son de la
   última publicación.
3. Abrir una ficha de «Por contestar». Arriba está el cuerpo real de su último
   correo; debajo, el borrador que le corresponde.
4. Copiar el borrador y **responder dentro del hilo**, desde el buzón que
   indica la ficha.

La mesa **solo lee correo**. No envía nada.

## Para volcar a la hoja

`datos/outreach-solo-confirmado.tsv` se pega directamente. 746 celdas
confirmadas por correo. Ojo con dos cosas:

- **78 de las 119 filas no existen todavía en la Database.** Salen marcadas
  «nueva»: son medios que contestaron y nunca se dieron de alta.
- Los dominios salen de lo que cada editor nos listó por correo. Si alguno ya
  está en la hoja con otro nombre, saldrá duplicado.

## Regla de los contactos

Cuando hay dos direcciones para un medio, la que lleva el nombre oficial de la
página va en **Webmaster Contact** y cualquier otra en **Webmaster Extra
Contact**.

## Estado

Generado el 5 de septiembre de 2026 · versión v50 de la mesa.
Ver `docs/estado.md`.
