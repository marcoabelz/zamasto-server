"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let projects = require("../data/projects.json").map((project) => {
      project.createdAt = new Date();
      project.updatedAt = new Date();
      return project;
    });
    let services = require("../data/services.json").map((service) => {
      service.createdAt = new Date();
      service.updatedAt = new Date();
      return service;
    });
    let blogs = require("../data/blogs.json").map((blog) => {
      blog.createdAt = new Date();
      blog.updatedAt = new Date();
      return blog;
    });
    await queryInterface.bulkInsert("projects", projects, {});
    await queryInterface.bulkInsert("services", services, {});
    await queryInterface.bulkInsert("blogs", blogs, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("projects", null, {});
    await queryInterface.bulkDelete("services", null, {});
    await queryInterface.bulkDelete("blogs", null, {});
  },
};
