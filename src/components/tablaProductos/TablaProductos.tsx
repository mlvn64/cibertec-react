import React from "react";
import { IProduct } from "../../types";
import { TablaProductosHeader } from "./TablaProductosHeader";
import { TablaProductosFila } from "./TablaProductosFila";

interface IProps {
    data: IProduct[] // un arreglo de IProduct
    onDeleteProducts: (productId: number) => Promise<void>;
}

export function TablaProductos(props: IProps) {
    return <table className="table table-bordered">
        <TablaProductosHeader></TablaProductosHeader>
        <tbody>
            {props.data.map((productoIterador) => {
                return <TablaProductosFila key={productoIterador.productId}
                    producto={productoIterador} onDeleteProduct={props.onDeleteProducts}></TablaProductosFila>
            })}
        </tbody>
    </table>
}