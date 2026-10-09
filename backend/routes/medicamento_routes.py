from flask import Blueprint, request, jsonify
from controllers import medicamento_controller as controller

medicamentos_bp = Blueprint("medicamentos", __name__, url_prefix="/api/medicamentos")

@medicamentos_bp.route("", methods=["GET"])
def get_medicamentos():
    data, code = controller.obtener_medicamentos()
    return jsonify(data), code

@medicamentos_bp.route("/<int:id>", methods=["GET"])
def get_medicamento(id):
    data, code = controller.obtener_medicamento_por_id(id)
    return jsonify(data), code

@medicamentos_bp.route("", methods=["POST"])
def create_medicamento():
    data = request.get_json()
    res, code = controller.crear_medicamento(data)
    return jsonify(res), code

@medicamentos_bp.route("/<int:id>", methods=["PUT"])
def update_medicamento(id):
    data = request.get_json()
    res, code = controller.actualizar_medicamento(id, data)
    return jsonify(res), code

@medicamentos_bp.route("/<int:id>", methods=["DELETE"])
def delete_medicamento(id):
    res, code = controller.eliminar_medicamento(id)
    return jsonify(res), code