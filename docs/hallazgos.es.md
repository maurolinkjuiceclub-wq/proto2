# Lo que encontraron las comprobaciones al encenderlas

Cada una de estas comprobaciones ocupa unas pocas líneas y ninguna se había corrido nunca.

## Remitente contra buzón del hilo — 11 de 47

Diez fichas decían contestar desde `mauro@` cuando el hilo llevaba días viviendo en `simon@`:
falsos bloqueos que mandaban a un buzón sin acceso. Una decía lo contrario —`simon@` cuando el hilo
estaba en `mauro@`—, que es la peligrosa: contestar desde ahí abre un hilo nuevo y el medio acaba
con dos conversaciones sueltas.

## Cuerpo contra última respuesta — 8 de 47

Ocho fichas enseñaban un correo más viejo que la última respuesta recibida. El peor caso, 16 días.
Tres se refrescaron con el correo real; las otras viven en el buzón sin acceso y ahora lo dicen en
la propia ficha.

## Precios contra mensajes — 32 de 132 celdas

Una de cada cuatro celdas de precio contenía una cifra que no aparecía en ningún mensaje de su
ficha. Al buscar el origen se recuperaron ocho (un correo que existía en el buzón y nunca se había
guardado, y un media kit adjunto). De las que quedan, la mayoría son de fichas sin acceso.

Dos estaban además **marcadas como confirmadas** sin que nadie las hubiera dicho por escrito, y
habrían salido a un cliente como precio cerrado.

### Dos que conviene mirar a mano

- Una ficha lleva el mismo precio en las seis categorías y las notas del proyecto ya advertían de
  que esa cifra venía **de un intermediario, no del medio**, siendo contacto directo. En la mesa se
  leía igual que un precio confirmado por el editor.
- Otra tiene un `Casino` que no encaja con ninguna otra celda de su ficha, y su hilo **sí es
  legible**, así que la cifra debería estar y no está. Huele a celda mal copiada.

## Razonamiento circular en la propia comprobación

La primera versión del comprobador aceptaba **la celda como prueba del resumen**. Los dos son
campos escritos a mano, así que uno respaldando al otro no demuestra nada: un precio acababa
respaldándose a sí mismo. Corregido — solo los mensajes cuentan como fuente.
