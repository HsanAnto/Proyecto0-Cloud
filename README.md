# Proyecto: Calendar App

## Descripción
Calendar App es una aplicación web que permite a los usuarios gestionar tareas y categorías. La aplicación cuenta con una interfaz amigable desarrollada en **React** para el frontend y un backend robusto construido en **Flask**. Todo el proyecto está completamente **dockerizado** para facilitar su despliegue y ejecución.

## Tecnologías Utilizadas

### Backend
- **Flask**: Framework ligero para desarrollo web en Python.
- **Flask-RESTful**: Para la creación de API REST.
- **Flask-JWT-Extended**: Manejo de autenticación con JSON Web Tokens.
- **Flask-CORS**: Para permitir solicitudes desde distintos dominios.
- **PostgreSQL**: Base de datos utilizada.

### Frontend
- **React**: Framework para la interfaz de usuario.
- **React Hooks**: Manejo del estado y efectos.
- **React Router**: Para la navegación entre vistas.

### Dockerización
- **Docker**: Contenedorización de la aplicación.
- **Docker Compose**: Orquestación de múltiples contenedores (backend, frontend y base de datos).

## Instalación y Ejecución

### **Requisitos previos**
Antes de ejecutar el proyecto, asegúrate de tener instalado en tu máquina:
- **Docker** ([Descargar Docker](https://www.docker.com/get-started))
- **Docker Compose**

### **Pasos para ejecutar la aplicación**
1. **Clonar el repositorio**
   ```sh
   git clone https://github.com/HsanAnto/Proyecto0-Cloud.git
   cd Proyecto0
2. **Ejecutar Docker**
3. **Ejecutar el proyecto con Docker Compose**
   ```sh
   docker-compose up --build -d
