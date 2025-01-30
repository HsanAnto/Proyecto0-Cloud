FROM python:3.11.4

WORKDIR /flaskr

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

# Expone el puerto 8080
EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "backend.app:app"]

