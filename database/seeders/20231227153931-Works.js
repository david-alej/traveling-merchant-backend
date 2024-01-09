"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Works",
      [
        {
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: new Date("2024-11-02"),
          updatedAt: new Date("2024-12-02"),
        },
        {
          name: "Deckow and Sons",
          address: "245 John Drive",
          phoneNumber: "7644084620",
          createdAt: new Date("2024-11-02"),
          updatedAt: new Date("2024-11-02"),
        },
        {
          name: "Lynch PLC",
          address: "38 Lafayette St.",
          phoneNumber: "9103623505",
          createdAt: new Date("2024-11-02"),
          updatedAt: new Date("2024-11-02"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Works", null, {})
  },
}
