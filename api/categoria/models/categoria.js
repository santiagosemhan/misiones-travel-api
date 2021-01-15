"use strict";
const slugify = require("slugify");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const getSlug = async (categoria) => {
  let str;
  let slug;
  if (categoria.nombre) {
    str = categoria.nombre;
    if (categoria.categoria) {
      const parent = await strapi.services.categoria.findOne({ id: categoria.categoria });
      str = `${parent.nombre} ${str}`;
    }
    slug = slugify(str, { lower: true });
  }
  return slug;
};

const getLocation = (data) => {
  let location;
  if (
    data.geoposicion &&
    data.geoposicion.latitud &&
    data.geoposicion.longitud
  ) {
    location = {
      type: "Point",
      coordinates: [data.geoposicion.longitud, data.geoposicion.latitud],
    };
  }
  return location;
};

module.exports = {
  /**
   * Triggered before user creation.
   */
  lifecycles: {
    async beforeCreate(data) {
      data.slug = await getSlug(data);
      data.location = getLocation(data);
    },
    async beforeUpdate(id, data) {
      data.slug = await getSlug(data);
      data.location = getLocation(data);
    },
  },
};