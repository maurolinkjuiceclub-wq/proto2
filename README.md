# Mesa de Cotejo

Herramienta interna de outreach para Link Juice Club. Muestra, en una sola pantalla, el borrador del correo que vamos a enviar a un medio y, al lado, el dato exacto que tenemos de ese medio en la base de datos con la cita textual del correo que lo respalda.

El objetivo es que nadie envíe una cifra, un nombre o una condición que no esté respaldada por un correo real.

**⚠️ Este repositorio debe ser privado.** Contiene tarifas que los medios nos dieron en privado, sus direcciones de contacto y citas textuales de correspondencia privada. Publicarlo expondría los precios de nuestros proveedores.

---

## Qué revisar aquí

| Archivo | Para qué |
|---|---|
| [`revision/respuestas-y-logica.md`](revision/respuestas-y-logica.md) | **Empezar por aquí.** Los 8 medios, uno por uno: qué tenemos confirmado, con qué cita, qué falta, qué borrador propone la herramienta y por qué está redactado así. Es el documento para comentar línea por línea. |
| [`metodo.md`](metodo.md) | Las reglas de verificación que se aplican: de dónde puede salir un nombre para el saludo, por qué solo se registran precios dofollow, qué significa verde y naranja. |
| `mesa-cotejo.html` | La página en sí. Un solo archivo, sin dependencias. Se abre en cualquier navegador. |

Para dejar comentarios, lo más cómodo es abrir un Pull Request sobre `revision/respuestas-y-logica.md` y comentar sobre las líneas concretas.

---

## Estado actual (31/08/2026)

De 8 seguimientos preparados, tras releer los hilos completos en los dos buzones:

- **3 enviables** — noticiasdealmeria.com, cuencanews.es, cabtfe.es
- **3 corregidos antes de enviar** — merca2.es, mindies.es, hyliacom
- **2 que no hay que enviar** — madridpress.com y quepasa.com.ve, porque ya habían contestado

El detalle de cada decisión, con las citas, está en el documento de revisión.

---

## Lo que la herramienta hace y lo que no

**Hace:**
- Enseña el borrador y la fila de la base de datos lado a lado, con la cita del correo que respalda cada cifra.
- Marca en verde lo confirmado por escrito y en naranja lo que sigue sin confirmar, igual que la hoja de cálculo.
- Cambia entre las versiones del mensaje y elige el buzón correcto (mauro@ o simon@) según a quién pertenezca el hilo.
- Abre Outlook con el mensaje ya montado. **El envío lo hace la persona a mano.**
- Guarda el estado de cada medio (enviado, pendiente, por reescribir) y permite exportar esas notas.
- Interfaz en español o inglés.

**No hace:**
- No envía correos por su cuenta. La conexión con Outlook es de solo lectura.
- No se sincroniza en vivo con la hoja de cálculo ni con el buzón. Los datos se cargan cuando se actualiza la página.
- No genera texto nuevo mientras se usa. Las versiones de cada mensaje están escritas de antemano.
- No traduce los borradores ni las citas. Los borradores van en español porque los medios son hispanohablantes, y las citas son prueba: traducirlas las invalidaría.

---

## Cómo se abre

```
open mesa-cotejo.html
```

No necesita servidor ni instalación. Los datos van dentro del archivo.

---

## In English, for Senad

This is an internal outreach tool. It shows the email draft we are about to send to a publisher next to the exact record we hold for that publisher, with the verbatim quote from their email that backs every figure. The point is that nobody sends a price, a name or a condition that is not backed by a real email.

Start with [`revision/respuestas-y-logica.md`](revision/respuestas-y-logica.md): it walks through all eight publishers with the evidence, what is still open, the proposed draft and the reasoning behind its wording. Open a Pull Request against that file to leave line-by-line comments.

Two things stay in Spanish on purpose: the drafts, because they go to Spanish-language publishers, and the quoted emails, because they are evidence and translating a quote stops it being a quote. The tool's interface itself has an ES/EN switch. If you would like the review document in English as well, say so and it will be added.

The tool does not send email. Outlook access is read-only; it prepares the message and a person clicks send.
