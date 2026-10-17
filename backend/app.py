from flask import Flask
from flask_cors import CORS

from config import Config
from database import db

from models.categoria import Categoria
from models.medicamento import Medicamento
from models.empleado import Empleado

from routes.medicamento_routes import medicamentos_bp
from routes.categoria_routes import categoria_bp
from routes.empleado_routes import empleado_bp

app = Flask(__name__)
app.config.from_object(Config)

# Permitir CORS desde cualquier origen para evitar bloqueos del navegador
CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)

# Registro de rutas con el prefijo /api
app.register_blueprint(medicamentos_bp, url_prefix="/api")
app.register_blueprint(categoria_bp, url_prefix="/api")
app.register_blueprint(empleado_bp, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)