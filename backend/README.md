# Proyecto Backend con Flask y SQLAlchemy

Este proyecto es un backend en Python utilizando Flask y SQLAlchemy. Además, se utiliza Docker Compose para levantar los servicios necesarios, incluyendo una base de datos PostgreSQL y un contenedor de Adminer para la gestión de la base de datos.

## Contenido

- [Requisitos](#requisitos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Ejecutar con Docker](#ejecutar-con-docker)
- [Ejecutar sin Docker](#ejecutar-sin-docker)
- [Cargar la Base de Datos](#cargar-la-base-de-datos)
- [Archivo de Configuración](#archivo-de-configuración)

## Requisitos

- Docker y Docker Compose (para ejecutar con Docker)
- Python 3.8 o superior (para ejecutar sin Docker)
- `virtualenv` (para gestionar entornos virtuales sin Docker)

## Configuración del Entorno

Todos los archivos de configuración del entorno se encuentran en el directorio `./env`. Asegúrate de tener los siguientes archivos:

- `.env`
- `.env.local`

## Ejecutar con Docker

1. Asegúrate de que Docker y Docker Compose están instalados en tu sistema.
2. Navega al directorio raiz del repositorio (`TP1-CAMEJO`).
3. Ejecuta el siguiente comando para levantar los servicios:

    ```bash
    docker-compose -f ./backend/docker-compose.backend.yml --env-file <path/to/env-file> up -d --build
    ```

4. Para bajar los servicios, utiliza:

    ```bash
    docker-compose -f ./backend/docker-compose.backend.yml down 
    ```

## Ejecutar api sin Docker

1. Asegúrate de tener Python 3.8 o superior instalado.
2. Navega al directorio del proyecto.
3. Crea un entorno virtual:

    ```bash
    python3 -m venv venv
    ```

4. Activa el entorno virtual:

    - En Windows:

        ```bash
        .\venv\Scripts\activate
        ```

    - En macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

5. Instala los requerimientos:

    ```bash
    pip install -r requirements.txt
    ```

6. Asegúrate de que el archivo `.env.local` está presente en el directorio `./env`.
7. Ejecuta la aplicación:

    ```bash
    FLASK_ENV=local python3 src/app.py
    ```

## Cargar la Base de Datos

El archivo `populate_db.py` se utiliza para cargar todos los datos en la base de datos. Para ejecutarlo, sigue los mismos pasos que para ejecutar la API sin Docker:

1. Asegúrate de tener Python 3.8 o superior instalado.
2. Navega al directorio del proyecto.
3. Crea y activa el entorno virtual (si no lo has hecho ya).
4. Instala los requerimientos (si no lo has hecho ya).
5. Asegúrate de que el archivo `.env.local` está presente en el directorio `./env`.
6. Ejecuta el script para cargar la base de datos:

    ```bash
    FLASK_ENV=local python3 src/populate_db.py
    ```

## Archivo de Configuración

El archivo `config.py` ubicado en `src/` se utiliza para gestionar la configuración de la aplicación. Este archivo define diferentes configuraciones para distintos entornos (desarrollo, pruebas, producción) y carga las variables de entorno necesarias para la aplicación. Asegúrate de revisar y ajustar este archivo según sea necesario para tu entorno específico.

## Estructura del Proyecto

```plaintext
.
├── Dockerfile
├── docker-compose.backend.yml
├── env
│   ├── .env
│   └── .env.local
├── requirements.txt
├── populate_db.py
├── src
│   ├── app.py
│   ├── models
│   ├── blueprints
│   ├── services
│   └── config.py
└── README.md
