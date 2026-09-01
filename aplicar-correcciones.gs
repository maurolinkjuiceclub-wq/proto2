/**
 * Mesa de Cotejo — aplica en la hoja las correcciones verificadas contra los correos.
 *
 * QUE HACE
 *   diagnostico()          Solo lee. No cambia nada. Dice cuantas celdas estan ya
 *                          correctas y cuantas faltan, y avisa si alguna fila se ha
 *                          movido de sitio. EJECUTA ESTA PRIMERO.
 *   aplicarCorrecciones()  Escribe los valores, pinta verde/naranja y pone la nota
 *                          con la cita del correo en cada celda que toca.
 *
 * SEGURIDAD
 *   Antes de escribir en una fila, comprueba que la columna C (Domain) de esa fila
 *   coincide con el dominio que espera. Si no coincide, NO la toca y la reporta.
 *   Asi es imposible que pinte la fila equivocada si el orden de la hoja cambio.
 *
 * Verde   = confirmado por escrito, con la cita en la nota de la celda.
 * Naranja = vacio, sin confirmar, pendiente de preguntar, o rechazado.
 */

var HOJA = 'Database';
var COL_DOMINIO = 3;
var VERDE = '#c6efce';
var NARANJA = '#ffcc99';

var CAMBIOS = [
  {f:1385,c:6,dom:"descargar.org",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:1385,c:21,dom:"descargar.org",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:1385,c:22,dom:"descargar.org",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:1484,c:21,dom:"periodistas-es.com",v:null,clear:false,color:"naranja",nota:"Casino (35€) no fue parte de la confirmación de 170€ — queda sin verificar."},
  {f:1484,c:22,dom:"periodistas-es.com",v:null,clear:false,color:"verde",nota:"170€ crypto/forex/CBD confirmado por escrito."},
  {f:1484,c:23,dom:"periodistas-es.com",v:null,clear:false,color:"verde",nota:"170€ crypto/forex/CBD confirmado por escrito."},
  {f:1484,c:24,dom:"periodistas-es.com",v:170,clear:false,color:"verde",nota:"CBD también a 170€, confirmado junto con crypto/forex — el sheet tenía 35€ por error."},
  {f:1484,c:25,dom:"periodistas-es.com",v:null,clear:false,color:"naranja",nota:"Dating (35€) no fue parte de la confirmación — queda sin verificar."},
  {f:1484,c:26,dom:"periodistas-es.com",v:null,clear:false,color:"verde",nota:"120€ general (promo 2026), confirmado por escrito."},
  {f:1535,c:6,dom:"juegosadn.es",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:1535,c:21,dom:"juegosadn.es",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:1535,c:22,dom:"juegosadn.es",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:1599,c:6,dom:"animanga.es",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:1599,c:21,dom:"animanga.es",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:1599,c:22,dom:"animanga.es",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:1958,c:6,dom:"despedidasmolamola.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:1958,c:21,dom:"despedidasmolamola.com",v:250,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:1958,c:22,dom:"despedidasmolamola.com",v:250,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:1958,c:26,dom:"despedidasmolamola.com",v:null,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:1958,c:35,dom:"despedidasmolamola.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:1978,c:4,dom:"adictec.com",v:"hola@adictosalinux.com",clear:false,color:"verde",nota:"Antes vía contact@esgeeks.com (revendedor). Directo: hola@adictosalinux.com (Alexis)."},
  {f:1978,c:6,dom:"adictec.com",v:"Alexis",clear:false,color:"verde",nota:"Mismo contacto confirmado que adictosalinux.com."},
  {f:1978,c:21,dom:"adictec.com",v:null,clear:false,color:"naranja",nota:"180€ Casino es de la fuente anterior (revendedor), no confirmado con Alexis."},
  {f:1978,c:22,dom:"adictec.com",v:null,clear:false,color:"naranja",nota:"100€ Crypto es de la fuente anterior (revendedor), no confirmado con Alexis."},
  {f:1978,c:26,dom:"adictec.com",v:90,clear:false,color:"verde",nota:"90€ es el dofollow confirmado (50€ sería sponsored, +15€ si redactan ellos)."},
  {f:1982,c:21,dom:"universopinup.com",v:165,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:1982,c:22,dom:"universopinup.com",v:165,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:1982,c:23,dom:"universopinup.com",v:165,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:1982,c:24,dom:"universopinup.com",v:165,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:1982,c:26,dom:"universopinup.com",v:null,clear:false,color:"verde",nota:"40€ general dofollow confirmado por Daniel."},
  {f:2452,c:4,dom:"tribunasur.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2452,c:5,dom:"tribunasur.es",v:null,clear:true,color:"naranja",nota:null},
  {f:2452,c:21,dom:"tribunasur.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2452,c:22,dom:"tribunasur.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2452,c:23,dom:"tribunasur.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:2452,c:24,dom:"tribunasur.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2452,c:25,dom:"tribunasur.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:2452,c:26,dom:"tribunasur.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2565,c:4,dom:"plataformasinc.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2565,c:5,dom:"plataformasinc.es",v:null,clear:true,color:"naranja",nota:null},
  {f:2565,c:21,dom:"plataformasinc.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2565,c:22,dom:"plataformasinc.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2565,c:23,dom:"plataformasinc.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:2565,c:24,dom:"plataformasinc.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2565,c:25,dom:"plataformasinc.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:2565,c:26,dom:"plataformasinc.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:2736,c:21,dom:"merca2.es",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:2736,c:22,dom:"merca2.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2736,c:23,dom:"merca2.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2736,c:24,dom:"merca2.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:2736,c:25,dom:"merca2.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2736,c:26,dom:"merca2.es",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:2757,c:4,dom:"elcorreoweb.es",v:"aitorruiz93@gmail.com",clear:false,color:"naranja",nota:null},
  {f:2757,c:6,dom:"elcorreoweb.es",v:"Aitor Ruiz",clear:false,color:"naranja",nota:null},
  {f:2757,c:34,dom:"elcorreoweb.es",v:"Do follow",clear:false,color:"naranja",nota:"Esta fila se había sobrescrito con el contacto de correoandalucia.es (emunoz@correoandalucia.es / Elena / no follow) — son dos dominios distintos. Se restauró el contacto anterior de elcorreoweb.es (Aitor Ruiz, dofollow), pero es un dato de 2024 sin re-verificar en esta pasada — confirmar por correo antes de usarlo."},
  {f:2764,c:21,dom:"que.es",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:2764,c:22,dom:"que.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2764,c:23,dom:"que.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2764,c:24,dom:"que.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:2764,c:25,dom:"que.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2764,c:26,dom:"que.es",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:2790,c:21,dom:"motor16.com",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:2790,c:22,dom:"motor16.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2790,c:23,dom:"motor16.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2790,c:24,dom:"motor16.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:2790,c:25,dom:"motor16.com",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2790,c:26,dom:"motor16.com",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:2791,c:21,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2791,c:22,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2791,c:23,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2791,c:24,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2791,c:25,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2791,c:26,dom:"lapreferente.com",v:null,clear:false,color:"naranja",nota:"Francisco (fractor12@hotmail.com, contacto de alsoldelacosta.com) SÍ respondió con precio cuando se le preguntó específicamente por lapreferente.com (90€ estándar / 125€ especial CBD-casino-gambling-crypto), pero firma como \"director de Al Sol de la Costa\", no de lapreferente.com — la atribución no es 100% clara. Fue un solo mensaje, nunca retomado. Pendiente: decidir si se acepta así o se le vuelve a escribir pidiendo confirmación explícita para este dominio."},
  {f:2812,c:6,dom:"unbuendiaenmadrid.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:2812,c:21,dom:"unbuendiaenmadrid.com",v:"Rechazado",clear:false,color:"naranja",nota:"unbuendiaenmadrid.com NO acepta casino actualmente, rechazado explícitamente."},
  {f:2812,c:22,dom:"unbuendiaenmadrid.com",v:275,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:2812,c:26,dom:"unbuendiaenmadrid.com",v:null,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:2812,c:35,dom:"unbuendiaenmadrid.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:2827,c:6,dom:"vivecamino.com",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:2827,c:21,dom:"vivecamino.com",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:2827,c:22,dom:"vivecamino.com",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:2836,c:21,dom:"moncloa.com",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:2836,c:22,dom:"moncloa.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2836,c:23,dom:"moncloa.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2836,c:24,dom:"moncloa.com",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:2836,c:25,dom:"moncloa.com",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:2836,c:26,dom:"moncloa.com",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:2876,c:6,dom:"pokemaster.es",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:2876,c:21,dom:"pokemaster.es",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:2876,c:22,dom:"pokemaster.es",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:3114,c:6,dom:"unbuendiaenzaragoza.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:3114,c:21,dom:"unbuendiaenzaragoza.com",v:225,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3114,c:22,dom:"unbuendiaenzaragoza.com",v:225,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3114,c:26,dom:"unbuendiaenzaragoza.com",v:150,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:3114,c:35,dom:"unbuendiaenzaragoza.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:3171,c:26,dom:"riasbaixas.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3171,c:35,dom:"riasbaixas.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3201,c:4,dom:"europadigital.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3201,c:5,dom:"europadigital.es",v:null,clear:false,color:"naranja",nota:null},
  {f:3201,c:21,dom:"europadigital.es",v:null,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3201,c:22,dom:"europadigital.es",v:null,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3201,c:23,dom:"europadigital.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3201,c:24,dom:"europadigital.es",v:null,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3201,c:25,dom:"europadigital.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3201,c:26,dom:"europadigital.es",v:null,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3206,c:26,dom:"islascies.eu",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3206,c:35,dom:"islascies.eu",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3224,c:26,dom:"terrasdelugo.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3224,c:35,dom:"terrasdelugo.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3233,c:26,dom:"ourense.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3233,c:35,dom:"ourense.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3281,c:26,dom:"riasaltas.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3281,c:35,dom:"riasaltas.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3282,c:4,dom:"madridpress.com",v:"madridpress@madridpress.com",clear:false,color:"verde",nota:"Contacto directo confirmado — antes vía bejarnoticias@outlook.es (Miguel Rodero)."},
  {f:3282,c:6,dom:"madridpress.com",v:null,clear:true,color:"naranja",nota:"Nadie firma con nombre en el contacto directo."},
  {f:3282,c:21,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"150€ para juego y apuestas. Cita textual del 20/08: «El precio es 100€ + IVA. El precio de los artículos de juego y apuestas es de 150 €»."},
  {f:3282,c:22,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Confirmado por escrito el 27/08: «El precio de un artículo general es 100€ / Aceptamos todos / El enlace es Do-Follow / El artículo tendrá una publicación permanente salvo circunstancias excepcionales / La etiqueta es Remitido». El «Aceptamos todos» responde a la pregunta por cripto, forex, CBD y dating, y el precio de referencia en ese mismo correo es el general de 100€."},
  {f:3282,c:23,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Confirmado por escrito el 27/08: «El precio de un artículo general es 100€ / Aceptamos todos / El enlace es Do-Follow / El artículo tendrá una publicación permanente salvo circunstancias excepcionales / La etiqueta es Remitido». El «Aceptamos todos» responde a la pregunta por cripto, forex, CBD y dating, y el precio de referencia en ese mismo correo es el general de 100€."},
  {f:3282,c:24,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Confirmado por escrito el 27/08: «El precio de un artículo general es 100€ / Aceptamos todos / El enlace es Do-Follow / El artículo tendrá una publicación permanente salvo circunstancias excepcionales / La etiqueta es Remitido». El «Aceptamos todos» responde a la pregunta por cripto, forex, CBD y dating, y el precio de referencia en ese mismo correo es el general de 100€."},
  {f:3282,c:25,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Confirmado por escrito el 27/08: «El precio de un artículo general es 100€ / Aceptamos todos / El enlace es Do-Follow / El artículo tendrá una publicación permanente salvo circunstancias excepcionales / La etiqueta es Remitido». El «Aceptamos todos» responde a la pregunta por cripto, forex, CBD y dating, y el precio de referencia en ese mismo correo es el general de 100€."},
  {f:3282,c:26,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Cita textual del 20/08: «El precio es 100€ + IVA»."},
  {f:3282,c:33,dom:"madridpress.com",v:"Remitido",clear:false,color:"verde",nota:"Confirmado el 27/08: «La etiqueta es Remitido» — no es rel=sponsored genérico, es la palabra que ellos usan."},
  {f:3282,c:34,dom:"madridpress.com",v:null,clear:false,color:"verde",nota:"Confirmado el 27/08: «El enlace es Do-Follow»."},
  {f:3282,c:35,dom:"madridpress.com",v:"permanent",clear:false,color:"verde",nota:"Confirmado el 27/08: «El artículo tendrá una publicación permanente salvo circunstancias excepcionales»."},
  {f:3283,c:5,dom:"DSAlicante.com",v:null,clear:true,color:"naranja",nota:"Webmaster Extra Contact duplicaba la misma dirección de Webmaster Contact — se limpió."},
  {f:3283,c:21,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3283,c:22,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3283,c:23,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3283,c:24,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3283,c:25,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3283,c:26,dom:"DSAlicante.com",v:null,clear:false,color:"naranja",nota:"No se pudo relocalizar el correo original de Sergio Ayala en ninguna pasada — precios (300/400) sin verificar."},
  {f:3293,c:21,dom:"viajaresvida.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3293,c:22,dom:"viajaresvida.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3293,c:23,dom:"viajaresvida.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3293,c:24,dom:"viajaresvida.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3293,c:26,dom:"viajaresvida.com",v:null,clear:false,color:"verde",nota:"100€ general dofollow confirmado por Daniel."},
  {f:3314,c:3,dom:"acostadamorte.info",v:null,clear:false,color:"naranja",nota:"Posible duplicado de acostaamorte.info (fila 4706) — este registro (\"acostadamorte\", con \"d\") tiene datos incompletos y no aparece en la lista de 9 sitios que envió el contacto. No se borró, solo se marca para revisar."},
  {f:3331,c:6,dom:"tufiestamolamazo.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:3331,c:21,dom:"tufiestamolamazo.com",v:250,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3331,c:22,dom:"tufiestamolamazo.com",v:250,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3331,c:26,dom:"tufiestamolamazo.com",v:null,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:3331,c:35,dom:"tufiestamolamazo.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:3348,c:4,dom:"primeralinea.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3348,c:5,dom:"primeralinea.es",v:null,clear:false,color:"naranja",nota:null},
  {f:3348,c:21,dom:"primeralinea.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3348,c:22,dom:"primeralinea.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3348,c:23,dom:"primeralinea.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3348,c:24,dom:"primeralinea.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3348,c:25,dom:"primeralinea.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3348,c:26,dom:"primeralinea.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3381,c:4,dom:"innovaspain.com",v:"mlacalle@innovaspain.com",clear:false,color:"verde",nota:"Contacto directo confirmado (firma ella misma) — antes vía agencia marketing@purolink.com."},
  {f:3381,c:5,dom:"innovaspain.com",v:null,clear:true,color:"naranja",nota:null},
  {f:3381,c:6,dom:"innovaspain.com",v:"María Lacalle",clear:false,color:"verde",nota:"Firma sus correos con su propio nombre."},
  {f:3381,c:21,dom:"innovaspain.com",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan contenido de sexo y juego/apuestas, confirmado por escrito."},
  {f:3381,c:26,dom:"innovaspain.com",v:null,clear:false,color:"naranja",nota:"300€ sin verificar — tarifas completas están en un PDF de 6MB que nunca se abrió."},
  {f:3394,c:22,dom:"alsoldelacosta.com",v:null,clear:false,color:"verde",nota:"Francisco confirma por escrito: 85€ estándar, 110€ especial (CBD/casino/gambling/crypto), 125€ forex, 150€ dating. Acuerdo cerrado 26/08."},
  {f:3394,c:23,dom:"alsoldelacosta.com",v:null,clear:false,color:"verde",nota:"Francisco confirma por escrito: 85€ estándar, 110€ especial (CBD/casino/gambling/crypto), 125€ forex, 150€ dating. Acuerdo cerrado 26/08."},
  {f:3394,c:24,dom:"alsoldelacosta.com",v:null,clear:false,color:"verde",nota:"Francisco confirma por escrito: 85€ estándar, 110€ especial (CBD/casino/gambling/crypto), 125€ forex, 150€ dating. Acuerdo cerrado 26/08."},
  {f:3394,c:26,dom:"alsoldelacosta.com",v:null,clear:false,color:"verde",nota:"Francisco confirma por escrito: 85€ estándar, 110€ especial (CBD/casino/gambling/crypto), 125€ forex, 150€ dating. Acuerdo cerrado 26/08."},
  {f:3407,c:6,dom:"mindies.es",v:"Noé R. Rivas",clear:false,color:"verde",nota:"Nombre completo confirmado (el sheet tenía solo \"Noe\")."},
  {f:3407,c:21,dom:"mindies.es",v:null,clear:false,color:"verde",nota:"15€ base confirmado explícitamente para Casino/Crypto/CBD (+5€ enlace extra, +10€ si supera 800 palabras, PayPal, mín 500 palabras)."},
  {f:3407,c:22,dom:"mindies.es",v:null,clear:false,color:"verde",nota:"15€ base confirmado explícitamente para Casino/Crypto/CBD (+5€ enlace extra, +10€ si supera 800 palabras, PayPal, mín 500 palabras)."},
  {f:3407,c:23,dom:"mindies.es",v:null,clear:false,color:"naranja",nota:"Forex no fue mencionado explícitamente en la confirmación — verificar."},
  {f:3407,c:24,dom:"mindies.es",v:null,clear:false,color:"verde",nota:"15€ base confirmado explícitamente para Casino/Crypto/CBD (+5€ enlace extra, +10€ si supera 800 palabras, PayPal, mín 500 palabras)."},
  {f:3407,c:25,dom:"mindies.es",v:null,clear:false,color:"naranja",nota:"No aceptan \"contenido para adultos\" — falta aclarar si Dating cuenta como eso antes de dar el 15€ por bueno aquí."},
  {f:3407,c:26,dom:"mindies.es",v:null,clear:false,color:"verde",nota:"15€ base general confirmado."},
  {f:3408,c:21,dom:"barcelonahoy.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3408,c:22,dom:"barcelonahoy.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3408,c:23,dom:"barcelonahoy.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3408,c:24,dom:"barcelonahoy.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3408,c:26,dom:"barcelonahoy.es",v:null,clear:false,color:"verde",nota:"80€ general dofollow confirmado por Daniel."},
  {f:3428,c:21,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:22,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:23,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:24,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:25,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:26,dom:"lloretgaceta.com",v:null,clear:false,color:"verde",nota:"70€ plano confirmado por cita textual para todas las categorías."},
  {f:3428,c:35,dom:"lloretgaceta.com",v:"30 días",clear:false,color:"naranja",nota:"No es permanente — el trato se cae a los 30 días, confirmado por escrito. Pendiente que Simon decida si se acepta así."},
  {f:3456,c:4,dom:"asturias24.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3456,c:5,dom:"asturias24.es",v:null,clear:false,color:"naranja",nota:null},
  {f:3456,c:21,dom:"asturias24.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3456,c:22,dom:"asturias24.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3456,c:23,dom:"asturias24.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3456,c:24,dom:"asturias24.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3456,c:25,dom:"asturias24.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3456,c:26,dom:"asturias24.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3463,c:26,dom:"santiago.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3463,c:35,dom:"santiago.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:3494,c:21,dom:"que.madrid",v:600,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:3494,c:22,dom:"que.madrid",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3494,c:23,dom:"que.madrid",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3494,c:24,dom:"que.madrid",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:3494,c:25,dom:"que.madrid",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3494,c:26,dom:"que.madrid",v:500,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:3574,c:6,dom:"noticiasdealmeria.com",v:"Rafael M. Martos",clear:false,color:"verde",nota:"Nombre completo confirmado por firma real."},
  {f:3574,c:21,dom:"noticiasdealmeria.com",v:null,clear:false,color:"naranja",nota:"Sin confirmar si es dofollow, si lleva etiqueta, y si hay recargo por categoría (casino/crypto/etc) — falta preguntarlo."},
  {f:3574,c:22,dom:"noticiasdealmeria.com",v:null,clear:false,color:"naranja",nota:"Sin confirmar si es dofollow, si lleva etiqueta, y si hay recargo por categoría (casino/crypto/etc) — falta preguntarlo."},
  {f:3574,c:23,dom:"noticiasdealmeria.com",v:null,clear:false,color:"naranja",nota:"Sin confirmar si es dofollow, si lleva etiqueta, y si hay recargo por categoría (casino/crypto/etc) — falta preguntarlo."},
  {f:3574,c:24,dom:"noticiasdealmeria.com",v:null,clear:false,color:"naranja",nota:"Sin confirmar si es dofollow, si lleva etiqueta, y si hay recargo por categoría (casino/crypto/etc) — falta preguntarlo."},
  {f:3574,c:25,dom:"noticiasdealmeria.com",v:null,clear:false,color:"naranja",nota:"Sin confirmar si es dofollow, si lleva etiqueta, y si hay recargo por categoría (casino/crypto/etc) — falta preguntarlo."},
  {f:3574,c:26,dom:"noticiasdealmeria.com",v:null,clear:false,color:"verde",nota:"90€ por artículo, permanente (nunca se elimina), PayPal, máx 2 enlaces — confirmado."},
  {f:3577,c:4,dom:"cuencanews.es",v:"cuencanews@hotmail.com",clear:false,color:"verde",nota:"Contacto directo confirmado — antes vía torrijospublicidad@gmail.com."},
  {f:3577,c:6,dom:"cuencanews.es",v:null,clear:true,color:"naranja",nota:"Nadie firma con nombre."},
  {f:3577,c:21,dom:"cuencanews.es",v:null,clear:false,color:"naranja",nota:"80€ Casino no confirmado con este contacto directo."},
  {f:3577,c:22,dom:"cuencanews.es",v:null,clear:false,color:"naranja",nota:"80€ Crypto no confirmado con este contacto directo."},
  {f:3577,c:26,dom:"cuencanews.es",v:70,clear:false,color:"verde",nota:"70€ PayPal confirmado por escrito."},
  {f:3581,c:21,dom:"cotilleo.es",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:3581,c:22,dom:"cotilleo.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3581,c:23,dom:"cotilleo.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3581,c:24,dom:"cotilleo.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:3581,c:25,dom:"cotilleo.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:3581,c:26,dom:"cotilleo.es",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:3613,c:6,dom:"harleyclasica.es",v:"Esteban Trujillo",clear:false,color:"verde",nota:"Typo corregido (\"Esteba\"→\"Esteban\"), pero él nunca firma con su nombre en el cuerpo (abre \"Estimado Sr/sra\") — no usar en el saludo."},
  {f:3613,c:21,dom:"harleyclasica.es",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3613,c:22,dom:"harleyclasica.es",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3613,c:23,dom:"harleyclasica.es",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3613,c:24,dom:"harleyclasica.es",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3613,c:25,dom:"harleyclasica.es",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3613,c:26,dom:"harleyclasica.es",v:null,clear:false,color:"verde",nota:"Precio base confirmado por escrito."},
  {f:3633,c:21,dom:"dupalu.com",v:190,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3633,c:22,dom:"dupalu.com",v:190,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3633,c:23,dom:"dupalu.com",v:190,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3633,c:24,dom:"dupalu.com",v:190,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3633,c:26,dom:"dupalu.com",v:null,clear:false,color:"verde",nota:"65€ general dofollow confirmado por Daniel."},
  {f:3644,c:6,dom:"cervezamastapapormadrid.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:3644,c:21,dom:"cervezamastapapormadrid.com",v:225,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3644,c:22,dom:"cervezamastapapormadrid.com",v:225,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3644,c:26,dom:"cervezamastapapormadrid.com",v:150,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:3644,c:35,dom:"cervezamastapapormadrid.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:3659,c:4,dom:"adictosalinux.com",v:null,clear:false,color:"verde",nota:"hola@adictosalinux.com / Alexis — confirmado dofollow 50€."},
  {f:3659,c:26,dom:"adictosalinux.com",v:null,clear:false,color:"verde",nota:"50€ dofollow confirmado."},
  {f:3689,c:21,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3689,c:22,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3689,c:23,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3689,c:24,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3689,c:25,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3689,c:26,dom:"aqui.madrid",v:null,clear:false,color:"naranja",nota:"aqui.madrid (fila hermana) nunca se ha vuelto a preguntar por separado — estos valores siguen sin confirmar."},
  {f:3700,c:6,dom:"mallorcactual.com",v:null,clear:false,color:"verde",nota:"Marc Rigo confirmado por firma real (\"Un saludo. Marc Rigo\") — el nombre SÍ se puede usar en el saludo."},
  {f:3700,c:26,dom:"mallorcactual.com",v:null,clear:false,color:"naranja",nota:"60€ viene de un .docx adjunto que nunca se abrió (confirmado de nuevo en el barrido del 27/08: sigue sin abrir, sin seguimiento) — no está verificado con una cita real."},
  {f:3700,c:35,dom:"mallorcactual.com",v:null,clear:false,color:"naranja",nota:"\"1 Year\" viene del mismo .docx sin abrir — sin verificar."},
  {f:3777,c:4,dom:"cabtfe.es",v:"contacto@cabtfe.es",clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3777,c:5,dom:"cabtfe.es",v:null,clear:true,color:"naranja",nota:null},
  {f:3777,c:21,dom:"cabtfe.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3777,c:22,dom:"cabtfe.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3777,c:23,dom:"cabtfe.es",v:null,clear:true,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3777,c:24,dom:"cabtfe.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3777,c:25,dom:"cabtfe.es",v:null,clear:false,color:"naranja",nota:"Forex/Dating no fueron parte de la confirmación de 180€ — sin verificar."},
  {f:3777,c:26,dom:"cabtfe.es",v:180,clear:false,color:"verde",nota:"180€ sin impuestos confirmado (consolidado, un solo contacto contacto@cabtfe.es para los 7 sitios). +30€ si redacta cabtfe."},
  {f:3811,c:21,dom:"tabarnia.org",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3811,c:22,dom:"tabarnia.org",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3811,c:23,dom:"tabarnia.org",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3811,c:24,dom:"tabarnia.org",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:3811,c:26,dom:"tabarnia.org",v:null,clear:false,color:"verde",nota:"60€ general dofollow confirmado por Daniel."},
  {f:3813,c:6,dom:"unbuendiaenbarcelona.com",v:null,clear:false,color:"naranja",nota:"\"Carlos Cebrián\" del sheet nunca se confirmó — nadie firma con nombre en los correos de esta red."},
  {f:3813,c:21,dom:"unbuendiaenbarcelona.com",v:275,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3813,c:22,dom:"unbuendiaenbarcelona.com",v:275,clear:false,color:"verde",nota:"General + 75€ para crypto/casino/apuestas, confirmado por escrito."},
  {f:3813,c:26,dom:"unbuendiaenbarcelona.com",v:200,clear:false,color:"verde",nota:"Precio general confirmado por cita textual."},
  {f:3813,c:35,dom:"unbuendiaenbarcelona.com",v:null,clear:false,color:"naranja",nota:"Sin confirmación explícita de la permanencia (\"2 Years\") en los correos revisados."},
  {f:3876,c:6,dom:"estebantrujillo.com",v:"Esteban Trujillo",clear:false,color:"verde",nota:"Typo corregido (\"Esteba\"→\"Esteban\"), pero él nunca firma con su nombre en el cuerpo (abre \"Estimado Sr/sra\") — no usar en el saludo."},
  {f:3876,c:21,dom:"estebantrujillo.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3876,c:22,dom:"estebantrujillo.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3876,c:23,dom:"estebantrujillo.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3876,c:24,dom:"estebantrujillo.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3876,c:25,dom:"estebantrujillo.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3876,c:26,dom:"estebantrujillo.com",v:null,clear:false,color:"verde",nota:"Precio base confirmado por escrito."},
  {f:3987,c:6,dom:"miscochesclasicos.com",v:"Esteban Trujillo",clear:false,color:"verde",nota:"Typo corregido (\"Esteba\"→\"Esteban\"), pero él nunca firma con su nombre en el cuerpo (abre \"Estimado Sr/sra\") — no usar en el saludo."},
  {f:3987,c:21,dom:"miscochesclasicos.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3987,c:22,dom:"miscochesclasicos.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3987,c:23,dom:"miscochesclasicos.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3987,c:24,dom:"miscochesclasicos.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3987,c:25,dom:"miscochesclasicos.com",v:"A negociar",clear:false,color:"naranja",nota:"Precio base confirmado por escrito. Casino/apuestas/dating/crypto: \"a negociar\", sin precio fijo — no inventar un número."},
  {f:3987,c:26,dom:"miscochesclasicos.com",v:null,clear:false,color:"verde",nota:"Precio base confirmado por escrito."},
  {f:4114,c:6,dom:"merkalo.com",v:"Jose Miguel Blasco",clear:false,color:"verde",nota:"Nombre completo confirmado: Jose Miguel Blasco (el sheet solo tenía \"Jose\")."},
  {f:4114,c:21,dom:"merkalo.com",v:null,clear:false,color:"verde",nota:"300€+IVA confirmado (400€+IVA si redacta hyliacom)."},
  {f:4114,c:22,dom:"merkalo.com",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan crypto explícitamente por escrito — no es un precio, es un rechazo."},
  {f:4187,c:21,dom:"vida.es",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:4187,c:22,dom:"vida.es",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4187,c:23,dom:"vida.es",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4187,c:24,dom:"vida.es",v:null,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:4187,c:25,dom:"vida.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4187,c:26,dom:"vida.es",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:4193,c:21,dom:"bcnisnotcat.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4193,c:22,dom:"bcnisnotcat.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4193,c:23,dom:"bcnisnotcat.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4193,c:24,dom:"bcnisnotcat.es",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4193,c:26,dom:"bcnisnotcat.es",v:null,clear:false,color:"verde",nota:"70€ general dofollow confirmado por Daniel."},
  {f:4264,c:21,dom:"ahoraestendencia.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4264,c:22,dom:"ahoraestendencia.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4264,c:23,dom:"ahoraestendencia.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4264,c:24,dom:"ahoraestendencia.com",v:null,clear:false,color:"verde",nota:"General + 125€ de recargo de categoría, confirmado por Daniel (dofollow, sin marca de sponsored)."},
  {f:4264,c:26,dom:"ahoraestendencia.com",v:null,clear:false,color:"verde",nota:"50€ general dofollow confirmado por Daniel."},
  {f:4456,c:21,dom:"sostenibilidad.es",v:null,clear:false,color:"naranja",nota:"600€+IVA — SOLO sponsored, no ofrecen dofollow. Confirmado por escrito. Falta preguntar si existe opción dofollow."},
  {f:4456,c:22,dom:"sostenibilidad.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4456,c:23,dom:"sostenibilidad.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4456,c:24,dom:"sostenibilidad.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow. CBD además tiene restricción de tema: solo cosmética y aceites esenciales (26/08)."},
  {f:4456,c:25,dom:"sostenibilidad.es",v:500,clear:false,color:"verde",nota:"Confirmado el 25/08, en respuesta directa a la pregunta por cripto, forex, CBD y dating: «Si aceptamos este tipo de contenidos / El precio de cada artículo es de 350 euros + IVA con enlaces y etiquetas Sponsored / O cada artículo 500 euros + IVA con enlaces y etiquetas DoFollow». Se registra el dofollow (500€) por la regla de tomar siempre el precio dofollow."},
  {f:4456,c:26,dom:"sostenibilidad.es",v:null,clear:false,color:"verde",nota:"500€+IVA dofollow, confirmado por escrito dos veces (24-25/08). 350€ es sponsored, no se usa (regla: siempre dofollow)."},
  {f:4705,c:26,dom:"aribeirasacra.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:4705,c:35,dom:"aribeirasacra.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:4706,c:26,dom:"acostaamorte.info",v:null,clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:4706,c:35,dom:"acostaamorte.info",v:"mínimo 3 años",clear:false,color:"verde",nota:"190€ confirmado SIN IVA incluido; permanencia mínima 3 años, no \"permanent\"; etiqueta discreta de patrocinio. Contestan desde geodestinos@ y soporte@galicia.info."},
  {f:5357,c:6,dom:"ultimasnoticias.com.ve",v:"Johan Andrades Infante",clear:false,color:"verde",nota:"Nombre completo confirmado."},
  {f:5357,c:21,dom:"ultimasnoticias.com.ve",v:null,clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5357,c:22,dom:"ultimasnoticias.com.ve",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5357,c:24,dom:"ultimasnoticias.com.ve",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5357,c:26,dom:"ultimasnoticias.com.ve",v:null,clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5357,c:33,dom:"ultimasnoticias.com.ve",v:"CONTENIDO EXTERNO",clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5360,c:21,dom:"noticiaalminuto.com",v:null,clear:false,color:"verde",nota:"180 USD un enlace / 200 USD dos enlaces / 225 USD más de dos (180 es la base/1 enlace). Dofollow, permanente, sin etiqueta, PayPal, mínimo 400 palabras."},
  {f:5360,c:22,dom:"noticiaalminuto.com",v:null,clear:false,color:"verde",nota:"180 USD un enlace / 200 USD dos enlaces / 225 USD más de dos (180 es la base/1 enlace). Dofollow, permanente, sin etiqueta, PayPal, mínimo 400 palabras."},
  {f:5360,c:23,dom:"noticiaalminuto.com",v:null,clear:false,color:"verde",nota:"180 USD un enlace / 200 USD dos enlaces / 225 USD más de dos (180 es la base/1 enlace). Dofollow, permanente, sin etiqueta, PayPal, mínimo 400 palabras."},
  {f:5360,c:24,dom:"noticiaalminuto.com",v:null,clear:false,color:"verde",nota:"180 USD un enlace / 200 USD dos enlaces / 225 USD más de dos (180 es la base/1 enlace). Dofollow, permanente, sin etiqueta, PayPal, mínimo 400 palabras."},
  {f:5360,c:25,dom:"noticiaalminuto.com",v:"Rechazado",clear:false,color:"naranja",nota:"Dating rechazado explícitamente — todas las demás categorías sí, salvo esta."},
  {f:5360,c:26,dom:"noticiaalminuto.com",v:null,clear:false,color:"verde",nota:"180 USD un enlace / 200 USD dos enlaces / 225 USD más de dos (180 es la base/1 enlace). Dofollow, permanente, sin etiqueta, PayPal, mínimo 400 palabras."},
  {f:5362,c:6,dom:"liderendeportes.com",v:"Johan Andrades Infante",clear:false,color:"verde",nota:"Nombre completo confirmado."},
  {f:5362,c:21,dom:"liderendeportes.com",v:null,clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5362,c:22,dom:"liderendeportes.com",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5362,c:24,dom:"liderendeportes.com",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5362,c:26,dom:"liderendeportes.com",v:null,clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5362,c:33,dom:"liderendeportes.com",v:"CONTENIDO EXTERNO",clear:false,color:"verde",nota:"Rechazan: contenido sexual, económico, político, armas, crypto, minería en la nube, CBD. Publican con la etiqueta literal \"CONTENIDO EXTERNO\" (no rel=sponsored genérico). Prepago."},
  {f:5369,c:21,dom:"lacalle.com.ve",v:null,clear:false,color:"verde",nota:"50€ inserción en artículo existente, 100€ artículo nuevo (gaming/CBD/finanzas), 150€ casino. Dofollow, permanente, sin etiqueta."},
  {f:5369,c:22,dom:"lacalle.com.ve",v:null,clear:false,color:"verde",nota:"50€ inserción en artículo existente, 100€ artículo nuevo (gaming/CBD/finanzas), 150€ casino. Dofollow, permanente, sin etiqueta."},
  {f:5369,c:23,dom:"lacalle.com.ve",v:null,clear:false,color:"verde",nota:"50€ inserción en artículo existente, 100€ artículo nuevo (gaming/CBD/finanzas), 150€ casino. Dofollow, permanente, sin etiqueta."},
  {f:5369,c:24,dom:"lacalle.com.ve",v:null,clear:false,color:"verde",nota:"50€ inserción en artículo existente, 100€ artículo nuevo (gaming/CBD/finanzas), 150€ casino. Dofollow, permanente, sin etiqueta."},
  {f:5369,c:26,dom:"lacalle.com.ve",v:null,clear:false,color:"verde",nota:"50€ inserción en artículo existente, 100€ artículo nuevo (gaming/CBD/finanzas), 150€ casino. Dofollow, permanente, sin etiqueta."},
  {f:5378,c:6,dom:"elimpulso.com",v:"Jéssica Oshiro",clear:false,color:"verde",nota:"Firma con su propio nombre en el correo directo."},
  {f:5378,c:24,dom:"elimpulso.com",v:"Rechazado",clear:false,color:"naranja",nota:"CBD rechazado explícitamente por el contacto directo."},
  {f:5378,c:25,dom:"elimpulso.com",v:"Rechazado",clear:false,color:"naranja",nota:"Dating rechazado explícitamente por el contacto directo."},
  {f:5378,c:35,dom:"elimpulso.com",v:"permanent",clear:false,color:"verde",nota:"Confirmado permanente (nunca se elimina del portal), no \"2 Years\" (eso era del revendedor)."},
  {f:5388,c:5,dom:"elclarinweb.com",v:null,clear:true,color:"naranja",nota:null},
  {f:5388,c:6,dom:"elclarinweb.com",v:null,clear:false,color:"naranja",nota:"Nadie firma con nombre real en el hilo directo — dejar en blanco."},
  {f:5388,c:21,dom:"elclarinweb.com",v:null,clear:false,color:"verde",nota:"50 USD confirmado igual para Casino, Cripto y Forex."},
  {f:5388,c:22,dom:"elclarinweb.com",v:null,clear:false,color:"verde",nota:"50 USD confirmado igual para Casino, Cripto y Forex."},
  {f:5388,c:23,dom:"elclarinweb.com",v:null,clear:false,color:"verde",nota:"50 USD confirmado igual para Casino, Cripto y Forex."},
  {f:5388,c:24,dom:"elclarinweb.com",v:null,clear:false,color:"naranja",nota:"CBD sin confirmar."},
  {f:5388,c:25,dom:"elclarinweb.com",v:null,clear:false,color:"naranja",nota:"Dating sin confirmar."},
  {f:5395,c:4,dom:"quepasa.com.ve",v:"direcciongeneral@quepasa.com.ve",clear:false,color:"verde",nota:"Contacto directo confirmado — antes vía revendedor gjmendoza@inversionesw.com que cobraba el doble."},
  {f:5395,c:6,dom:"quepasa.com.ve",v:"Pedro Pablo",clear:false,color:"verde",nota:"Firma con su propio nombre en el correo directo."},
  {f:5395,c:21,dom:"quepasa.com.ve",v:75,clear:false,color:"verde",nota:"Cita textual del 20/08: «€75 (incluye comisión PayPal) por artículo sobre casinos o juegos de azar o en línea, criptomonedas o empresas financieras o bancarias». El precio ya lleva incluida la comisión de PayPal. Exigen prepago íntegro."},
  {f:5395,c:22,dom:"quepasa.com.ve",v:75,clear:false,color:"verde",nota:"Cita textual del 20/08: «€75 (incluye comisión PayPal) por artículo sobre casinos o juegos de azar o en línea, criptomonedas o empresas financieras o bancarias». El precio ya lleva incluida la comisión de PayPal. Exigen prepago íntegro."},
  {f:5395,c:23,dom:"quepasa.com.ve",v:75,clear:false,color:"verde",nota:"Cita textual del 20/08: «€75 (incluye comisión PayPal) por artículo sobre casinos o juegos de azar o en línea, criptomonedas o empresas financieras o bancarias». El precio ya lleva incluida la comisión de PayPal. Exigen prepago íntegro."},
  {f:5395,c:24,dom:"quepasa.com.ve",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazado. Su lista de temas sensibles del 20/08 incluye «consumo de sustancias prohibidas (incluye marihuana)», así que el CBD queda fuera. No hace falta volver a preguntarlo."},
  {f:5395,c:25,dom:"quepasa.com.ve",v:"Rechazado",clear:false,color:"naranja",nota:"Rechazado. Su lista de temas sensibles del 20/08 incluye «Prostitución, casa de citas», así que las webs de citas quedan fuera. No hace falta volver a preguntarlo."},
  {f:5395,c:26,dom:"quepasa.com.ve",v:54,clear:false,color:"verde",nota:"Cita textual del 20/08: «€54 (incluye comisión PayPal) para otros temas». Exigen prepago íntegro; han sido víctimas de estafas y lo dicen abiertamente."},
];

function diagnostico() {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA);
  if (!hoja) { throw new Error('No encuentro una pestana llamada "' + HOJA + '"'); }

  var yaOk = 0, faltan = 0, desalineadas = [];
  var filasVistas = {};

  for (var i = 0; i < CAMBIOS.length; i++) {
    var c = CAMBIOS[i];
    var domReal = hoja.getRange(c.f, COL_DOMINIO).getValue();
    if (String(domReal).trim() !== c.dom) {
      if (!filasVistas[c.f]) {
        desalineadas.push('fila ' + c.f + ': esperaba "' + c.dom + '" y hay "' + domReal + '"');
        filasVistas[c.f] = true;
      }
      continue;
    }
    var celda = hoja.getRange(c.f, c.c);
    var valorActual = celda.getValue();
    var esperado = c.clear ? '' : (c.v === null ? valorActual : c.v);
    var igual = String(valorActual) === String(esperado === null ? '' : esperado);
    if (igual) { yaOk++; } else { faltan++; }
  }

  var msg = 'DIAGNOSTICO\n\n' +
    'Celdas en el plan: ' + CAMBIOS.length + '\n' +
    'Ya correctas: ' + yaOk + '\n' +
    'Por corregir: ' + faltan + '\n' +
    'Filas desalineadas: ' + desalineadas.length + '\n';
  if (desalineadas.length) {
    msg += '\nFilas que NO voy a tocar porque el dominio no coincide:\n' +
           desalineadas.slice(0, 20).join('\n');
    if (desalineadas.length > 20) { msg += '\n... y ' + (desalineadas.length - 20) + ' mas'; }
  }
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) {}
  return msg;
}

function aplicarCorrecciones() {
  var hoja = SpreadsheetApp.getActive().getSheetByName(HOJA);
  if (!hoja) { throw new Error('No encuentro una pestana llamada "' + HOJA + '"'); }

  var escritas = 0, saltadas = 0, desalineadas = {};

  for (var i = 0; i < CAMBIOS.length; i++) {
    var c = CAMBIOS[i];
    var domReal = hoja.getRange(c.f, COL_DOMINIO).getValue();
    if (String(domReal).trim() !== c.dom) {
      desalineadas[c.f] = c.dom + ' / ' + domReal;
      saltadas++;
      continue;
    }
    var celda = hoja.getRange(c.f, c.c);
    if (c.clear) { celda.clearContent(); }
    else if (c.v !== null) { celda.setValue(c.v); }
    if (c.color === 'verde') { celda.setBackground(VERDE); }
    else if (c.color === 'naranja') { celda.setBackground(NARANJA); }
    if (c.nota) { celda.setNote(c.nota); }
    escritas++;
  }

  var lista = Object.keys(desalineadas);
  var msg = 'LISTO\n\n' +
    'Celdas escritas: ' + escritas + '\n' +
    'Saltadas por seguridad: ' + saltadas + '\n';
  if (lista.length) {
    msg += '\nFilas saltadas (esperaba / encontre):\n';
    for (var j = 0; j < Math.min(lista.length, 20); j++) {
      msg += 'fila ' + lista[j] + ': ' + desalineadas[lista[j]] + '\n';
    }
  }
  msg += '\nSi algo salio mal: Archivo > Historial de versiones > Ver historial, y vuelves a la version de antes.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) {}
  return msg;
}
