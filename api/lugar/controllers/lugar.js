"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /near
  async near(ctx) {
    const { query } = ctx.request;
    const { coordinates, minDistance = 100, maxDistance = 5000 } = query;
    if (!coordinates) {
      ctx.status = 400;
      return ctx.throw(400, "coordinates param is required.");
    }
    const [lat, lng] = coordinates.split(",").map((i) => Number(i));

    if (!(lat && lng)) {
      return ctx.throw(400, "coordinates param is invalid.");
    }

    const lugares = await strapi.query("lugar").model.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lat, lng],
          },
          $maxDistance: maxDistance,
          $minDistance: minDistance,
        },
      },
      published_at: { $ne: null },
    });

    ctx.send(lugares);
  },
};
