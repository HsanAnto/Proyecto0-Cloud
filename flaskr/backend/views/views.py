from flask import request, jsonify
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import db, User, Task, Category, TaskState
from datetime import datetime

# Usuario: Crear usuario
class CreateUser(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        profile_image = data.get('profile_image')

        if not username  or not password:
            return {'message': 'Faltan datos requeridos'}, 400
        
        user = User.query.filter_by(username=username).first()
        if user:
            return {'message': 'El usuario ya existe'}, 409

        hashed_password = generate_password_hash(password)
        
        user = User(username=username, password=hashed_password, profile_image=profile_image)

        try:
            db.session.add(user)
            db.session.commit()
            return {'message': 'Usuario creado exitosamente'}, 201
        except:
            db.session.rollback()
            return {'message': 'Error al crear el usuario'}, 500

# Usuario: Iniciar sesión
class LoginUser(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=str(user.id))
            return {'access_token': access_token}, 200
        else:
            return {'message': 'Credenciales inválidas'}, 401

# Tareas: Crear una tarea
class CreateTask(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        description = data.get('description')
        due_date = data.get('due_date')
        category_id = data.get('category_id')

        if not description:
            return {'message': 'La descripción es requerida'}, 400
        
        if datetime.strptime(due_date, '%Y-%m-%d') < datetime.now():
            return {'message': 'La fecha de vencimiento debe ser mayor a la fecha actual'}, 400
        
        if not category_id:
            return {'message': 'La tarea debe pertenecer a una categoria'}, 400
        
        category = Category.query.filter_by(id=category_id).first()
        if not category:
            return {'message': 'La categoria a la que intenta agregar la tarea no existe'}, 400

        try:
            due_date = datetime.strptime(due_date, '%Y-%m-%d') if due_date else None
            task = Task(description=description, user_id=user_id, due_date=due_date, category_id=category_id)
            db.session.add(task)
            db.session.commit()
            return {'message': 'Tarea creada exitosamente'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error al crear la tarea', 'error': str(e)}, 500

# Tareas: Obtener tareas por usuario
class GetTasksByUser(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()

        tasks = Task.query.filter_by(user_id=user_id).all()
        task_list = [{
            'id': task.id,
            'description': task.description,
            'state': task.state.value,
            'created_at': task.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'due_date': task.due_date.strftime('%Y-%m-%d') if task.due_date else None,
            'category_id': task.category_id
        } for task in tasks]

        return task_list, 200

# Tareas: Actualizar tarea
class UpdateTask(Resource):
    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        data = request.get_json()

        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return {'message': 'Tarea no encontrada'}, 404
        
        if datetime.strptime(data.get('due_date'), '%Y-%m-%d') < datetime.now():
            return {'message': 'La fecha de vencimiento debe ser mayor a la fecha actual'}, 400

        task.description = data.get('description', task.description)
        task.state = TaskState(data.get('state', task.state.value))
        task.due_date = datetime.strptime(data.get('due_date'), '%Y-%m-%d') if data.get('due_date') else task.due_date

        try:
            db.session.commit()
            return {'message': 'Tarea actualizada exitosamente'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error al actualizar la tarea', 'error': str(e)}, 500

# Tareas: Eliminar tarea
class DeleteTask(Resource):
    @jwt_required()
    def delete(self, task_id):
        user_id = get_jwt_identity()

        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return {'message': 'Tarea no encontrada'}, 404

        try:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Tarea eliminada exitosamente'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error al eliminar la tarea', 'error': str(e)}, 500

# Categorías: Obtener categorías
class GetCategories(Resource):
    def get(self):
        categories = Category.query.all()
        category_list = [{'id': category.id, 'name': category.name} for category in categories]
        return category_list, 200

# Categorías: Crear categoría
class CreateCategory(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        name = data.get('name')

        if not name:
            return {'message': 'El nombre de la categoría es requerido'}, 400

        category = Category(name=name, tasks=[])

        try:
            db.session.add(category)
            db.session.commit()
            return {'message': 'Categoría creada exitosamente'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error al crear la categoría', 'error': str(e)}, 500

# Categorías: Eliminar categoría
class DeleteCategory(Resource):
    @jwt_required()
    def delete(self, category_id):
        category = Category.query.filter_by(id=category_id).first()

        if not category:
            return {'message': 'Categoría no encontrada'}, 404
        
        associated_tasks = Task.query.filter_by(category_id=category_id).first()
        if associated_tasks:
            return {
                'message': 'La categoría no se puede eliminar porque tiene tareas asociadas'
            }, 400

        try:
            db.session.delete(category)
            db.session.commit()
            return {'message': 'Categoría eliminada exitosamente'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error al eliminar la categoría', 'error': str(e)}, 500
