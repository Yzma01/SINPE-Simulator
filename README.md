# SINPE Simulator

Web-based prototype designed to simulate the basic concepts behind Costa Rica's SINPE electronic payment system. The project provides a modern Next.js foundation for building financial transaction flows such as inter-bank transfers, transaction state tracking, and SINPE Móvil-style payment logic.

## Overview

SINPE Simulator is a web application concept focused on explaining and modeling how electronic payment flows work in Costa Rica's financial ecosystem.

The current repository is in its foundational stage. It provides the frontend architecture, routing structure, styling system, development tooling, and project setup required to continue building a more complete financial transaction simulator.

The long-term goal of the project is to create an educational and technical simulation environment where users can understand how payment requests, validations, transaction states, and settlement processes could work in a simplified version of SINPE.

## Key Features

* Modern web application foundation with Next.js
* React-based user interface
* App Router architecture
* Responsive styling with Tailwind CSS
* Turbopack development workflow
* ESLint configuration for code quality
* Prepared structure for financial simulation modules
* Planned support for SINPE Móvil-style flows
* Planned transaction lifecycle tracking
* Planned inter-bank transfer simulation
* Prepared environment configuration using ignored `.env` files

## Tech Stack

* Next.js
* React
* JavaScript
* Tailwind CSS
* Turbopack
* ESLint
* PostCSS
* Dotenv
* Express
* Firebase
* JSON Web Token
* Mongoose
* React Hot Toast

## Project Context

SINPE, the Sistema Nacional de Pagos Electrónicos, is Costa Rica's national electronic payment system. It connects financial institutions and other authorized entities to support electronic fund transfers and payment operations.

This project does not connect to the real SINPE network. Instead, it is intended as a learning and simulation tool for understanding payment system concepts in a controlled development environment.

## Planned Simulation Scope

The simulator is designed to evolve around three main areas:

### Transaction Flow Simulation

The project aims to represent the lifecycle of a payment transaction, including states such as request creation, validation, pending processing, approval, rejection, and settlement.

### SINPE Móvil Concept

A future module may simulate how a phone number can be associated with a bank account or IBAN to perform simplified transfers between users.

### Inter-bank Transfer Logic

The simulator is planned to model simplified communication between a sender bank and a receiver bank, including validation, transaction routing, and final status updates.

## Architecture

The project follows the standard Next.js App Router structure.

### Application Layer

The main application code is located inside the `src/` directory. The `app/` directory defines the routing tree, shared layout, global styles, and main page structure.

### Routing

Routing is handled through the Next.js file-system routing model. The root route renders the main home page, while the root layout provides the shared HTML structure and global configuration.

### Styling

The styling system uses Tailwind CSS and PostCSS. Global styles and theme-level variables are centralized in the application stylesheet, allowing the project to maintain a consistent visual foundation.

### Tooling

The development workflow uses Turbopack through the Next.js development command. ESLint is included to help maintain code quality and consistency during development.

### Environment Configuration

The repository is configured to exclude environment files, build artifacts, dependencies, and local platform metadata from version control. This helps keep the repository clean and avoids exposing sensitive configuration values.

## Current Status

This repository is currently a technical foundation for the simulator. The core project setup, build pipeline, routing structure, styling system, and dependency base are already configured.

The domain-specific financial logic is planned as the next major development step.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the application locally:

```bash
http://localhost:3000
```

Build the project for production:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Project Purpose

This project was created to explore how a modern web application can be used to model financial transaction systems in an educational way.

It demonstrates skills in Next.js project setup, React UI development, routing architecture, Tailwind CSS styling, development tooling, environment configuration, and planning for more advanced financial simulation logic.
