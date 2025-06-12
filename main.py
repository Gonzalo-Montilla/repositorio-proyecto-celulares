from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Configuración de la base de datos SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./soat.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelos de la base de datos
class Celular(Base):
    __tablename__ = "celulares"
    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, index=True)
    modelo = Column(String)
    precio = Column(Float)

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String)
    telefono = Column(String)

class Proveedor(Base):
    __tablename__ = "proveedores"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    contacto = Column(String)
    direccion = Column(String)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Endpoints para Celulares
@app.get("/celulares")
async def read_celulares():
    db: Session = SessionLocal()
    try:
        return [{"id": item.id, "marca": item.marca, "modelo": item.modelo, "precio": item.precio} for item in db.query(Celular).all()]
    finally:
        db.close()

@app.post("/celulares")
async def create_celular(marca: str, modelo: str, precio: float):
    db: Session = SessionLocal()
    try:
        db_celular = Celular(marca=marca, modelo=modelo, precio=precio)
        db.add(db_celular)
        db.commit()
        db.refresh(db_celular)
        return {"message": "Celular creado", "id": db_celular.id}
    finally:
        db.close()

@app.put("/celulares/{celular_id}")
async def update_celular(celular_id: int, marca: str, modelo: str, precio: float):
    db: Session = SessionLocal()
    try:
        db_celular = db.query(Celular).filter(Celular.id == celular_id).first()
        if not db_celular:
            raise HTTPException(status_code=404, detail="Celular no encontrado")
        db_celular.marca = marca
        db_celular.modelo = modelo
        db_celular.precio = precio
        db.commit()
        return {"message": "Celular actualizado"}
    finally:
        db.close()

@app.delete("/celulares/{celular_id}")
async def delete_celular(celular_id: int):
    db: Session = SessionLocal()
    try:
        db_celular = db.query(Celular).filter(Celular.id == celular_id).first()
        if not db_celular:
            raise HTTPException(status_code=404, detail="Celular no encontrado")
        db.delete(db_celular)
        db.commit()
        return {"message": "Celular eliminado"}
    finally:
        db.close()

# Endpoints para Clientes
@app.get("/clientes")
async def read_clientes():
    db: Session = SessionLocal()
    try:
        return [{"id": item.id, "nombre": item.nombre, "email": item.email, "telefono": item.telefono} for item in db.query(Cliente).all()]
    finally:
        db.close()

@app.post("/clientes")
async def create_cliente(nombre: str, email: str, telefono: str):
    db: Session = SessionLocal()
    try:
        db_cliente = Cliente(nombre=nombre, email=email, telefono=telefono)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return {"message": "Cliente creado", "id": db_cliente.id}
    finally:
        db.close()

@app.put("/clientes/{cliente_id}")
async def update_cliente(cliente_id: int, nombre: str, email: str, telefono: str):
    db: Session = SessionLocal()
    try:
        db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not db_cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        db_cliente.nombre = nombre
        db_cliente.email = email
        db_cliente.telefono = telefono
        db.commit()
        return {"message": "Cliente actualizado"}
    finally:
        db.close()

@app.delete("/clientes/{cliente_id}")
async def delete_cliente(cliente_id: int):
    db: Session = SessionLocal()
    try:
        db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        if not db_cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        db.delete(db_cliente)
        db.commit()
        return {"message": "Cliente eliminado"}
    finally:
        db.close()

# Endpoints para Proveedores
@app.get("/proveedores")
async def read_proveedores():
    db: Session = SessionLocal()
    try:
        return [{"id": item.id, "nombre": item.nombre, "contacto": item.contacto, "direccion": item.direccion} for item in db.query(Proveedor).all()]
    finally:
        db.close()

@app.post("/proveedores")
async def create_proveedor(nombre: str, contacto: str, direccion: str):
    db: Session = SessionLocal()
    try:
        db_proveedor = Proveedor(nombre=nombre, contacto=contacto, direccion=direccion)
        db.add(db_proveedor)
        db.commit()
        db.refresh(db_proveedor)
        return {"message": "Proveedor creado", "id": db_proveedor.id}
    finally:
        db.close()

@app.put("/proveedores/{proveedor_id}")
async def update_proveedor(proveedor_id: int, nombre: str, contacto: str, direccion: str):
    db: Session = SessionLocal()
    try:
        db_proveedor = db.query(Proveedor).filter(Proveedor.id == proveedor_id).first()
        if not db_proveedor:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        db_proveedor.nombre = nombre
        db_proveedor.contacto = contacto
        db_proveedor.direccion = direccion
        db.commit()
        return {"message": "Proveedor actualizado"}
    finally:
        db.close()

@app.delete("/proveedores/{proveedor_id}")
async def delete_proveedor(proveedor_id: int):
    db: Session = SessionLocal()
    try:
        db_proveedor = db.query(Proveedor).filter(Proveedor.id == proveedor_id).first()
        if not db_proveedor:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")
        db.delete(db_proveedor)
        db.commit()
        return {"message": "Proveedor eliminado"}
    finally:
        db.close()

# Ruta para el formulario HTML 
@app.get("/", response_class=HTMLResponse)
async def read_form(request: Request):
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al renderizar el formulario: {str(e)}")