from flask import Blueprint
from controllers.categoria_controller import (
    obtener_categorias,
    obtener_categoria,
    crear_categoria,
    actualizar_categoria,
    eliminar_categoria
)

categoria_bp = Blueprint("categorias", __name__)

@categoria_bp.route("/categorias", methods=["GET"])
def listar():
    return obtener_categorias()

@categoria_bp.route("/categorias/<int:id>", methods=["GET"])
def obtener(id):
    return obtener_categoria(id)

@categoria_bp.route("/categorias", methods=["POST"])
def crear():
    return crear_categoria()

@categoria_bp.route("/categorias/<int:id>", methods=["PUT"])
def actualizar(id):
    return actualizar_categoria(id)

@categoria_bp.route("/categorias/<int:id>", methods=["DELETE"])
def eliminar(id):
    return eliminar_categoria(id)