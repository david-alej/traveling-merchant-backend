"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Merchants",
      [
        {
          username: "missioneros",
          password: "", //nissiJire2
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Merchants", null, {})
  },
}
