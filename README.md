<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## 📦 Description

This NestJS application provides a **AN API** for managing an **in-store menu, orders and reports** of sandwiches, snacks, and salads, along with their ingredients.  
It supports:
- Fixed menu item creation
- Ingredient linking
- Ingredient-based customizations for orders

Designed as the backend for an **in-store ordering system**, it ensures structured order data and smooth integration with a kitchen display or POS.

---

## ⚙️ Project Setup
1. Add .env file
2. Create a postgresql database

```bash
# Install dependencies
$ npm install
# Run migrations
$ npm run migration:run
# Run project
$ npm run start:dev
