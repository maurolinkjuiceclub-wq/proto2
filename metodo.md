# Reglas de verificación

Estas son las reglas que se aplican tanto en la base de datos como en los borradores. Nacieron de errores concretos que ya habíamos cometido, no de una preferencia de estilo. Cada una lleva el caso que la motivó.

---

## 1. El nombre del saludo tiene que venir de una firma que el contacto escribió él mismo

Nunca del nombre que hay en la hoja de cálculo, nunca de una dirección en copia, nunca del nombre de la cuenta de Outlook o Exchange.

Clasificación que se usa al revisar un contacto:

| Clasificación | Qué significa | ¿Se puede usar en el saludo? |
|---|---|---|
| **Firmado** | El contacto escribió su nombre en el cuerpo del correo | Sí |
| **Solo remitente** | El nombre solo aparece como nombre de cuenta, él nunca lo escribió | No |
| **Solo rol** | Solo se identifica un departamento o una marca | No |
| **Ninguno** | No hay nombre en ninguna parte | No |
| **Conflicto** | La firma del cuerpo y el nombre de la cuenta no coinciden | No, hasta aclararlo |

**El caso que la motivó.** El 26/08 se envió un correo a un contacto de correoandalucia.es que empezaba «Hola Verónica,». Ese nombre no aparece en ninguna parte de esa conversación. El 27/08 el contacto contestó: *«Creo que te has confundido, no soy Verónica.»* La cuenta figura como «Elena Muñoz Baranco» en Outlook, pero ella tampoco ha escrito ese nombre nunca en el cuerpo, así que tampoco se usa.

En la herramienta, cada medio indica si el nombre está confirmado o no, y el saludo del borrador ya viene con o sin nombre según corresponda.

---

## 2. Solo se registran precios dofollow

Cuando un medio ofrece varios tramos, el que se guarda en la base de datos es el dofollow. Si un medio no confirma precio dofollow para una categoría, esa celda se queda vacía y en naranja con un comentario, en vez de rellenarla con el precio sponsored u otro valor que no corresponde.

Y no se asume que el precio general se aplica a las categorías especiales (casino, cripto, forex, CBD, dating) a menos que el contacto lo diga.

**El caso que la motivó.** Grupo Merca2 (8 medios) estaba en la hoja a 350 € marcado como dofollow. Los 350 € son con enlace `rel="sponsored"`; el dofollow son 500 € + IVA. Ocho filas con el precio equivocado por confundir los dos tramos.

En casino ese mismo grupo solo ofrece sponsored a 600 € y no tiene versión dofollow, así que esa celda queda en naranja con la explicación, no en verde.

---

## 3. Verde solo si hay cita textual

- **Verde** = confirmado por escrito, con la cita del correo guardada en el comentario de la celda.
- **Naranja** = vacío, sin confirmar, pendiente de preguntar, o rechazado explícitamente.
- **Sin color** = no se ha revisado en esta auditoría.

Un dato que suena razonable pero no tiene cita detrás no se pinta de verde. En el documento de revisión, donde no hay cita textual se dice explícitamente «confirmado por escrito» describiendo el dato, sin entrecomillar. **No se inventa una cita para que la ficha parezca más completa.**

**El caso que la motivó.** En una pasada anterior se dieron por buenos tres datos que al releer los correos no aparecían: un precio de 85 € para viajaresvida.com (el real era 100 €), un precio de 90 € para lapreferente.com atribuido a un contacto que nunca había mencionado ese dominio, y un cambio de permanencia en elclarinweb.com del que no existe la cita. Los tres se retiraron.

---

## 4. Antes de enviar, releer el hilo completo, incluidos los enviados

No basta con mirar la última respuesta del contacto. Hay que comprobar si la pregunta ya está contestada, si un compañero ya envió ese mismo seguimiento, y si el último mensaje del hilo es nuestro.

**El caso que la motivó.** De los 8 seguimientos preparados el 31/08, dos ya estaban contestados. En madridpress.com las tres preguntas se habían hecho el 27/08 y contestado el mismo día. En quepasa.com.ve, el CBD y el dating ya estaban excluidos por escrito en su lista de temas sensibles. Y en cinco de los ocho hilos el último mensaje era nuestro, diciendo que ya habíamos registrado sus condiciones, así que cualquier «una preguntita rápida» contradecía lo último que les habíamos dicho.

---

## 5. Un mismo dominio confirmado no confirma a su hermano

Si un contacto es dueño de varios dominios, un precio confirmado para uno no vale para los otros. Hay que verificar que mencionó **ese** dominio concreto.

**El caso que la motivó.** Se dio por bueno un precio para lapreferente.com porque el contacto era el mismo que el de alsoldelacosta.com. Al releer los correos, todo lo que había confirmado era sobre alsoldelacosta.com. Más adelante apareció un hilo suelto donde sí se le preguntó por lapreferente.com y respondió con precio, pero firma como director del otro medio, así que sigue marcado como ambiguo y pendiente de aclarar.

---

## 6. Con listas largas, buscar al dueño real

Cuando un solo contacto ofrece decenas de dominios, muchas veces es un revendedor y no el dueño. Merece la pena intentar llegar al medio directamente antes de aceptar su precio.

**Lo que ha aparecido hasta ahora al aplicarlo:**

| Medio | Vía revendedor | Directo | Diferencia |
|---|---|---|---|
| quepasa.com.ve | 150-165 € | 54 € general / 75 € categorías | Cobraba casi el triple |
| elimpulso.com | 250 € | 150 USD | 100 € por inserción |
| madridpress.com | 300 € | 100 € + IVA | 200 € por inserción |
| cuencanews.es | 80 € | 70 € | 10 € |

En el archivo hay bloques enteros por revisar con este criterio: un intermediario con ~25 medios españoles grandes (abc.es, huffingtonpost.es, libertaddigital.com) y otro con ~50 medios venezolanos.

---

## 7. Distinguir «dijeron que no» de «no lo dijeron»

Una celda vacía es ambigua. Se usa:

- **`Rechazado`** cuando el contacto lo descartó explícitamente. Ejemplos: hyliacom con cripto, quepasa.com.ve con CBD y dating, ultimasnoticias.com.ve con cripto y CBD, elimpulso.com con CBD y dating, noticiaalminuto.com con dating.
- **`A negociar`** cuando dijeron que no tienen precio fijo. Ejemplo: la red de estebantrujillo con casino, apuestas, dating y cripto.
- **Vacío y naranja** cuando simplemente no se ha preguntado.

Esto evita volver a preguntar algo que ya nos contestaron, que es exactamente lo que estuvo a punto de pasar con quepasa.com.ve.

---

## 8. Dos comprobaciones antes de cada envío

1. Que el destinatario venga de la base de datos y no de una dirección adivinada. De 8 rebotes en la ventana revisada, 6 eran evitables: se adivinó una dirección cuando la hoja ya tenía el contacto bueno.
2. Que el nombre del medio aparezca escrito en el cuerpo, y que sea el medio correcto. Ha pasado escribir a un medio hablándole de otro, y dejar un marcador de plantilla sin rellenar (`nos recomendaron Nombredelsitioweb`).
