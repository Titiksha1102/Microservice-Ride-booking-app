# TezzRides - A Ride Booking Application 🚖

**TezzRides** is a scalable, real-time ride booking application built with a modular microservices architecture using Node.js and Express.js. Designed to provide a seamless experience for users and captains, TezzRides ensures fast, reliable, and consistent ride coordination using modern backend patterns and frontend interactivity.

## 🚀 Features

- 🔧 **Modular Microservices Architecture**
  - Three core Express.js services:
    - **User Service**
    - **Captain Service**
    - **Ride Service**
  - Each service is independently containerized using **Docker** and uses **MongoDB** for data storage.

- 🌀 **Distributed Workflow Management**
  - Implemented the **Saga Pattern** via **RabbitMQ** to maintain data consistency across services without blocking transactions.

- 🌐 **API Gateway**
  - Centralized request routing with an API Gateway handling **100+ test requests daily**, improving security and scalability.

- ⚡ **Real-Time Communication**
  - Integrated **Socket.IO** to enable sub-second ride request delivery and instant updates for Captains.

- 💻 **Responsive React Frontend**
  - Developed **10+ dynamic components** providing a smooth and responsive UI for both Users and Captains.

## 📸 Demo

▶️ **[Watch Full Demonstration of TezzRides](https://your-demo-link-here.com)**

## 📦 Tech Stack

- **Backend:** Node.js, Express.js, RabbitMQ, Socket.IO
- **Frontend:** React.js
- **Database:** MongoDB
- **DevOps:** Docker, Docker Compose
- **API Management:** API Gateway (e.g., NGINX or custom Node gateway)


