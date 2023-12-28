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
          workId: 1,
          relationship: 5,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "(254)386-5553",
          workId: 2,
          relationship: 5,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "(210)342-4367",
          workId: 3,
          relationship: 5,
          createdAt: new Date("2024-11-10"),
          updatedAt: new Date("2024-11-10"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clients", null, {})
  },
}
