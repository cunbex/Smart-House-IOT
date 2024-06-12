# Smart House IoT
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cunbex/Smart-House-IOT/blob/main/LICENSE)

Smart House IoT is a project aimed at building a smart home system using Internet of Things (IoT) technologies.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Informations](#informations)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Smart House IoT project allows you to control various devices and monitor environmental conditions in your house remotely through IoT technologies. Whether it's controlling lights, temperature, or security cameras, this project provides a flexible framework to build your smart home system.

## Features

- Control lights and appliances remotely.
- Monitor temperature, humidity, and gas usage.
- Flexible and extensible architecture.

## Getting Started

### Prerequisites

To run this project, you will need:
- Raspberry Pi or any other compatible single-board computer.
- Sensors (e.g., temperature, humidity).
- Actuators (e.g., relays for controlling appliances).
- Node.js 20.14.0 or later.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cunbex/Smart-House-IOT.git
cd Smart-House-IOT
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Prisma:

```bash
prisma init
```
   Make sure to create a Prisma .env file and set up your database connection links.

4. Pull the database schema:

```bash
prisma db pull
```

5. Generate Prisma client:

```bash
prisma generate
```

6. Start the project:

```bash
npm run devstart
```

### Usage

After installation, you can run the project using `npm run devstart`.

### Informations

- For the experiment to work, three repositories must be running either on the cloud or your machine: Smart-House-IOT, controller_dashboard, mosquitto_api.
- Regarding PaaS used, i hosted the API's & website on render.com, the docker container that has MQTT/Mosquitto running on dockerHub & the database on supabase.com.
- Additional setup is required for the experiment to work. The project is highly dependent on the `.env` file, so make sure you create your own `.env` file.
- This is not a finished project; it's a university licensed degree project.
- The project is hosted at: [https://smart-house-iot.onrender.com/](https://smart-house-iot.onrender.com/) (sometimes may require up to 50 seconds for the website to load).
- A single-board computer is required.
- Single-board computer code is on the controller-dashboard repository: [controller_dashboard](https://github.com/cunbex/controller_dashboard).
- Mosquitto API code is on the mosquitto_api repository: [mosquitto_api](https://github.com/cunbex/mosquitto-api).

### Demo

screenshots for user dashboard & some console.log during the manipulation:

## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your changes, or if you have questions & suggestions you can contact me on my email: hamzalagab.tech@gmail.com.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
