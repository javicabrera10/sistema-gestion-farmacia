from flask import jsonify, request

from database import db
from models.categoria import Categoria


def obtener_categorias():
    categorias = Categoria.query.all()

    resultado = []

    for categoria in categorias:
        resultado.append({
            "id": categoria.id,
            "nombre": categoria.nombre
        })

    return jsonify(resultado), 200


def obtener_categoria(id):
    categoria = db.session.get(Categoria, id)

    if not categoria:
        return jsonify({
            "error": "Categoría no encontrada"
        }), 404

    return jsonify({
        "id": categoria.id,
        "nombre": categoria.nombre
    }), 200


def crear_categoria():
    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se enviaron datos"
        }), 400

    nombre = datos.get("nombre")

    if not nombre:
        return jsonify({
            "error": "El nombre es obligatorio"
        }), 400

    categoria_existente = Categoria.query.filter_by(
        nombre=nombre
    ).first()

    if categoria_existente:
        return jsonify({
            "error": "La categoría ya existe"
        }), 409

    nueva_categoria = Categoria(
        nombre=nombre
    )

    db.session.add(nueva_categoria)
    db.session.commit()

    return jsonify({
        "mensaje": "Categoría creada correctamente",
        "categoria": {
            "id": nueva_categoria.id,
            "nombre": nueva_categoria.nombre
        }
    }), 201


def actualizar_categoria(id):
    categoria = db.session.get(Categoria, id)

    if not categoria:
        return jsonify({
            "error": "Categoría no encontrada"
        }), 404

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se enviaron datos"
        }), 400

    nombre = datos.get("nombre")

    if not nombre:
        return jsonify({
            "error": "El nombre es obligatorio"
        }), 400

    categoria_existente = Categoria.query.filter(
        Categoria.nombre == nombre,
        Categoria.id != id
    ).first()

    if categoria_existente:
        return jsonify({
            "error": "La categoría ya existe"
        }), 409

    categoria.nombre = nombre

    db.session.commit()

    return jsonify({
        "mensaje": "Categoría actualizada correctamente",
        "categoria": {
            "id": categoria.id,
            "nombre": categoria.nombre
        }
    }), 200


def eliminar_categoria(id):
    categoria = db.session.get(Categoria, id)

    if not categoria:
        return jsonify({
            "error": "Categoría no encontrada"
        }), 404

    try:
        db.session.delete(categoria)
        db.session.commit()

        return jsonify({
            "mensaje": "Categoría eliminada correctamente"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "error": "No se puede eliminar la categoría porque tiene medicamentos asociados"
        }), 409