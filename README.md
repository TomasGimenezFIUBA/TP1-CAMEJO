# TP1-CAMEJO
Repositorio destinado a la materia Introducción al Desarrollo de Software. Camejo.

# Proyecto de Rutinas y Ejercicios

Este proyecto es una aplicación web que permite a los usuarios crear rutinas, añadir ejercicios, guardarlos en favoritos, y más. Está desarrollada utilizando una arquitectura de microservicios con un backend en Python y Flask, y un frontend en Astro.

## Contenido

- [Tecnologías Usadas](#tecnologías-usadas)
- [Configuración del Entorno](#configuración-del-entorno)
- [Levantar los Servicios con Docker](#levantar-los-servicios-con-docker)
- [Bajar los Servicios](#bajar-los-servicios)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Notas](#notas)

## Tecnologías Usadas

- **Backend**: Python, Flask, SQLAlchemy, PostgreSQL
- **Frontend**: Astro
- **Contenedores**: Docker, Docker Compose

## Configuración del Entorno

Todos los archivos de configuración del entorno se encuentran en el directorio `./backend/env`. Asegúrate de tener los siguientes archivos:

- `.env`
- `.env.local`

## Levantar los Servicios con Docker

Para levantar el backend y el frontend con Docker, sigue estos pasos:

1. Asegúrate de que Docker y Docker Compose están instalados en tu sistema.
2. Navega al directorio del proyecto.
3. Ejecuta el siguiente comando para levantar los servicios:

    ```bash
    docker-compose -f ./backend/docker-compose.backend.yml --env-file <path/to/env-file> -f docker-compose.services.yml up -d --build
    ```

Este comando levantará los siguientes servicios:

- **Base de Datos**: PostgreSQL
- **Adminer**: Para gestionar la base de datos
- **API**: El backend desarrollado en Flask
- **Frontend**: La aplicación frontend desarrollada en Astro

## Bajar los Servicios

Para bajar los servicios, utiliza el siguiente comando:

```bash
docker-compose -f ./backend/docker-compose.backend.yml -f docker-compose.services.yml down
