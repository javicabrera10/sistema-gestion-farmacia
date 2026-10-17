from datetime import datetime
from database import db
from models.medicamento import Medicamento
from models.categoria import Categoria
from models.empleado import Empleado


def _validar_medicamento(data, parcial=False):
    """Valida y limpia los datos de un medicamento.

    Devuelve (datos_limpios, None) si está todo bien,
    o (None, mensaje_de_error) si algo no cumple.
    Con parcial=True solo se validan los campos que vengan en data (PUT).
    """
    if not isinstance(data, dict) or not data:
        return None, "No se enviaron datos"

    def falta(campo):
        valor = data.get(campo)
        return valor is None or str(valor).strip() == ""

    limpio = {}

    if not parcial or "nombre" in data:
        if falta("nombre"):
            return None, "El nombre es obligatorio"
        nombre = str(data["nombre"]).strip()
        if len(nombre) > 100:
            return None, "El nombre no puede superar los 100 caracteres"
        limpio["nombre"] = nombre

    if not parcial or "precio" in data:
        if falta("precio"):
            return None, "El precio es obligatorio"
        try:
            precio = float(data["precio"])
        except (TypeError, ValueError):
            return None, "El precio debe ser un número"
        if precio <= 0:
            return None, "El precio debe ser mayor a 0"
        limpio["precio"] = precio

    if not parcial or "stock" in data:
        if falta("stock"):
            return None, "El stock es obligatorio"
        try:
            stock = int(str(data["stock"]).strip())
        except ValueError:
            return None, "El stock debe ser un número entero"
        if stock < 0:
            return None, "El stock no puede ser negativo"
        limpio["stock"] = stock

    if not parcial or "fecha_vencimiento" in data:
        if falta("fecha_vencimiento"):
            return None, "La fecha de vencimiento es obligatoria"
        try:
            limpio["fecha_vencimiento"] = datetime.strptime(
                str(data["fecha_vencimiento"]).strip(), "%Y-%m-%d"
            ).date()
        except ValueError:
            return None, "La fecha de vencimiento no es válida (formato AAAA-MM-DD)"

    if not parcial or "categoria_id" in data:
        if falta("categoria_id"):
            return None, "La categoría es obligatoria"
        try:
            categoria_id = int(str(data["categoria_id"]).strip())
        except ValueError:
            return None, "La categoría no es válida"
        if db.session.get(Categoria, categoria_id) is None:
            return None, "La categoría seleccionada no existe"
        limpio["categoria_id"] = categoria_id

    return limpio, None


def obtener_medicamentos():
    medicamentos = Medicamento.query.all()
    return [m.to_dict() for m in medicamentos], 200


def obtener_medicamento_por_id(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    return medicamento.to_dict(), 200


def crear_medicamento(data):
    limpio, error = _validar_medicamento(data)
    if error:
        return {"error": error}, 400
    try:
        nuevo = Medicamento(**limpio)
        db.session.add(nuevo)
        db.session.commit()
        return {
            "mensaje": "Medicamento creado correctamente",
            "medicamento": nuevo.to_dict(),
        }, 201
    except Exception:
        db.session.rollback()
        return {"error": "No se pudo guardar el medicamento"}, 500


def actualizar_medicamento(id, data):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404

    limpio, error = _validar_medicamento(data, parcial=True)
    if error:
        return {"error": error}, 400
    try:
        for campo, valor in limpio.items():
            setattr(medicamento, campo, valor)
        db.session.commit()
        return {
            "mensaje": "Medicamento actualizado correctamente",
            "medicamento": medicamento.to_dict(),
        }, 200
    except Exception:
        db.session.rollback()
        return {"error": "No se pudo actualizar el medicamento"}, 500


def eliminar_medicamento(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    try:
        db.session.delete(medicamento)
        db.session.commit()
        return {"mensaje": "Medicamento eliminado correctamente"}, 200
    except Exception:
        db.session.rollback()
        return {"error": "No se pudo eliminar el medicamento"}, 500


def obtener_resumen_dashboard():
    medicamentos = Medicamento.query.all()
    total_productos = len(medicamentos)
    
    # Calcular stock total e inventario valorizado
    stock_total = sum(m.stock for m in medicamentos)
    valor_inventario = sum(m.precio * m.stock for m in medicamentos)
    
    # Alerta de stock crítico (por ejemplo, menos de 5 unidades)
    stock_critico = [m.to_dict() for m in medicamentos if m.stock <= 5]
    
    resumen = {
        "total_productos": total_productos,
        "total_categorias": Categoria.query.count(),
        "total_empleados": Empleado.query.count(),
        "stock_total": stock_total,
        "valor_inventario": round(valor_inventario, 2),
        "alertas_stock": stock_critico,
        "total_alertas": len(stock_critico)
    }
    return resumen, 200