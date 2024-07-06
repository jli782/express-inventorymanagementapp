# express-inventorymanagementapp

<p align="center">
A simple Expressjs inventory management application, applying fundamental concepts of Model-View-Client, expressjs, materialize css, mongoDB, and relevant npmjs packages.
</p>

## 🧐About

This project implements database models to enable users to Create, Replace, Update, and Delete as needed. The project also makes use of CDNs which enable cloud storage and media preview of user-provided data.

## 💡Features

The bt-inventory-management, enables user to:

1. Read all user-inputted data, stored on Mongo production server
1. Create new data, provided the new data inputted is not existing data
1. Update existing data
1. Delete existing data, provided the existing data are not parent models to existing child data/models

## ⛏️Built with

- Expressjs
- Extended js templates (HTML)
- Materialize CSS
- MongoDB
- Cloudinary
- see "package.json" for more ...

## 🏁Getting Started

The instructions below will help you setup a copy of the bt-inventory-management application on your local machine for testing or development. See [deployment](#Deployment) for information on deploying the project on a production system.

### 📚Prerequisite

The project requires you to have installed:

- Node and NPM
- git
- expressjs

### 🧰Installation

Follow these steps to setup a local environment for the app:

1. Clone this repo

   ```git clone ...

   ```

1. Install all the dependencies

   ```npm install

   ```

1. Create a .env file and include your Cloudinary secret and MongoDB Connection String

   ```touch .env

   ```

1. To run the app on a local server

- If running as a developer

  ```npm serverstart

  ```

- If running as if the app is live in production

  ```npm debugstart

  ```

## 🚀Deployment

Steps to deploy your local copy of the project:

1. Create a new repo remotely on GitHub

   ```git clone ...

   ```

1. Push your code to it

   ```git push origin main

   ```

1. Create New Project on your [Vercel Dashboard](https://vercel.com/dashboard)
1. Import your Git Repository
1. After successful import, changes made to the Production Branch (commonly "main/master") will be a Production Deployment and rest all branches will generate Preview Deployments.
1. Once deployed, you will get a URL for your live app, such as: `https://xyz.vercel.app`

## 📝Todo and 📈Future Plans

Currently, the project still requires the following additions to be included:

- Add authentication to enable Create, Replace, Delete only for relevant users (ie. Admin, inventory manager)
- Add search functionality
- Mobile response UI (namely Materialize CSS sidebar nav, responsive screen size adjustment, currently the project only applies to modern laptop screens)

## 🎈Usage

- For any Battletech enthusiasts, this project can be used to maintain your roster of tabletop play pieces

## 📖Contributing

Contributions are what make the open source community an amazing place. Any contributions you make are **greatly appreciated**.

## 💳License

<!-- Mention your project licence here and also link to that file -->

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## 🎉Acknowledgement

- [Sarna.net for all the Battletech resources and media](https://www.sarna.net/wiki/Main_Page)
- [To select a permissive license for the project](https://choosealicense.com)
