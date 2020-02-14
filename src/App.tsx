import React from "react";
import "./App.css"
import { Link, Router } from "@reach/router";
import { ListaProductos } from "./pages/ListaProductos";
import { ListaCategorias } from "./pages/ListaCategorias";
import DetalleProducto from "./pages/DetalleProducto";
import InsertarProducto from "./pages/InsertarProducto";
import { obtenerToken } from "./services/authService";
import { Chat } from "./pages/Chat";

interface ILoginProps {
    onAuthenticate: () => void;
}

function Login(props: ILoginProps) {
    const validarCredenciales = async (username: string, password: string) => {
        const tokenData = await obtenerToken(username, password);
        console.log("nuevo token", tokenData.accessToken);
        // escribir el token en el local storage
        if (tokenData.accessToken) {
            localStorage.setItem("cibertec-token", tokenData.accessToken);
            localStorage.setItem("cibertec-refresh-token", tokenData.refreshToken);
            const expirationDateMs = new Date().getTime() + tokenData.expiresIn * 1000;
            localStorage.setItem("cibertec-token-expiration-ms", expirationDateMs.toString());
        }

        // mostrar el admin
        props.onAuthenticate();
    }

    const iniciarSesion = (e: any) => {
        e.preventDefault();
        console.log("Se va a iniciar sesión");
        const username = e.target["username"].value;
        const password = e.target["password"].value;
        validarCredenciales(username, password);
    }
    return <div className="container-fluid shadow-sm p-3 mb-5 bg-white rounded mt-5" style={{ maxWidth: 480 }}>
        <h2 className="mb-3">Iniciar Sesión</h2>
        <form onSubmit={iniciarSesion}>
            <div className="form-group">
                <label>Usuario</label>
                <input type="text" name="username" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" className="form-control"></input>
            </div>
            <div>
                <button className="btn btn-primary">Iniciar</button>
            </div>
        </form>
    </div>
}

interface IAdminProps {
    onSignOut: () => void;
}

function Admin(props: IAdminProps) {
    return <>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
            <input className="form-control form-control-dark w-100" type="text" placeholder="Search" />
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <a className="nav-link" href="#" onClick={() => {
                        // borrar el local storage
                        localStorage.clear();
                        props.onSignOut();
                    }}>Cerrar Sesión</a>
                </li>
            </ul>
        </nav>

        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" to="/products">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/categories">Categorías</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/chat">Chat</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    {/* Estas son las rutas disponibles para redireccionar */}
                    <Router>
                        <ListaProductos path="/products"></ListaProductos>
                        <ListaCategorias path="/categories"></ListaCategorias>
                        <DetalleProducto path="/products/:productId"></DetalleProducto>
                        <InsertarProducto path="/products/insert"></InsertarProducto>
                        <Chat path="/chat"></Chat>
                    </Router>
                </main>
            </div>
        </div>
    </>
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

    // comprobar si existe un token
    React.useEffect(() => {
        if (localStorage.getItem("cibertec-token")) {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated) {
        return <Login onAuthenticate={() => { setIsAuthenticated(true) }} />
    }
    return <Admin onSignOut={() => { setIsAuthenticated(false) }} />
}