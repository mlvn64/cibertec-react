import React from "react";
import { IProduct } from "../../types";
import { Link } from "@reach/router";

interface IProps {
    producto: IProduct;
    onDeleteProduct: (productId: number) => Promise<void>;
}

export function TablaProductosFila(props: IProps) {
    return <tr key={props.producto.productId}>
        <td>
            {props.producto.productName}
        </td>
        <td>
            {props.producto.unitPrice}
        </td>
        <td>
            <Link to={`/products/${props.producto.productId}`}>Detalle</Link>
            <button className="btn btn-link btn-sm" onClick={() => { props.onDeleteProduct(props.producto.productId) }}>Borrar</button>
        </td>
    </tr>
}