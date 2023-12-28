"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Wares",
      [
        {
          name: "Loewe 001 Woman Perfume",
          type: "perfume",
          tags: ["women", "1-pc"],
          stock: 1,
          cost: 155,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
          type: "perfume",
          tags: ["women", "3-pc"],
          stock: 2,
          cost: 178,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "The Leather Medium Tote Bag",
          type: "bag",
          tags: ["women"],
          stock: 2,
          cost: 450,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "Versace Men's 4-Pc. Eros Eau de Toilette Gift Set",
          type: "perfume",
          tags: ["men", "4-pc"],
          stock: 4,
          cost: 176,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
          type: "braclet",
          tags: ["unisex"],
          stock: 4,
          cost: 14,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Wares", null, {})
  },
}
