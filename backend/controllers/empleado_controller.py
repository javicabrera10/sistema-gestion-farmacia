from flask import jsonify, request

from database import db
from models.empleado import Empleado


def obtener_empleados():
    empleados = Empleado.query.all()

    resultado = []

    for empleado in empleados:
        resultado.append({
            "id": empleado.id,
            "nombre": empleado.nombre,
            "apellido": empleado.apellido,
            "dni": empleado.dni,
            "email": empleado.email,
            "cargo": empleado.cargo
        })

    return jsonify(resultado), 200


def obtener_empleado(id):
    empleado = db.session.get(Empleado, id)

    if not empleado:
        return jsonify({
            "error": "Empleado no encontrado"
        }), 404

    return jsonify({
        "id": empleado.id,
        "nombre": empleado.nombre,
        "apellido": empleado.apellido,
        "dni": empleado.dni,
        "email": empleado.email,
        "cargo": empleado.cargo
    }), 200


def crear_empleado():
    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se enviaron datos"
        }), 400

    nombre = datos.get("nombre")
    apellido = datos.get("apellido")
    dni = datos.get("dni")
    email = datos.get("email")
    cargo = datos.get("cargo")

    if not nombre or not apellido or not dni or not email or not cargo:
        return jsonify({
            "error": "Todos los campos son obligatorios"
        }), 400

    empleado_existente = Empleado.query.filter(
        (Empleado.dni == dni) | (Empleado.email == email)
    ).first()

    if empleado_existente:
        return jsonify({
            "error": "El DNI o email ya están registrados"
        }), 409

    nuevo_empleado = Empleado(
        nombre=nombre,
        apellido=apellido,
        dni=dni,
        email=email,
        cargo=cargo
    )

    db.session.add(nuevo_empleado)
    db.session.commit()

    return jsonify({
        "mensaje": "Empleado creado correctamente",
        "empleado": {
            "id": nuevo_empleado.id,
            "nombre": nuevo_empleado.nombre,
            "apellido": nuevo_empleado.apellido,
            "dni": nuevo_empleado.dni,
            "email": nuevo_empleado.email,
            "cargo": nuevo_empleado.cargo
        }
    }), 201


def actualizar_empleado(id):
    empleado = db.session.get(Empleado, id)

    if not empleado:
        return jsonify({
            "error": "Empleado no encontrado"
        }), 404

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se enviaron datos"
        }), 400

    nombre = datos.get("nombre")
    apellido = datos.get("apellido")
    dni = datos.get("dni")
    email = datos.get("email")
    cargo = datos.get("cargo")

    if not nombre or not apellido or not dni or not email or not cargo:
        return jsonify({
            "error": "Todos los campos son obligatorios"
        }), 400

    empleado_existente = Empleado.query.filter(
        ((Empleado.dni == dni) | (Empleado.email == email)),
        Empleado.id != id
    ).first()

    if empleado_existente:
        return jsonify({
            "error": "El DNI o email ya están registrados"
        }), 409

    empleado.nombre = nombre
    empleado.apellido = apellido
    empleado.dni = dni
    empleado.email = email
    empleado.cargo = cargo

    db.session.commit()

    return jsonify({
        "mensaje": "Empleado actualizado correctamente",
        "empleado": {
            "id": empleado.id,
            "nombre": empleado.nombre,
            "apellido": empleado.apellido,
            "dni": empleado.dni,
            "email": empleado.email,
            "cargo": empleado.cargo
        }
    }), 200


def eliminar_empleado(id):
    empleado = db.session.get(Empleado, id)

    if not empleado:
        return jsonify({
            "error": "Empleado no encontrado"
        }), 404

    db.session.delete(empleado)
    db.session.commit()

    return jsonify({
        "mensaje": "Empleado eliminado correctamente"
    }), 200