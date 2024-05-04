
# Your Next Intern -API (YNI) Project

## Content

- [Introduction](#introduction)
- [Technologies](#technology)
- [APIs](#apis)
- [Quick Links](#quick-links)
- [Authors](#authors)
- [Reach Out](#reach-out)

## Introduction

YNI is a web application built to ease the process of seeking for internship positions by undergraduates in Nigerian Universities and people with great talents. It aims to bridge the gap between prospective interns and organizations looking to train/equip the next generation of talents.

Users , interns and organizations, will find a welcome user experience. Organizations can activate and deactivate their application window, and they can also monitor the number of applicants on their profiles. Interns can apply to as many companies as possible, given that the application window of the company is open, and they can also apply to companies or cancel their application to companies, all with the click of a button.

YNI-API is built with TypeScript, NestJs, and uses PostgreSQL as the RDBMS.

- TypeORM, is the the ORM to create the routes and endpoints, while MySQL functions as the RDBMS.

[Back to content](#content)

## Technology

This section lists the programming langauages, libraries, and frameworks used in the development of the application

- Node.js
- TypeScript
- NestJs
- PostgreSQL
- Docker

[Back to content](#content)

## APIs

Please note that the routes here do not provide the complete documentation for request body and the response types. A link to the complete documentation will be provided in due time as development progresses.

- ### Authentication endpoints [click here for code](./src/api/v1/auth/auth.controller.ts)

  - **POST /api/auth/companies/login** - authentication of registered companies to login

  - **POST /auth/interns/login** - authentication of registered interns to login

  - **POST /api/auth/companies** - authentication of companies to register

  - **POST /api/auth/interns** - authentication of interns to register

- ### Companies endpoints - [click here to see code](./src/api/v1/company/company.controller.ts)

  - **GET api/companies?pageNumber=1?pageSize=20/** - Get all companies by page

  - **POST /api/auth/companies** - Add a new company

  - **GET /api/companies/:id** - Get a company.

  - **PUT /api/companies/:id** - update a company's information

  - **DELETE /api/companies/:id** - delete a company

- ### Interns endpoints - [click here to see code](./src/api/v1/intern/intern.controller.ts)

  - **GET api/interns?pageNumber=1?pageSize=20/** - Get all interns by page

  - **POST /api/auth/interns** - Add a new intern

  - **GET /api/interns/:id** - Get an intern.

  - **PUT /api/intern/:id** - update an intern's information

  - **DELETE /api/intern/:id** - delete an intern

  - **POST /api/intern/:id/companies** - Link a list of companies to an intern

[Back to content](#content)

## Quick links

| Section | Link |
|-------- | -----|
| APIs    | [api/v1](./src/api/v1/) |
| Postman |  |
| Docker compose | [docker](./compose.yaml)

## Authors

- Taiwo Babalola

## Reach Out

Please reach out to me if you'd like to contribute to this project.

- [Twitter](https://www.twitter.com/realtaiwo_peter)
- [Linkedin](https://www.linkedin.com/in/taiwo-babalola)

[Back to content](#content)
