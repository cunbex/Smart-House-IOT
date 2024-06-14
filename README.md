# Smart House IoT License year project
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cunbex/Smart-House-IOT/blob/main/LICENSE)

Smart House IoT is a project aimed at building a smart home system using Internet of Things (IoT) technologies.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Documentation](#Documentation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Informations & Experiment](#informations)
  - [Demo Pictures](#Demo-Pictures)
  - [Demo Video](#Demo-Video)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Smart House IoT project allows you to control various devices and monitor environmental conditions in your house remotely through IoT technologies. Whether it's controlling lights, temperature, or security cameras, this project provides a flexible framework to build your smart home system.

## Documentation

You can find the project license year Thesis in PDF format [here](pdf/USTHB_Thesis.pdf). Keep in mind that i was obligated to write the Thesis in french and i'm too lazy to translate it to english, if you can help with that / provide a solution feel free to email me.

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
- [Controller dashboard repo](https://github.com/cunbex/controller_dashboard) installed & running.
- [Mosquitto API repo](https://github.com/cunbex/mosquitto-api) installed & running.
- Node.js 20.14.0 or later.

### Installation

This installation pattern will be applied to all the 3 repo's, Smart-House-IOT repo, Controller_dashboard repo & Mosquitto_api repo.

1. Clone the repository:

```bash
git clone https://github.com/cunbex/Smart-House-IOT.git
cd Smart-House-IOT
```

2. Install dependencies:

```bash
npm install
```

3. Initialize .env & Prisma:
   
Make sure to create a .env file and set up your database connection in prisma links and your environment variables.

```bash
prisma init
```
- Pull the database schema if the schema is already made:

```bash
prisma db pull
```

4. Generate Prisma client:

```bash
prisma generate
```

5. Start the project:

```bash
npm run devstart
```

### Usage

After installation, you can run the project using `npm run devstart`.

## Informations

- For the experiment to work, three repositories must be running either on the cloud or your machine: Smart-House-IOT, controller_dashboard, mosquitto_api.
- Regarding PaaS used, i hosted the API's & website on render.com, the docker container that has MQTT/Mosquitto running on dockerHub & the database on supabase.com.
- Additional setup is required for the experiment to work. The project is highly dependent on the `.env` file, so make sure you create your own `.env` file, feel free to email me if you have problems setting it up.
- This is not a finished project; it's a university licensed degree project. [Website link](https://smart-house-iot.onrender.com/) (sometimes may require up to 50 seconds for the website to load).
- A single-board computer is required.
- Single-board computer code is on the controller-dashboard repository: [controller_dashboard](https://github.com/cunbex/controller_dashboard).
- Mosquitto API code is on the mosquitto_api repository: [mosquitto_api](https://github.com/cunbex/mosquitto-api).

### Demo-Pictures
1. Landing page:
   
   ![Landing page](demo/1.png?raw=true)
   
2. Sign up page:
   
   ![Sign-up page](demo/2.png?raw=true)
   
3. Log in page:
   
   ![Log-in page](demo/3.png?raw=true)
   
4. User Dashboard - Setting page, when receiving confirmation of pairing success with a controller:
   
   ![Setting page](demo/4.png?raw=true)
   
5. User Dashboard - Setting page, after pairing an existing controller in the DB with a user account:
   
   ![Setting page](demo/5.png?raw=true)
   
6. User Dashboard - Devices page:
   
   ![Devices page](demo/6.png?raw=true)
   
7. Controller(RaspberryPi) log after scanning for an IOT device:
    
   ![Log after scanning](demo/7.png?raw=true)
   
8. Controller(RaspberryPi) log after connecting to an IOT device:
    
   ![Log after connecting](demo/8.png?raw=true)
   
9. Controller(RaspberryPi) log after recieving a value from an IOT device:
    
   ![Log after recieving a value](demo/9.png?raw=true)

### Demo-video

I have made a simple video demonstration a basic experiment of my project:
1. I had the raspberryPi on & all the repo's up also.
2. Connected the simulated IOT devices with the controller using the controller dashboard.
3. Paired the controller with the user in the user dashboard (SKIPPED in the video because my controller was already paired), and did WRITE/READ value's on my simulated devices.

You can check it out here: https://drive.google.com/file/d/1IlTaaxwtkMrfE8qchtaBrxbRrn7dVUXT/view?usp=sharing
   
## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your changes, or if you have questions & suggestions you can contact me on my email: hamzalagab.tech@gmail.com.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
