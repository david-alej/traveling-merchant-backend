"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Providers",
      [
        {
          name: "Amazon",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          name: "Ebay",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          name: "JCPenny",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          name: "Marshalls",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Providers", null, {})
  },
}
