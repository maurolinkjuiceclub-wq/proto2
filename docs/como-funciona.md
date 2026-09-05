# Cómo funciona · y por qué

Cada mecanismo de la mesa existe porque algo salió mal. Este documento cuenta
las dos cosas juntas, porque si se pierde el porqué alguien acabará
«simplificando» el cómo.

## 1. La identidad del hilo

**El problema.** Outlook decide qué continúa una conversación por el **asunto**.
Cinco fichas guardaban un asunto que no existía en el buzón, así que contestar
desde ellas abría una conversación nueva y el editor acababa con dos hilos
sueltos.

Casos reales: `madridpress` tenía «RE: Artículos patrocinados» cuando el hilo
era «Oportunidad de colaboración editorial». `motorpoint` tenía
`to:"mauro"` — el borrador iba dirigido literalmente a «mauro» en vez de a
`concha@motorpoint.com`.

Y lo hicimos nosotros también: a `marketing.grupolarazon@gmail.com` le salieron
**tres propuestas en frío con tres asuntos distintos el 28/08 entre las 14:01 y
las 14:03**. Contestó por dos y mandó el mismo tarifario dos veces.

**La solución.** Cada ficha guarda `hilo:{asunto, buzon, verificado}` con el
asunto exacto leído del buzón. En cada refresco se compara con el asunto del
último correo entrante, y si no coinciden la mesa lo dice arriba de la caja.

La comparación ignora `Re:`/`RE:`/`RV:`/`Odg:`/`Fwd:` apilados, espacios
finales, puntos y acentos — eso es ruido que añaden los clientes de correo. Lo
que tiene que coincidir es el resto.

## 2. El cuerpo entero, nunca el resumen

**El problema.** `outlook_email_search` devuelve un campo `summary` con unos
250 caracteres tomados del **principio del cuerpo**. En una respuesta, el
principio del cuerpo suele ser **nuestro propio correo citado**.

El caso que lo destapó: Carlos Escrivá contesta **en línea**, pegando nuestra
pregunta y escribiendo la respuesta detrás de un `--`:

```
- ¿Me confirmas que son 400? --- GENTE DE LA SAFOR: 300€
```

El `summary` se cortaba justo antes del `---`. Leído así parecía que Carlos
preguntaba. Estaba contestando, y la ficha llevaba una nota en mayúsculas
pidiendo subir un precio que ya estaba bien.

**La solución.** `read_resource` devuelve el cuerpo real. La mesa lo pide en
cada refresco para las fichas donde un borrador equivocado hace daño (hasta 14,
las reabiertas y las no leídas primero) y a demanda para el resto.

El corte del historial citado es un barrido por líneas que para en la cabecera
de la cita (`On … wrote:`, `El … escribió:`, `Op … schreef`, `_____`,
`De:`/`From:` con compañía, `Confidentiality notice`) y en la línea de firma
`--`. **Las respuestas en línea siempre van antes de esa cabecera**, así que
sobreviven enteras. Y hay un enlace «Ver también lo citado» por si el corte se
pasa: nada queda oculto de forma irreversible.

> Regla: ninguna cita entra en una ficha desde un `summary`. Solo desde un
> cuerpo leído con `read_resource`.

## 3. De quién es el turno

**El problema.** La carpeta se decidía por una marca a mano que nadie limpiaba.
Una ficha marcada como enviada se quedaba en «Enviados» para siempre, aunque el
medio contestara.

Y al revés: yo apuntaba a mano de quién era el turno, y me equivocaba. Buscaba
«nuestro último correo» solo en el buzón que tenía el último mensaje **suyo**,
pero los hilos de `mauro@` se contestan muchas veces desde `simon@`. Nueve
fichas salían en la cola con la pelota en el tejado del medio, y seis de ellas
con un borrador que empezaba «perdona la tardanza» cuando la tardanza era suya.

**La solución.** La mesa ya leía Elementos enviados de los dos buzones en cada
refresco. El dato estaba ahí desde el principio; ahora se usa:

```
ultimoEntrante(d)  ->  su último correo      (Inbox de los dos buzones)
ultimoSaliente(d)  ->  nuestro último correo (Enviados de los dos buzones)
turno(d)           ->  compara las dos fechas
```

Cuatro estados: `suya` (esperamos nosotros), `nuestra` (nos toca), `acuse` (nos
toca pero su correo es un «ok, gracias») y `sin-datos`. Las carpetas salen de
ahí, no de una marca. Marcar a mano sigue valiendo — cuenta como haber
contestado — hasta que el buzón diga otra cosa.

## 4. El aviso de datos viejos

**El problema.** El 4 de septiembre a las 14:59 Alex Linux contestó una
pregunta. La mesa se publicó con datos anteriores. A las 23:18 se le mandó el
borrador preguntando exactamente eso. A las 23:27 contestó:

> «No sé si leíste mi correo anterior»

La mesa no mentía. Estaba desactualizada y no lo decía.

**La solución.** Una franja naranja encima del borrador mientras nadie haya
refrescado en ese navegador: *«Estos datos no se han comprobado hoy. Vienen de
la lectura del [fecha]. Dale a Refrescar correo antes de enviar.»* Al refrescar
se convierte en una línea gris con la hora real.

## 5. La tabla de outreach

**El problema.** Era una lista escrita a mano en otra parte del fichero, sin
conexión con las fichas. Se quedó en 18 filas mientras las fichas se corregían
durante días, y 18 medios con datos confirmados (70 celdas verificadas) no
aparecían siquiera.

**La solución.** Se genera de `DOMAINS`. Una fila por medio publicable; las
condiciones salen de la ficha y el precio propio del sitio de `FILAS`, cuando
ese editor cobra distinto por dominio. Cambiar una ficha cambia la tabla.

De 18 a 119 filas.

## Lo que la mesa no hace

**No envía correo.** Lee los dos buzones y compone borradores. Enviar es
siempre un acto humano, dentro del hilo, desde el buzón que la ficha indica.

## Permisos que hay que saber

- El **Sent Items de `mauro@`** no acepta búsqueda por texto: devuelve
  FORBIDDEN. Solo se lee con `folderName` + `mailboxOwnerEmail` +
  `afterDateTime` + `order`, paginando. Buscar con `query` falla en silencio y
  se acaba leyendo un correo viejo citado dentro de la respuesta del medio.
- La página declara dos herramientas de Microsoft 365:
  `outlook_email_search` y `read_resource`. Ambas de solo lectura.
