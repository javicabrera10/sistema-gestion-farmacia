
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

# Inicializar extensiones
db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Registrar Blueprints
app.register_blueprint(medicamentos_bp, url_prefix="/api")
app.register_blueprint(categoria_bp)
app.register_blueprint(empleado_bp)

# Crear las tablas
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
