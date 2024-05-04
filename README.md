
# Your Next Intern (YNI) - API

## Content

- [Introduction](#introduction)
- [Technologies](#technology)
- [APIs](#apis)
- [Quick Links](#quick-links)
- [Authors](#authors)
- [Reach Out](#reach-out)

## Introduction

YNI is a web application built to ease the process of seeking for internship positions by undergraduates in Nigerian Universities. It aims to bridge the gap between prospective interns and organizations looking to train/equip the next generation of talents.

With this API, organizations will be able to open or close their application windows, and they can also monitor the number of applicants on their profiles. Interns can apply to as many companies as possible, given that the application window of the company is open, or cancel their applications.

YNI-API is built with TypeScript, NestJs, and uses PostgreSQL as the RDBMS.

[Back to content](#content)

## Technology

This section lists the programming langauages, libraries, and frameworks used in the development of the application.

- Node.js
- TypeScript
- NestJs
- PostgreSQL
- Docker

[Back to content](#content)

## APIs

_Please note that the endpoints here are not the complete documentation for the corresponding request and response types. A link to the complete documentation in postman will be provided in due time as development progresses._

- ### Authentication endpoints [click here for code](./src/api/v1/auth/auth.controller.ts)

  - __POST /api/auth/companies/login__ - authentication of registered companies to login

  - __POST /auth/interns/login__ - authentication of registered interns to login

  - __POST /api/auth/companies__ - authentication of companies to register

  - __POST /api/auth/interns__ - authentication of interns to register

- ### Companies endpoints - [click here to see code](./src/api/v1/company/company.controller.ts)

  - __GET api/companies?pageNumber=1?pageSize=20__ - Get all companies by page

  - __POST /api/auth/companies__ - Add a new company

  - __GET /api/companies/:id__ - Get a company.

  - __PUT /api/companies/:id__ - update a company's information

  - __DELETE /api/companies/:id__ - delete a company

- ### Interns endpoints - [click here to see code](./src/api/v1/intern/intern.controller.ts)

  - __GET api/interns?pageNumber=1?pageSize=20__ - Get all interns by page

  - __POST /api/auth/interns__ - Add a new intern

  - __GET /api/interns/:id__ - Get an intern.

  - __PUT /api/interns/:id__ - update an intern's information

  - __DELETE /api/interns/:id__ - delete an intern

  - __POST /api/interns/:id/companies__ - Link a list of companies to an intern

[Back to content](#content)

## Quick links

| Section | Link |
|-------- | -----|
| Version One APIs    | [api/v1](./src/api/v1/) |
| Postman Documetation |  |
| Docker compose | [docker](./compose.yaml) |

## Authors

- Taiwo Babalola

## Reach Out

Please reach out to me if you'd like to contribute to this project.

- [Twitter](https://www.twitter.com/realtaiwo_peter)
- [Linkedin](https://www.linkedin.com/in/taiwo-babalola)

[Back to content](#content)
