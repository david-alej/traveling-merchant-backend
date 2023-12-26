"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Clients",
      [
        {
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "(956)634-7775",
          workPlace: "Hamill, Denesik and Davis",
          relationship: 5,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "(254)386-5553",
          workPlace: "Deckow and Sons",
          relationship: 5,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          workPlace: "Lynch PLC",
          relationship: 5,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clients", null, {})
  },
}
