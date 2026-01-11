# 🏨 StaySmart | Distributed Hotel Reservation System

![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-orange?style=flat)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat&logo=docker)

**StaySmart** is a full-stack hotel reservation platform engineered to demonstrate a robust **Distributed Microservices Architecture**. 

Instead of a traditional monolith, this system decouples business domains into specialized, independent services, ensuring scalability and fault tolerance. The core philosophy of the project is **Polyglot Persistence**: using the best database for each specific problem (Relational for transactions, Document-based for content, and Inverted Indices for search).

The system ensures data consistency across these disparate data sources using an **Event-Driven Architecture** powered by RabbitMQ, allowing for asynchronous synchronization between the Hotel management service and the Search engine.

## 🚀 Key Technical Features

* **Microservices in Go:** Backend services built with **Go (Gin)**, implementing Clean Architecture and MVC patterns to ensure code maintainability.
* **High-Performance Search:** Integration of **Apache Solr** to provide sub-millisecond, faceted search capabilities for hotels (by city, amenities, etc.).
* **Asynchronous Communication:** Usage of **RabbitMQ** to decouple write operations (MongoDB) from read operations (Solr), ensuring eventual consistency.
* **Secure Authentication:** Complete JWT-based authentication flow with password hashing and role-based access control (Admin/User).
* **Containerization:** The entire ecosystem (Frontend, APIs, Databases, Queues) is orchestrated via **Docker Compose** for consistent deployment.