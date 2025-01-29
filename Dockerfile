# Usa Python como base
FROM python:3.11.4

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /src

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN pip install -r requirements.txt

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación con Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "flaskr.app:app"]

