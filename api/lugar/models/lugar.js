"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const getLocation = async (data) => {
  let location;
  if (
    data.geoposicion &&
    data.geoposicion.latitud &&
    data.geoposicion.longitud
  ) {
    location = {
      type: "Point",
      coordinates: [data.geoposicion.latitud, data.geoposicion.longitud],
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
      data.location = await getLocation(data);
    },
    async beforeUpdate(id, data) {
      data.location = await getLocation(data);
    },
  },
};
