from flask import Blueprint

from controllers.categoria_controller import (
    obtener_categorias,
    obtener_categoria,
    crear_categoria,
    actualizar_categoria,
    eliminar_categoria
)


categoria_bp = Blueprint(
    "categoria",
    __name__,
    url_prefix="/api/categorias"
)


@categoria_bp.route("", methods=["GET"])
def listar_categorias():
    return obtener_categorias()


@categoria_bp.route("/<int:id>", methods=["GET"])
def buscar_categoria(id):
    return obtener_categoria(id)


@categoria_bp.route("", methods=["POST"])
def agregar_categoria():
    return crear_categoria()


@categoria_bp.route("/<int:id>", methods=["PUT"])
def modificar_categoria(id):
    return actualizar_categoria(id)


@categoria_bp.route("/<int:id>", methods=["DELETE"])
def borrar_categoria(id):
    return eliminar_categoria(id)