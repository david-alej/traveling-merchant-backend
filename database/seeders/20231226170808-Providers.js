"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Providers",
      [
        {
          name: "Amazon",
          address: "0000 online",
          phoneNumber: "1632474734",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "Ebay",
          address: "0000 online",
          phoneNumber: "5125869601",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "JCPenny",
          address: "84506 Deangelo Cliff",
          phoneNumber: "6192621956",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "Marshalls",
          address: "41090 Jaime Springs",
          phoneNumber: "3718802186",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Providers", null, {})
  },
}
