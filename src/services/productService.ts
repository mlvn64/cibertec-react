import axios from "axios";
import { IProduct } from "../types";
import { refreshToken } from "./authService";
import { obtenerAuthToken } from "./baseService";

// url base de los servicios web (proyecto VS 2017)
const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function obtenerTodos(): Promise<IProduct[]> {
    // obtener el resultado de la solicitud en una variable
    const resultado = await axios.get(`${BASE_URL}/products`, {
        headers: {
            Authorization: `Bearer ${await obtenerAuthToken()}`
        }
    });
    // devolver la data obtenida del resultado, casteandola como un arreglo de IProduct
    return resultado.data as IProduct[];
}

export async function obtenerPorId(productId: number): Promise<IProduct> {
    const resultado = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${await obtenerAuthToken()}`
        }
    })
    return resultado.data as IProduct;
}

export async function insertarProduct(nuevoProducto: Partial<IProduct>): Promise<string> {
    const resultado = await axios.post(`${BASE_URL}/products`, nuevoProducto, {
        headers: {
            Authorization: `Bearer ${await obtenerAuthToken()}`
        }
    });
    return resultado.data;
}

export async function deleteProduct(productId: number): Promise<number> {
    const resultado = await axios.delete(`${BASE_URL}/products/${productId}`, {
        headers: {
            Authorization: `Bearer ${await obtenerAuthToken()}`
        }
    });
    return resultado.data;
}