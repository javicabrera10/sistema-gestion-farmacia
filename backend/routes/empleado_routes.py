from flask import Blueprint

from controllers.empleado_controller import (
    obtener_empleados,
    obtener_empleado,
    crear_empleado,
    actualizar_empleado,
    eliminar_empleado
)


empleado_bp = Blueprint("empleado", __name__)


@empleado_bp.route("/empleados", methods=["GET"])
def listar_empleados():
    return obtener_empleados()


@empleado_bp.route("/empleados/<int:id>", methods=["GET"])
def buscar_empleado(id):
    return obtener_empleado(id)


@empleado_bp.route("/empleados", methods=["POST"])
def agregar_empleado():
    return crear_empleado()


@empleado_bp.route("/empleados/<int:id>", methods=["PUT"])
def editar_empleado(id):
    return actualizar_empleado(id)


@empleado_bp.route("/empleados/<int:id>", methods=["DELETE"])
def borrar_empleado(id):
    return eliminar_empleado(id)