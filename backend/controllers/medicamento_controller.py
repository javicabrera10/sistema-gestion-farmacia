from datetime import datetime
from database import db
from models.medicamento import Medicamento
from models.categoria import Categoria
from models.empleado import Empleado

def obtener_medicamentos():
    medicamentos = Medicamento.query.all()
    return [m.to_dict() for m in medicamentos], 200

def obtener_medicamento_por_id(id):
    medicamento = Medicamento.query.get(id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    return medicamento.to_dict(), 200

def crear_medicamento(data):
    try:
        fecha_venc = datetime.strptime(data["fecha_vencimiento"], "%Y-%m-%d").date()
        nuevo = Medicamento(
            nombre=data["nombre"],
            precio=data["precio"],
            stock=data["stock"],
            fecha_vencimiento=fecha_venc,
            categoria_id=data["categoria_id"]
        )
        db.session.add(nuevo)
        db.session.commit()
        return nuevo.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

def actualizar_medicamento(id, data):
    medicamento = Medicamento.query.get(id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    try:
        if "nombre" in data:
            medicamento.nombre = data["nombre"]
        if "precio" in data:
            medicamento.precio = data["precio"]
        if "stock" in data:
            medicamento.stock = data["stock"]
        if "fecha_vencimiento" in data:
            medicamento.fecha_vencimiento = datetime.strptime(data["fecha_vencimiento"], "%Y-%m-%d").date()
        if "categoria_id" in data:
            medicamento.categoria_id = data["categoria_id"]
            
        db.session.commit()
        return medicamento.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

def eliminar_medicamento(id):
    medicamento = Medicamento.query.get(id)
    if not medicamento:
        return {"error": "Medicamento no encontrado"}, 404
    try:
        db.session.delete(medicamento)
        db.session.commit()
        return {"mensaje": "Medicamento eliminado correctamente"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400

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