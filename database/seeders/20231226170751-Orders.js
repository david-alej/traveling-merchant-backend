"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          providerId: 3,
          cost: 500,
          expectedDate: "2023-11-02T20:00:00.000Z",
          actualDate: "2023-11-09T20:00:00.000Z",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          providerId: 1,
          cost: 110,
          expectedDate: "2024-11-02T20:00:00.000Z",
          actualDate: null,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {})
  },
}
