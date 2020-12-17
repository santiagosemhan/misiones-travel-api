'use strict';
const axios = require('axios');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  const { data } = await axios.get('https://apis.datos.gob.ar/georef/api/localidades?provincia=54&campos=localidad_censal,centroide&max=200');

  const { localidades } = data;
  const loadedLocalidades = await strapi.services.localidad.find();
  if (loadedLocalidades.length === 0) {
    await Promise.all(localidades.map(l => strapi.services.localidad.create({ nombre: l.nombre, latitud: l.centroide.lat, longitud: l.centroide.lon })));
  }
  console.log(data);
};
