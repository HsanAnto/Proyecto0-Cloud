from flaskr import create_app
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flaskr.models import db
from flask_cors import CORS
from flaskr.views import (
    CreateUser,
    LoginUser,
    CreateTask,
    GetTasksByUser,
    UpdateTask,
    DeleteTask,
    GetCategories,
    CreateCategory,
    DeleteCategory
)

# Crear la aplicación Flask
app = create_app()

# Contexto de la aplicación
app_context = app.app_context()
app_context.push()
db.init_app(app)
db.create_all()

# Registrar los endpoints
api = Api(app)
cors = CORS(app)

# Endpoints de usuarios
api.add_resource(CreateUser, '/usuarios')
api.add_resource(LoginUser, '/usuarios/iniciar-sesion')

# Endpoints de tareas
api.add_resource(CreateTask, '/tareas')
api.add_resource(GetTasksByUser, '/usuarios/tareas')
api.add_resource(UpdateTask, '/tareas/<int:task_id>')
api.add_resource(DeleteTask, '/tareas/<int:task_id>')

# Endpoints de categorías
api.add_resource(GetCategories, '/categorias')
api.add_resource(CreateCategory, '/categorias')
api.add_resource(DeleteCategory, '/categorias/<int:category_id>')

jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
