import React from "react";
import { IPageBaseProps, IProduct } from "../types";
import { obtenerPorId } from "../services/productService";

interface IProps extends IPageBaseProps {
    productId?: number;
}

export default function DetalleProducto(props: IProps) {
    // declarar una variable del estado para guardar la info del producto
    const [product, setProduct] = React.useState<IProduct>();

    React.useEffect(() => {
        async function getProduct(productId: number) {
            const resultado = await obtenerPorId(productId);
            setProduct(resultado);
        }

        if (props.productId) {
            getProduct(props.productId);
        }
    }, [])

    return <div>
        Detalle del producto con ID {props.productId}
        <pre>
            {JSON.stringify(product)}
        </pre>
    </div>
}
