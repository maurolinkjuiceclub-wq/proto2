# El modelo de datos, y por qué cambió

## El problema

La mesa guardaba **conclusiones, no correos**. El correo real vivía en Outlook; en la ficha había
cuatro copias a mano de lo que alguien había entendido de ese correo (`cuerpoSemilla`,
`ultimaRespuesta`, `nuestroUltimo`, `quotes`), escritas en momentos distintos. No existía ningún
camino que fuera del buzón al campo.

Medido sobre las 47 fichas antes de tocar nada: **las 47** guardaban la misma conversación en tres
o más representaciones paralelas. Por eso una ficha enseñaba el correo del 04/09 mientras sus
propias citas ya tenían el del 09/09. No fue mala suerte: es lo que tiene que pasar cuando el mismo
hecho está copiado en cuatro sitios y cada actualización toca unos sí y otros no.

## 1. Un solo registro: `d.mensajes`

Cada ficha tiene un array ordenado por fecha. Cada entrada lleva cuándo, quién (`ellos` /
`nosotros`), el texto y de qué tipo es la fuente:

| tipo | qué es |
|---|---|
| `cuerpo` | el correo entero, leído de la API |
| `fragmento` | una cita guardada, solo un trozo |
| `adjunto` | un xlsx o un pdf que se abrió |
| `marca` | un correo nuestro del que solo sabemos la fecha |
| `sin-texto` | sabemos que contestaron ese día y no tenemos el texto |

`cuerpoSemilla`, `ultimaRespuesta` y `nuestroUltimo` se calculan de ahí en `normalizar()`.

El tipo `sin-texto` es la pieza que faltaba: antes, saber que alguien contestó sin tener el texto no
tenía dónde vivir, así que o se perdía el dato o se dejaba el cuerpo viejo aparentando ser lo
último.

## 2. Ninguna cifra afirmada sin fuente

Al encender la comprobación salieron cuatro casos con **tres causas distintas**:

**Formato.** «115,20 €» en el resumen y `115.20` en la celda: la misma cifra escrita de dos maneras.
Falso positivo del comparador. El parser ahora distingue decimal de separador de millar, así que
«3.000» son tres mil y «115,20» son ciento quince con veinte.

**Cuentas escritas como datos.** Un `91 €` que era aritmética sobre «un 30% sobre el precio», una
frase que admite dos lecturas. No había fuente porque no existía. Es el caso que originó todo esto.

**Datos de adjuntos sin sitio donde vivir.** El más interesante, porque era estructural. Dos fichas
afirmaban precios (`96 €–432 €`, `3.000 €`) que **eran correctos y estaban verificados**: salían de
un xlsx y de un pdf leídos en su día. Pero `quotes` solo admitía texto de cuerpos de correo, así
que un dato sacado de un adjunto no tenía dónde guardarse y acababa afirmado en prosa. Ahora existe
`d.adjuntos`.

### Confirmado por asentimiento

Algunos precios no aparecen en ningún correo del medio porque salen de una pregunta **nuestra** que
ellos contestaron con un «sí». Ejemplo real:

> «¿Siguen en pie hoy los 50 € de adictosalinux.com, los 90 € de adictec.com y los 130 € de
> esgeeks.com y ccnadesdecero.es en su versión dofollow?»
> — «Sí. Los precios son así.»

Está confirmado, pero si nos equivocamos al escribir la pregunta, su «sí» confirma la errata. La
comprobación distingue ese caso y lo dice.

## 3. Lo incomprobable no es lo mismo que lo correcto

`d.comprobable` se calcula de `hilo.buzon`. 26 de 47 fichas tienen el hilo en un buzón sin acceso.
Antes se pintaban igual que las verificadas.

## La regla, en tres líneas

1. El barrido escribe **mensajes literales**: fecha, quién, texto, tipo de fuente. Nada más.
2. Precios, estado, pelota y cuerpo **se calculan**. No se escriben.
3. Una cifra sin mensaje detrás no se puede afirmar. Si sale de una cuenta, va como deducción.
