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
          phoneNumber: "9566347775",
          workId: 1,
          relationship: 5,
          createdAt: new Date("2024-11-10"),
          updatedAt: new Date("2024-12-12"),
        },
        {
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "2543865553",
          workId: 2,
          relationship: 5,
          createdAt: new Date("2024-11-14"),
          updatedAt: new Date("2024-11-29"),
        },
        {
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "2103424367",
          workId: 3,
          relationship: 5,
          createdAt: new Date("2024-11-22"),
          updatedAt: new Date("2024-11-25"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clients", null, {})
  },
}
