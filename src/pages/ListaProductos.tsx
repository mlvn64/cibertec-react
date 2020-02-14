import React, { useState, useEffect } from "react";
import { IProduct, IPageBaseProps } from "../types";
import { Title } from "../components/global/Title";
import { DescripcionCantidad } from "../components/global/DescripcionCantidad";
import { TablaProductos } from "../components/tablaProductos/TablaProductos";
import { obtenerTodos, deleteProduct } from "../services/productService";
import loading from './loading.svg';
import { Link } from "@reach/router";
import * as SignalR from "@aspnet/signalr";

export function ListaProductos(props: IPageBaseProps) {

    // utilizar el state para manjear una variable data
    const [data, setData] = useState<IProduct[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [hubConnection, setHubConnection] = useState<SignalR.HubConnection>();

    async function cargarProductos() {
        var productos = await obtenerTodos();
        setData(productos);

        // una vez que tengamos respuesta del servicio, ocultar el indicador de cargando
        setCargando(false);
    }

    // definir un efecto para cuando el componente cargue por primera vez
    useEffect(() => {
        // simular un servicio lento
        setTimeout(() => {
            cargarProductos();
        }, 500);

        // configurar el hub connection
        // instanciar la conexión
        const newConnection = new SignalR.HubConnectionBuilder().withUrl(`${process.env.REACT_APP_BASE_URL}/producthub`).build();

        newConnection.on("actualizarLista", function (product) {
            // actualizar la data
            cargarProductos();
        })

        // iniciar la conexión
        newConnection.start().catch(error => console.error(error));

        // guardar la conexión en el state
        setHubConnection(newConnection);
    }, [])

    const borrarProducto = async (productId: number) => {
        const resultadoBorrar = await deleteProduct(productId);
        if (resultadoBorrar > 0) {
            // cargarProductos();
            // llamar al hub de producto para indicarle que tiene que actualizar la lista de los clientes
            if (hubConnection) {
                await hubConnection.send("modificarProducto", {})
            }
        }
    }

    const descripcionCantidad = `Hay ${data.length} de productos registrados`;

    // mostrar el indicador de cargando
    if (cargando) {
        return <div className="d-flex justify-content-center">
            <img src={loading}></img>
        </div>

    }

    return <div>
        <Title texto="Lista de Productos"></Title>
        <DescripcionCantidad texto={descripcionCantidad}></DescripcionCantidad>
        <Link to="/products/insert" className="btn btn-primary btn-sm mb-3">Crear nuevo producto</Link>
        <TablaProductos data={data} onDeleteProducts={borrarProducto}></TablaProductos>
    </div>
}