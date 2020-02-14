import React from "react";
import { IPageBaseProps, IProduct } from "../types";
import { Title } from "../components/global/Title";
import { insertarProduct } from "../services/productService";
import * as SignalR from "@aspnet/signalr";

export default function InsertarProducto(props: IPageBaseProps) {
    const [mensaje, setMensaje] = React.useState<string>("");
    const [hubConnection, setHubConnection] = React.useState<SignalR.HubConnection>();

    React.useEffect(() => {
        // instanciar la conexión
        const newConnection = new SignalR.HubConnectionBuilder().withUrl(`${process.env.REACT_APP_BASE_URL}/producthub`).build();

        // iniciar la conexión
        newConnection.start().catch(error => console.error(error));

        // guardar la conexión en el state
        setHubConnection(newConnection);
    }, [])

    const formSubmit = (e: any) => {
        e.preventDefault();
        // obtener los valores que el usuario ha ingresado en el form
        const newProduct: Partial<IProduct> = {}

        newProduct.productName = e.target["productName"].value;

        // llamar a la función local para guardar el producto
        guardarProducto(newProduct);
    }

    const guardarProducto = async (nuevoProducto: Partial<IProduct>) => {
        // llamar al servicio web para insertar el producto
        const resultadoServicio = await insertarProduct(nuevoProducto);

        // llamar al hub de producto para indicarle que tiene que actualizar la lista de los clientes
        if (hubConnection) {
            await hubConnection.send("modificarProducto", nuevoProducto)
        }
        
        setMensaje(resultadoServicio);
    }
    return <div>
        <Title texto="Insertar un Producto"></Title>
        <form className="mt-3" onSubmit={formSubmit}>
            <div className="form-group">
                <label htmlFor="productName">Nombre</label>
                <input className="form-control" type="text" name="productName" id="productName" placeholder="Ingresa el nombre del producto"></input>
            </div>
            <button type="submit" className="btn btn-primary">Guardar</button>
        </form>

        <p className="mt-3">Resultado de insertar: {mensaje}</p>
    </div>
}