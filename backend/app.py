from flask import Flask
from flask_cors import CORS

from config import Config
from database import db

from models.categoria import Categoria
from models.medicamento import Medicamento
from models.empleado import Empleado

from routes.medicamento_routes import medicamentos_bp


def create_app():
    app = Flask(__name__)

    # Cargar configuración
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    CORS(app)

    # Registrar Blueprints
    app.register_blueprint(medicamentos_bp)

    # Crear las tablas
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)