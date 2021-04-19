"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // GET /near
  async near(ctx) {
    const { query } = ctx.request;
    const {
      coordinates,
      minDistance = 100,
      maxDistance = 5000,
      where,
      sort = { createdAt: -1 },
      limit = 20,
    } = query;
    if (!coordinates) {
      ctx.status = 400;
      return ctx.throw(400, "coordinates param is required.");
    }
    const [lat, lng] = coordinates.split(",").map((i) => Number(i));

    if (!(lat && lng)) {
      return ctx.throw(400, "coordinates param is invalid.");
    }

    let modelQuery = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lat, lng],
          },
          $maxDistance: Number(maxDistance),
          $minDistance: Number(minDistance),
        },
      },
      published_at: { $ne: null },
    };

    if (where) {
      where.forEach((clause) => {
        modelQuery = { ...modelQuery, ...clause };
      });
    }

    console.log(modelQuery);

    const lugares = await strapi
      .query("lugar")
      .model.find(modelQuery)
      .sort(sort)
      .limit(Number(limit));

    ctx.send(lugares);
  },
};
