from flask import Blueprint, request, jsonify
from controllers.medicamento_controller import (
    obtener_medicamentos,
    obtener_medicamento_por_id,
    crear_medicamento,
    actualizar_medicamento,
    eliminar_medicamento,
    obtener_resumen_dashboard
)

medicamentos_bp = Blueprint("medicamentos", __name__)

@medicamentos_bp.route("/dashboard", methods=["GET"])
def dashboard():
    res, status = obtener_resumen_dashboard()
    return jsonify(res), status

@medicamentos_bp.route("/medicamentos", methods=["GET"])
def listar():
    res, status = obtener_medicamentos()
    return jsonify(res), status

@medicamentos_bp.route("/medicamentos/<int:id>", methods=["GET"])
def obtener(id):
    res, status = obtener_medicamento_por_id(id)
    return jsonify(res), status

@medicamentos_bp.route("/medicamentos", methods=["POST"])
def crear():
    data = request.get_json(silent=True)
    res, status = crear_medicamento(data)
    return jsonify(res), status

@medicamentos_bp.route("/medicamentos/<int:id>", methods=["PUT"])
def actualizar(id):
    data = request.get_json(silent=True)
    res, status = actualizar_medicamento(id, data)
    return jsonify(res), status

@medicamentos_bp.route("/medicamentos/<int:id>", methods=["DELETE"])
def eliminar(id):
    res, status = eliminar_medicamento(id)
    return jsonify(res), status