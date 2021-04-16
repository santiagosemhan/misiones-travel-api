"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /near
  async near(ctx) {
    const { query } = ctx.request;
    const { coordinates, minDistance = 100, maxDistance = 5000, sort } = query;
    if (!coordinates) {
      ctx.status = 400;
      return ctx.throw(400, "coordinates param is required.");
    }
    const [lat, lng] = coordinates.split(",").map((i) => Number(i));

    if (!(lat && lng)) {
      return ctx.throw(400, "coordinates param is invalid.");
    }

    const modelQuery = {
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
    }

    if (sort) {
      modelQuery = { ...modelQuery, _sort: sort}
    }

    const lugares = await strapi.query("lugar").model.find(modelQuery);

    ctx.send(lugares);
  },
};
