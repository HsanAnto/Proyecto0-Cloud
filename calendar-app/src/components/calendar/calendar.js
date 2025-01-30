import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './calendar.css';
import addIcon from '../../statics/add.png';
import filterIcon from '../../statics/filter.png';
import binIcon from '../../statics/bin.png';

function Calendar() {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const BACKURL = process.env.REACT_APP_BACKURL;
    const [filteredTasks, setFilteredTasks] = useState([]); // Tareas filtradas
    const [filteredCategory, setFilteredCategory] = useState(''); // Categoría seleccionada
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState('');
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDueDate, setEditedDueDate] = useState('');
    const [editedState, setEditedState] = useState('');
    const profileImage = localStorage.getItem('profile_image');





    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BACKURL}/categorias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Error fetching categories');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch Tasks
    const fetchTasks = useCallback(async (token) => {
        try {
            const url = `${BACKURL}/usuarios/tareas`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Error fetching tasks');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, [BACKURL, setTasks]);

    // Verificar el token al montar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchTasks(token);
        }
    }, [navigate, fetchTasks]);

    useEffect(() => {
        if (!filteredCategory) {
            setFilteredTasks(tasks); // Si no hay filtro, mostramos todas las tareas
        } else {
            setFilteredTasks(tasks.filter(task => task.category_id === parseInt(filteredCategory)));
        }
    }, [tasks, filteredCategory]);

    // Función para abrir el modal
    const openModal = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setCategoryName(''); // Limpiar el input al cerrar
    };

    // Función para abrir el modal
    const openTaskModal = () => {
        fetchCategories();
        setShowTaskModal(true);
    };
    
    const closeTaskModal = () => {
        setShowTaskModal(false);
        setTaskDescription('');
        setTaskDueDate('');
        setSelectedCategory('');
    };

    const openEditTaskModal = (task) => {
        setTaskToEdit(task);
        setEditedDescription(task.description);
        setEditedDueDate(task.due_date);
        setEditedState(task.state);
        setShowEditTaskModal(true);
    };

    const closeEditTaskModal = () => {
        setShowEditTaskModal(false);
        setTaskToEdit(null);
        setEditedDescription('');
        setEditedDueDate('');
        setEditedState('');
    };

    const handleCreateTask = async () => {
        const token = localStorage.getItem('token');
        if (!taskDescription.trim() || !taskDueDate || !selectedCategory) {
            alert("Todos los campos son obligatorios.");
            return;
        }
    
        try {
            const response = await fetch(`${BACKURL}/tareas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: taskDescription,
                    due_date: taskDueDate,
                    category_id: selectedCategory
                })
            });
    
            if (response.status === 201) {
                alert("Tarea creada exitosamente.");
                closeTaskModal();
                fetchTasks(token);
            } else {
                const data = await response.json();
                alert(data.message || "Error al crear la tarea.");
            }
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleUpdateTask = async () => {
        if (!taskToEdit) return;
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${BACKURL}/tareas/${taskToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: editedDescription,
                    due_date: editedDueDate,
                    state: editedState
                })
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Tarea actualizada exitosamente.");
                fetchTasks(token); // Actualizar la lista de tareas
                closeEditTaskModal();
            } else {
                alert(data.message || "Error al actualizar la tarea.");
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToEdit) return;
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${BACKURL}/tareas/${taskToEdit.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Tarea eliminada exitosamente.");
                fetchTasks(token); // Actualizar la lista de tareas
                closeEditTaskModal();
            } else {
                alert(data.message || "Error al eliminar la tarea.");
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    // Función para manejar la creación de una nueva categoría
    const handleCreateCategory = async () => {
        const token = localStorage.getItem('token');
        if (!categoryName.trim()) {
            alert("El nombre de la categoría es requerido.");
            return;
        }

        try {
            const response = await fetch(`${BACKURL}/categorias`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: categoryName })
            });

            if (response.status === 201) {
                alert("Categoría creada exitosamente.");
                closeModal(); // Cerrar el modal tras éxito
            } else {
                const data = await response.json();
                alert(data.message || "Error al crear la categoría.");
            }
        } catch (error) {
            console.error("Error al crear la categoría:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleFilterByCategory = (categoryId) => {
        setFilteredCategory(categoryId);
    
        if (!categoryId) {
            setFilteredTasks(tasks); // Si no hay categoría seleccionada, mostrar todas las tareas
        } else {
            const filtered = tasks.filter(task => task.category_id === parseInt(categoryId)); // Filtrar por category_id
            setFilteredTasks(filtered);
        }
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
        if (!showFilterDropdown) {
            fetchCategories(); // Cargar categorías cuando se abre el dropdown
        }

        setShowFilterDropdown(!showFilterDropdown);
    };

    const openDeleteModal = () => {
        fetchCategories(); // Cargar las categorías antes de abrir el modal
        setShowDeleteModal(true);
    };
    
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCategoryToDelete('');
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) {
            alert("Selecciona una categoría para eliminar.");
            return;
        }
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${BACKURL}/categorias/${categoryToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Categoría eliminada exitosamente.");
                fetchCategories(); // Refrescar la lista de categorías
                closeDeleteModal();
            } else {
                alert(data.message || "Error al eliminar la categoría.");
            }
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            alert("Error al conectar con el servidor.");
        }
    };
    
    
    
    

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h1 className="calendar-logo">
                    <span className="calendar-white-letter">E</span>
                    <span className="calendar-colored-letter">C</span>
                </h1>
                <img src={profileImage} alt="Profile" className="profile-image" />
            </div>
            <div className="divider"></div>

            <div className="content">
                {/* Menú Lateral */}
                <div className="sidebar">
                    <div className="menu-section">
                        <h2>Tasks</h2>
                        <div className="menu-item" onClick={openTaskModal}>
                            <img src={addIcon} alt="Add" className="icon" />
                            <span>Add</span>
                        </div>
                        <div className="menu-item" onClick={toggleFilterDropdown}>
                            <img src={filterIcon} alt="Filter" className="icon" />
                            <span>Filter By Category</span>
                        </div>
                        {showFilterDropdown && (
                            <div className="filter-dropdown">
                                <select onChange={(e) => handleFilterByCategory(e.target.value)} value={filteredCategory}>
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="menu-section">
                        <h2>Categories</h2>
                        <div className="menu-item" onClick={openModal}>
                            <img src={addIcon} alt="Add" className="icon" />
                            <span>Add</span>
                        </div>
                        <div className="menu-item"  onClick={openDeleteModal}>
                            <img src={binIcon} alt="Delete" className="icon" />
                            <span>Delete</span>
                        </div>
                    </div>
                </div>

                {/* Tabla de Tareas */}
                <div className="tasks-container">
                    <div className="tasks-header">
                        <h2>My Tasks</h2>
                    </div>
                    <div className="tasks-list">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <div className="task-card" key={index} onClick={() => openEditTaskModal(task)}>
                                    <div className="task-description">{task.description}</div>
                                    <div className="task-dates">
                                        {new Date(task.created_at).toISOString().split('T')[0]} /
                                        {new Date(task.due_date).toISOString().split('T')[0]}
                                    </div>
                                    <div className="task-state">{task.state}</div>
                                </div>
                            ))
                        ) : (
                            <p className="no-tasks">No tasks available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para Crear Categoría */}
            {showModal && (
                <div className="category-modal-overlay">
                    <div className="category-modal-content">
                        <h3>Create Category</h3>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <div className="category-modal-buttons">
                            <button onClick={closeModal}>Cancel</button>
                            <button onClick={handleCreateCategory}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Crear tareas */}
            {showTaskModal && (
                <div className="task-modal-overlay">
                    <div className="task-modal-content">
                        <h3>Create Task</h3>
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <span className="task-due-date-title">Due Date:</span>
                        <input
                            type="date"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                        />
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="" disabled>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className="task-modal-buttons">
                            <button onClick={closeTaskModal}>Cancel</button>
                            <button onClick={handleCreateTask}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Eliminar categorias */}
            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal-content">
                        <h3>Delete Category</h3>
                        <select value={categoryToDelete} onChange={(e) => setCategoryToDelete(e.target.value)}>
                            <option value="" disabled>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className="delete-modal-buttons">
                            <button onClick={closeDeleteModal}>Cancel</button>
                            <button onClick={handleDeleteCategory}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {showEditTaskModal && taskToEdit && (
                <div className="edit-task-modal-overlay">
                    <div className="edit-task-modal-content">
                        {/* Contenedor del título y botón de cierre */}
                        <div className="edit-task-modal-header">
                            <h3 className="modal-title">Edit Task</h3>
                            <button className="close-modal-button" onClick={closeEditTaskModal}>&times;</button>
                        </div>
                        
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                        <span className="task-due-date-title">Due Date:</span>
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                        />
                        <select value={editedState} onChange={(e) => setEditedState(e.target.value)}>
                            <option value="Sin Empezar">Sin Empezar</option>
                            <option value="Empezada">Empezada</option>
                            <option value="Finalizada">Finalizada</option>
                        </select>
                        <div className="edit-task-modal-buttons">
                            <button onClick={handleUpdateTask}>Save Changes</button>
                            <button onClick={handleDeleteTask} className="delete-task-button">Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Calendar;
