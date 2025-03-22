-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-03-2025 a las 13:54:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbtiendaonline`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `idCarrito` int(11) NOT NULL,
  `fkProducto` int(11) NOT NULL,
  `cantProducto` int(11) NOT NULL DEFAULT 0,
  `montoTotal` varchar(10) NOT NULL DEFAULT '0.0',
  `fkCuentaUser` int(11) NOT NULL,
  `estatusCarrito` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`idCarrito`, `fkProducto`, `cantProducto`, `montoTotal`, `fkCuentaUser`, `estatusCarrito`) VALUES
(1, 1, 1, '1200.00', 1, 'ACTIVO'),
(2, 2, 2, '50.00', 2, 'ACTIVO'),
(3, 3, 1, '500.00', 3, 'ACTIVO'),
(4, 4, 3, '90.00', 4, 'ACTIVO'),
(5, 5, 1, '150.00', 5, 'ACTIVO'),
(6, 6, 2, '40.00', 6, 'ACTIVO'),
(7, 7, 1, '800.00', 7, 'ACTIVO'),
(8, 8, 5, '10.00', 8, 'ACTIVO'),
(9, 9, 1, '15.00', 9, 'ACTIVO'),
(10, 10, 2, '400.00', 10, 'ACTIVO'),
(11, 11, 1, '100.00', 11, 'ACTIVO'),
(12, 12, 3, '30.00', 12, 'ACTIVO'),
(13, 13, 2, '50.00', 13, 'ACTIVO'),
(14, 14, 1, '30.00', 14, 'ACTIVO'),
(15, 15, 1, '1000.00', 15, 'ACTIVO'),
(16, 15, 5, '5000.00', 1, 'ACTIVO'),
(17, 14, 1, '30.00', 1, 'ACTIVO'),
(18, 13, 1, '25.00', 1, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `idCategoria` int(11) NOT NULL,
  `descCategoria` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`idCategoria`, `descCategoria`) VALUES
(1, 'Electrónica'),
(2, 'Ropa'),
(3, 'Hogar'),
(4, 'Deportes'),
(5, 'Juguetes'),
(6, 'Libros'),
(7, 'Muebles'),
(8, 'Alimentos'),
(9, 'Belleza'),
(10, 'Automóviles'),
(11, 'Herramientas'),
(12, 'Jardín'),
(13, 'Mascotas'),
(14, 'Salud'),
(15, 'Tecnología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `idContacto` int(11) NOT NULL,
  `nombreContacto` varchar(200) NOT NULL,
  `tlfContacto` varchar(100) DEFAULT NULL,
  `emailContacto` varchar(100) DEFAULT NULL,
  `estatusContacto` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`idContacto`, `nombreContacto`, `tlfContacto`, `emailContacto`, `estatusContacto`) VALUES
(1, 'Cliente 1', '123456789', 'cliente1@example.com', 'ACTIVO'),
(2, 'Cliente 2', '987654321', 'cliente2@example.com', 'ACTIVO'),
(3, 'Cliente 3', '555555555', 'cliente3@example.com', 'ACTIVO'),
(4, 'Cliente 4', '111111111', 'cliente4@example.com', 'ACTIVO'),
(5, 'Cliente 5', '222222222', 'cliente5@example.com', 'ACTIVO'),
(6, 'Cliente 6', '333333333', 'cliente6@example.com', 'ACTIVO'),
(7, 'Cliente 7', '444444444', 'cliente7@example.com', 'ACTIVO'),
(8, 'Cliente 8', '666666666', 'cliente8@example.com', 'ACTIVO'),
(9, 'Cliente 9', '777777777', 'cliente9@example.com', 'ACTIVO'),
(10, 'Cliente 10', '888888888', 'cliente10@example.com', 'ACTIVO'),
(11, 'Cliente 11', '999999999', 'cliente11@example.com', 'ACTIVO'),
(12, 'Cliente 12', '000000000', 'cliente12@example.com', 'ACTIVO'),
(13, 'Cliente 13', '121212121', 'cliente13@example.com', 'ACTIVO'),
(14, 'Cliente 14', '131313131', 'cliente14@example.com', 'ACTIVO'),
(15, 'Cliente 15', '141414141', 'cliente15@example.com', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentasusuarios`
--

CREATE TABLE `cuentasusuarios` (
  `idCuentaUser` int(11) NOT NULL,
  `nombreUser` varchar(200) DEFAULT NULL,
  `emailUser` varchar(100) NOT NULL,
  `tlfUser` varchar(100) DEFAULT NULL,
  `passw` varchar(100) NOT NULL,
  `estatus` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `cuentasusuarios`
--

INSERT INTO `cuentasusuarios` (`idCuentaUser`, `nombreUser`, `emailUser`, `tlfUser`, `passw`, `estatus`) VALUES
(1, 'Juan Pérez', 'juan@example.com', '123456789', 'password1', 'ACTIVO'),
(2, 'María López', 'maria@example.com', '987654321', 'password2', 'ACTIVO'),
(3, 'Carlos Gómez', 'carlos@example.com', '555555555', 'password3', 'ACTIVO'),
(4, 'Ana Martínez', 'ana@example.com', '111111111', 'password4', 'ACTIVO'),
(5, 'Luis Rodríguez', 'luis@example.com', '222222222', 'password5', 'ACTIVO'),
(6, 'Sofía García', 'sofia@example.com', '333333333', 'password6', 'ACTIVO'),
(7, 'Pedro Sánchez', 'pedro@example.com', '444444444', 'password7', 'ACTIVO'),
(8, 'Laura Fernández', 'laura@example.com', '666666666', 'password8', 'ACTIVO'),
(9, 'Miguel Torres', 'miguel@example.com', '777777777', 'password9', 'ACTIVO'),
(10, 'Elena Ruiz', 'elena@example.com', '888888888', 'password10', 'ACTIVO'),
(11, 'Jorge Díaz', 'jorge@example.com', '999999999', 'password11', 'ACTIVO'),
(12, 'Carmen Jiménez', 'carmen@example.com', '000000000', 'password12', 'ACTIVO'),
(13, 'David Hernández', 'david@example.com', '121212121', 'password13', 'ACTIVO'),
(14, 'Isabel Castro', 'isabel@example.com', '131313131', 'password14', 'ACTIVO'),
(15, 'Francisco Morales', 'francisco@example.com', '141414141', 'password15', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallesventas`
--

CREATE TABLE `detallesventas` (
  `idDetalle` int(11) NOT NULL,
  `fkVenta` int(11) NOT NULL,
  `fkProducto` int(11) NOT NULL,
  `precioUnitario` varchar(10) NOT NULL DEFAULT '0.0',
  `cantProducto` int(11) NOT NULL DEFAULT 0,
  `subTotal` varchar(10) NOT NULL DEFAULT '0.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `detallesventas`
--

INSERT INTO `detallesventas` (`idDetalle`, `fkVenta`, `fkProducto`, `precioUnitario`, `cantProducto`, `subTotal`) VALUES
(1, 1, 1, '1200.00', 1, '1200.00'),
(2, 2, 2, '25.00', 2, '50.00'),
(3, 3, 3, '500.00', 1, '500.00'),
(4, 4, 4, '30.00', 3, '90.00'),
(5, 5, 5, '150.00', 1, '150.00'),
(6, 6, 6, '20.00', 2, '40.00'),
(7, 7, 7, '800.00', 1, '800.00'),
(8, 8, 8, '2.00', 5, '10.00'),
(9, 9, 9, '15.00', 1, '15.00'),
(10, 10, 10, '200.00', 2, '400.00'),
(11, 11, 11, '100.00', 1, '100.00'),
(12, 12, 12, '10.00', 3, '30.00'),
(13, 13, 13, '25.00', 2, '50.00'),
(14, 14, 14, '30.00', 1, '30.00'),
(15, 15, 15, '1000.00', 1, '1000.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `financiamientos`
--

CREATE TABLE `financiamientos` (
  `idFinanciamiento` int(11) NOT NULL,
  `descFinanciamiento` varchar(100) NOT NULL,
  `tasaFinanciamiento` varchar(5) NOT NULL DEFAULT '0.0',
  `cantCuotas` int(11) NOT NULL DEFAULT 0,
  `estatusFinanciamiento` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `financiamientos`
--

INSERT INTO `financiamientos` (`idFinanciamiento`, `descFinanciamiento`, `tasaFinanciamiento`, `cantCuotas`, `estatusFinanciamiento`) VALUES
(1, '0', '5.0', 6, 'ACTIVO'),
(2, '0', '10.0', 12, 'ACTIVO'),
(3, '0', '15.0', 24, 'ACTIVO'),
(4, '0', '20.0', 36, 'ACTIVO'),
(5, '0', '5.0', 6, 'ACTIVO'),
(6, '0', '10.0', 12, 'ACTIVO'),
(7, '0', '15.0', 24, 'ACTIVO'),
(8, '0', '20.0', 36, 'ACTIVO'),
(9, '0', '5.0', 6, 'ACTIVO'),
(10, '0', '10.0', 12, 'ACTIVO'),
(11, '0', '15.0', 24, 'ACTIVO'),
(12, '0', '20.0', 36, 'ACTIVO'),
(13, '0', '5.0', 6, 'ACTIVO'),
(14, '0', '10.0', 12, 'ACTIVO'),
(15, '0', '15.0', 24, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `listasdedeseos`
--

CREATE TABLE `listasdedeseos` (
  `idLista` int(11) NOT NULL,
  `fkCuentaUser` int(11) NOT NULL,
  `fkProducto` int(11) NOT NULL,
  `fechaRegsitro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `listasdedeseos`
--

INSERT INTO `listasdedeseos` (`idLista`, `fkCuentaUser`, `fkProducto`, `fechaRegsitro`) VALUES
(1, 1, 1, '2025-01-01 10:00:00'),
(2, 2, 2, '2025-01-02 11:00:00'),
(3, 3, 3, '2025-01-03 12:00:00'),
(4, 4, 4, '2025-01-04 13:00:00'),
(5, 5, 5, '2025-01-05 14:00:00'),
(6, 6, 6, '2025-01-06 15:00:00'),
(7, 7, 7, '2025-01-07 16:00:00'),
(8, 8, 8, '2025-01-08 17:00:00'),
(9, 9, 9, '2025-01-09 18:00:00'),
(10, 10, 10, '2025-01-10 19:00:00'),
(11, 11, 11, '2025-01-11 20:00:00'),
(12, 12, 12, '2025-01-12 21:00:00'),
(13, 13, 13, '2025-01-13 22:00:00'),
(14, 14, 14, '2025-01-14 23:00:00'),
(15, 15, 15, '2025-01-15 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

CREATE TABLE `marcas` (
  `idMarca` int(11) NOT NULL,
  `descMarca` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`idMarca`, `descMarca`) VALUES
(1, 'Samsung'),
(2, 'Nike'),
(3, 'IKEA'),
(4, 'Adidas'),
(5, 'Barbie'),
(6, 'Penguin Books'),
(7, 'Herman Miller'),
(8, 'Lays'),
(9, 'Maybelline'),
(10, 'Michelin'),
(11, 'Black & Decker'),
(12, 'Miracle-Gro'),
(13, 'Purina'),
(14, 'Centrum'),
(15, 'Apple');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos`
--

CREATE TABLE `modelos` (
  `idModelo` int(11) NOT NULL,
  `descModelo` varchar(300) NOT NULL,
  `fkMarca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `modelos`
--

INSERT INTO `modelos` (`idModelo`, `descModelo`, `fkMarca`) VALUES
(1, 'QLED 4K', 1),
(2, 'Air Max', 2),
(3, 'Ektorp', 3),
(4, 'Predator', 4),
(5, 'Dreamhouse', 5),
(6, 'Classic Novels', 6),
(7, 'Aeron Chair', 7),
(8, 'Classic', 8),
(9, 'Superstay', 9),
(10, 'Pilot Sport', 10),
(11, 'Cordless Drill', 11),
(12, 'Potting Mix', 12),
(13, 'Dog Chow', 13),
(14, 'Silver', 14),
(15, 'iPhone 15', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `idOferta` int(11) NOT NULL,
  `descOferta` varchar(200) NOT NULL,
  `descuento` varchar(5) NOT NULL,
  `inicioOferta` datetime DEFAULT current_timestamp(),
  `finOferta` datetime DEFAULT current_timestamp(),
  `estatusOferta` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`idOferta`, `descOferta`, `descuento`, `inicioOferta`, `finOferta`, `estatusOferta`) VALUES
(1, 'Oferta de TV', '10.0', '2025-01-01 00:00:00', '2025-01-31 23:59:59', 'ACTIVO'),
(2, 'Oferta de Ropa', '20.0', '2025-02-01 00:00:00', '2025-02-28 23:59:59', 'ACTIVO'),
(3, 'Oferta de Muebles', '15.0', '2025-03-01 00:00:00', '2025-03-31 23:59:59', 'ACTIVO'),
(4, 'Oferta de Deportes', '25.0', '2025-04-01 00:00:00', '2025-04-30 23:59:59', 'ACTIVO'),
(5, 'Oferta de Juguetes', '30.0', '2025-05-01 00:00:00', '2025-05-31 23:59:59', 'ACTIVO'),
(6, 'Oferta de Libros', '10.0', '2025-06-01 00:00:00', '2025-06-30 23:59:59', 'ACTIVO'),
(7, 'Oferta de Snacks', '5.0', '2025-07-01 00:00:00', '2025-07-31 23:59:59', 'ACTIVO'),
(8, 'Oferta de Belleza', '15.0', '2025-08-01 00:00:00', '2025-08-31 23:59:59', 'ACTIVO'),
(9, 'Oferta de Neumáticos', '20.0', '2025-09-01 00:00:00', '2025-09-30 23:59:59', 'ACTIVO'),
(10, 'Oferta de Herramientas', '10.0', '2025-10-01 00:00:00', '2025-10-31 23:59:59', 'ACTIVO'),
(11, 'Oferta de Jardín', '15.0', '2025-11-01 00:00:00', '2025-11-30 23:59:59', 'ACTIVO'),
(12, 'Oferta de Mascotas', '10.0', '2025-12-01 00:00:00', '2025-12-31 23:59:59', 'ACTIVO'),
(13, 'Oferta de Salud', '20.0', '2026-01-01 00:00:00', '2026-01-31 23:59:59', 'ACTIVO'),
(14, 'Oferta de Tecnología', '10.0', '2026-02-01 00:00:00', '2026-02-28 23:59:59', 'ACTIVO'),
(15, 'Oferta General', '5.0', '2026-03-01 00:00:00', '2026-03-31 23:59:59', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertasproductos`
--

CREATE TABLE `ofertasproductos` (
  `idOfertaProducto` int(11) NOT NULL,
  `fkOferta` int(11) NOT NULL,
  `fkProducto` int(11) NOT NULL,
  `descuento` varchar(5) NOT NULL DEFAULT '0.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `ofertasproductos`
--

INSERT INTO `ofertasproductos` (`idOfertaProducto`, `fkOferta`, `fkProducto`, `descuento`) VALUES
(1, 1, 1, '10.0'),
(2, 2, 2, '20.0'),
(3, 3, 3, '15.0'),
(4, 4, 4, '25.0'),
(5, 5, 5, '30.0'),
(6, 6, 6, '10.0'),
(7, 7, 8, '5.0'),
(8, 8, 9, '15.0'),
(9, 9, 10, '20.0'),
(10, 10, 11, '10.0'),
(11, 11, 12, '15.0'),
(12, 12, 13, '10.0'),
(13, 13, 14, '20.0'),
(14, 14, 15, '10.0'),
(15, 15, 1, '5.0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idProducto` int(11) NOT NULL,
  `nombreProducto` varchar(200) NOT NULL,
  `descProducto` varchar(1000) DEFAULT NULL,
  `precio` varchar(10) NOT NULL DEFAULT '0.0',
  `cantInventario` int(11) NOT NULL DEFAULT 0,
  `fkModelo` int(11) NOT NULL,
  `fkSubCategoria` int(11) NOT NULL,
  `estatus` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProducto`, `nombreProducto`, `descProducto`, `precio`, `cantInventario`, `fkModelo`, `fkSubCategoria`, `estatus`) VALUES
(1, 'TV Samsung 55\"', 'Televisor QLED 4K', '1200.00', 10, 1, 1, 'ACTIVO'),
(2, 'Camiseta Nike Air', 'Camiseta deportiva', '25.00', 50, 2, 2, 'ACTIVO'),
(3, 'Sofá Ektorp', 'Sofá de 3 plazas', '500.00', 5, 3, 3, 'ACTIVO'),
(4, 'Balón Adidas Predator', 'Balón de fútbol', '30.00', 20, 4, 4, 'ACTIVO'),
(5, 'Casa de Muñecas Barbie', 'Casa de juguete', '150.00', 15, 5, 5, 'ACTIVO'),
(6, 'Novela Clásica', 'Colección de novelas', '20.00', 30, 6, 6, 'ACTIVO'),
(7, 'Silla Aeron', 'Silla ergonómica', '800.00', 8, 7, 7, 'ACTIVO'),
(8, 'Papas Lays', 'Snack de papas fritas', '2.00', 100, 8, 8, 'ACTIVO'),
(9, 'Base Maybelline', 'Base de maquillaje', '15.00', 40, 9, 9, 'ACTIVO'),
(10, 'Neumático Michelin', 'Neumático para auto', '200.00', 12, 10, 10, 'ACTIVO'),
(11, 'Taladro Black & Decker', 'Taladro inalámbrico', '100.00', 25, 11, 11, 'ACTIVO'),
(12, 'Tierra para plantas', 'Sustrato para jardín', '10.00', 50, 12, 12, 'ACTIVO'),
(13, 'Comida para perros', 'Alimento para mascotas', '25.00', 60, 13, 13, 'ACTIVO'),
(14, 'Vitaminas Centrum', 'Suplemento vitamínico', '30.00', 40, 14, 14, 'ACTIVO'),
(15, 'iPhone 15', 'Smartphone de última generación', '1000.00', 20, 15, 15, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosimagenes`
--

CREATE TABLE `productosimagenes` (
  `idImagen` int(11) NOT NULL,
  `descImagen` varchar(500) DEFAULT NULL,
  `imagen` text NOT NULL,
  `miniatura` tinyint(1) DEFAULT NULL,
  `principal` tinyint(1) DEFAULT NULL,
  `fkProducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `productosimagenes`
--

INSERT INTO `productosimagenes` (`idImagen`, `descImagen`, `imagen`, `miniatura`, `principal`, `fkProducto`) VALUES
(5, 'TV', 'https://www.bing.com/images/search?view=detailV2&ccid=6hRXfznA&id=F691D3F0642EB178CE3FF349D316A27749FA2E73&thid=OIP.6hRXfznATVjlOQXTjJtBsgHaHa&mediaurl=https%3a%2f%2fwww.compraderas.com.bo%2fwp-content%2fuploads%2f2020%2f02%2fsamsung-smart-tv-55-uhd-4k.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.ea14577f39c04d58e53905d38c9b41b2%3frik%3dcy76SXeiFtNJ8w%26pid%3dImgRaw%26r%3d0&exph=800&expw=800&q=TV+Samsung+55&simid=608019807967642174&FORM=IRPRST&ck=BDEC1907D851B8BA487E2BE53C8684B9&selectedIndex=0&itb=0', 0, 1, 1),
(6, 'SANSAUM', 'https://www.bing.com/images/search?view=detailV2&ccid=NvvSdNkP&id=15C4A43F863623BD11AEC281A97B2FC9EB518BF0&thid=OIP.NvvSdNkPhDM_0CyvfJZqagHaHa&mediaurl=https%3a%2f%2ffulltec.com.bo%2fmedios%2f2022%2f03%2fsmart-tv-samsung-55-uhd-un55au7000-smart-tv-samsung-55-uhd-un55au7000.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.36fbd274d90f84333fd02caf7c966a6a%3frik%3d8ItR68kve6mBwg%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1200&q=TV+Samsung+55&simid=608055954373610715&FORM=IRPRST&ck=BEFAEFAFFA60FDFFF0CCA0E4904B505D&selectedIndex=3&itb=0', 0, 1, 1),
(7, 'Camiseta naike air', 'https://www.bing.com/images/search?view=detailV2&ccid=u8rtkip8&id=6F560E02DF632032971B0279BADB6176F2010A05&thid=OIP.u8rtkip8D91TM5H96vhH2gHaJQ&mediaurl=https%3a%2f%2fwww.ekinsport.com%2fmedia%2fcatalog%2fproduct%2ff%2fn%2ffn7704-410_t-shirt-a-motif-nike-air-bleu-marine-pour-homme-fn7704-410_01_2.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.bbcaed922a7c0fdd533391fdeaf847da%3frik%3dBQoB8nZh27p5Ag%26pid%3dImgRaw%26r%3d0&exph=1000&expw=800&q=camiseta+nike+air&simid=608020920386796233&FORM=IRPRST&ck=E5FC8DE684A0B6281E80C98FD89DD322&selectedIndex=10&itb=0', 0, 1, 2),
(8, 'Camiseta nike air', 'https://www.bing.com/images/search?view=detailV2&ccid=Qt3zpjt%2b&id=8C57CE9796842E1D3E2796847AB73DA31EECF3D2&thid=OIP.Qt3zpjt-iiPnk2_Nm9m8QwHaHa&mediaurl=https%3a%2f%2fwww.tradeinn.com%2ff%2f13742%2f137420868%2fnike-sportswear-air-max-90-clouds-short-sleeve-t-shirt.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.42ddf3a63b7e8a23e7936fcd9bd9bc43%3frik%3d0vPsHqM9t3qElg%26pid%3dImgRaw%26r%3d0&exph=1000&expw=1000&q=camiseta+nike+air&simid=608037447392769057&FORM=IRPRST&ck=60ED52D340C83801914ECFFE70B29BB6&selectedIndex=18&itb=0', 0, 1, 2),
(9, 'Sofá Ektorp 1', 'https://www.bing.com/images/search?view=detailV2&ccid=M2C7Gm4l&id=BB4C03C9029D51E302553D400C5AC4E6F94F6C3D&thid=OIP.M2C7Gm4lVa1qy0HWRfJ70AHaHa&mediaurl=https%3a%2f%2fwww.ikea.cn%2fcn%2fen%2fimages%2fproducts%2fektorp-3-seat-sofa-tallmyra-beige__0779512_pe759553_s5.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3360bb1a6e2555ad6acb41d645f27bd0%3frik%3dPWxP%252bebEWgxAPQ%26pid%3dImgRaw%26r%3d0&exph=1400&expw=1400&q=Sof%c3%a1+Ektorp&simid=608002250166311068&FORM=IRPRST&ck=31ED3431B7F2D6083AE010A817A74770&selectedIndex=0&itb=0', 0, 1, 3),
(10, 'Sofá Ektorp 2', 'https://www.bing.com/images/search?view=detailV2&ccid=M2C7Gm4l&id=BB4C03C9029D51E302553D400C5AC4E6F94F6C3D&thid=OIP.M2C7Gm4lVa1qy0HWRfJ70AHaHa&mediaurl=https%3a%2f%2fwww.ikea.cn%2fcn%2fen%2fimages%2fproducts%2fektorp-3-seat-sofa-tallmyra-beige__0779512_pe759553_s5.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3360bb1a6e2555ad6acb41d645f27bd0%3frik%3dPWxP%252bebEWgxAPQ%26pid%3dImgRaw%26r%3d0&exph=1400&expw=1400&q=Sof%c3%a1+Ektorp&simid=608002250166311068&FORM=IRPRST&ck=31ED3431B7F2D6083AE010A817A74770&selectedIndex=0&itb=0', 0, 1, 3),
(11, 'Balón Adidas Predator', 'https://www.bing.com/images/search?view=detailV2&ccid=cEKDgWws&id=F52069D6AE5086BA1D7C25276F9E51A4440D3382&thid=OIP.cEKDgWwsCElbBnAQSCpokQHaHa&mediaurl=https%3a%2f%2fwww.tradeinn.com%2ff%2f13993%2f139932817%2fadidas-balon-futbol-predator.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.704283816c2c08495b067010482a6891%3frik%3dgjMNRKRRnm8nJQ%26pid%3dImgRaw%26r%3d0&exph=1000&expw=1000&q=Bal%c3%b3n+Adidas+Predator&simid=608041609229262553&FORM=IRPRST&ck=F8298736B24B7AEC18F98BA96F29D623&selectedIndex=0&itb=0', 0, 1, 4),
(12, 'Balón Adidas Predator', 'https://www.bing.com/images/search?view=detailV2&ccid=D4MV9T5O&id=41395555680EE6E586A904730069A01F4E8208F1&thid=OIP.D4MV9T5OBHunNgL9SW-WCAHaHa&mediaurl=https%3a%2f%2fwww.futbolemotion.com%2fimagesarticulos%2f140198%2fgrandes%2fbalon-adidas-predator-training-blackactive-redwhite-0.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.0f8315f53e4e047ba73602fd496f9608%3frik%3d8QiCTh%252bgaQBzBA%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1200&q=Bal%c3%b3n+Adidas+Predator&simid=608027955513209720&FORM=IRPRST&ck=4A63CA2CF05640B5F6607E8991B58F55&selectedIndex=2&itb=0', 0, 1, 4),
(13, 'Casa de Muñecas Barbie', 'https://www.bing.com/images/search?view=detailV2&ccid=o%2fJ6tSYp&id=CCF720E631F097545686BBEE3F44CFE614463ED4&thid=OIP.o_J6tSYpIPZTdH_k2JkUlgHaH-&mediaurl=https%3a%2f%2fwww.dontwasteyourmoney.com%2fwp-content%2fuploads%2f2021%2f03%2f%e2%80%8bbarbie-ultimate-dreamhouse-doll-house.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.a3f27ab5262920f653747fe4d8991496%3frik%3d1D5GFObPRD%252fuuw%26pid%3dImgRaw%26r%3d0&exph=1500&expw=1394&q=Casa+de+Mu%c3%b1ecas+Barbie&simid=608039899820065411&FORM=IRPRST&ck=1F113378B921372B5F457AE54329AC8D&selectedIndex=0&itb=0', 0, 1, 5),
(14, 'Casa de Muñecas Barbie', 'https://www.bing.com/images/search?view=detailV2&ccid=fK%2fwPVNx&id=E97E42F13EA73A572387368DC2FA17327CD1A79A&thid=OIP.fK_wPVNx7JXFSZ69SCLvkgAAAA&mediaurl=https%3a%2f%2fhttp2.mlstatic.com%2fcasa-de-munecas-barbie-malibu-dreamhouse-playset-color-roja-D_NQ_NP_20730-MLM20197149979_112014-F.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.7caff03d5371ec95c5499ebd4822ef92%3frik%3dmqfRfDIX%252bsKNNg%26pid%3dImgRaw%26r%3d0&exph=476&expw=474&q=Casa+de+Mu%c3%b1ecas+Barbie&simid=608031322763174602&FORM=IRPRST&ck=409452F94F8F97BAE82BEA0DA507F47B&selectedIndex=1&itb=0', 0, 1, 5),
(15, 'Novela Clásica', 'https://www.bing.com/images/search?view=detailV2&ccid=rtwx0gl%2f&id=83B4C5E150B1DCF5A2740976F9BC1048207513CA&thid=OIP.rtwx0gl_wawpqmzaKtD8dAAAAA&mediaurl=https%3a%2f%2fi.blogs.es%2f408869%2fmujer%2f450_1000.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.aedc31d2097fc1ac29aa6cda2ad0fc74%3frik%3dyhN1IEgQvPl2CQ%26pid%3dImgRaw%26r%3d0&exph=625&expw=450&q=Novela+Cl%c3%a1sica&simid=608056040298472085&FORM=IRPRST&ck=FBFB4F6FCFF718082AD9F254611D058A&selectedIndex=0&itb=0', 0, 1, 6),
(16, 'Novela Clásica', 'https://www.bing.com/images/search?view=detailV2&ccid=kZuNI%2foR&id=6932AB6FAA175D06C4729C5702312F4B1D7D3D69&thid=OIP.kZuNI_oRwftIkUrvAgljGgHaLM&mediaurl=https%3a%2f%2fletrasylatte.com%2fwp-content%2fuploads%2f2019%2f04%2flos-miserables-victor-hugo-768x1161.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.919b8d23fa11c1fb48914aef0209631a%3frik%3daT19HUsvMQJXnA%26pid%3dImgRaw%26r%3d0&exph=1161&expw=768&q=Novela+Cl%c3%a1sica&simid=607990615094947515&FORM=IRPRST&ck=ED43042048085C1BAFABEB3B9EB33AF9&selectedIndex=1&itb=0', 0, 1, 6),
(17, 'Silla Aeron', 'https://www.bing.com/images/search?view=detailV2&ccid=mr3lCiQ0&id=5592CA1C8FBF9FD8DAB1713068B59B02DB39D6D3&thid=OIP.mr3lCiQ0PfhZs8hqOWSDowHaHa&mediaurl=https%3a%2f%2fwww.hermanmiller.com%2fcontent%2fdam%2fhmicom%2fpage_assets%2fproducts%2faeron_chair%2f202106%2fit_prd_ovw_aeron_chair_03.gif.rendition.1600.1600.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.9abde50a24343df859b3c86a396483a3%3frik%3d09Y52wKbtWgwcQ%26pid%3dImgRaw%26r%3d0&exph=1600&expw=1600&q=Silla+Aeron&simid=608003719004899434&FORM=IRPRST&ck=9A02D90BB606BF3AD43EA6999BB659B5&selectedIndex=0&itb=0', 0, 1, 7),
(18, 'Silla Aeron', 'https://www.bing.com/images/search?view=detailV2&ccid=mr3lCiQ0&id=5592CA1C8FBF9FD8DAB1713068B59B02DB39D6D3&thid=OIP.mr3lCiQ0PfhZs8hqOWSDowHaHa&mediaurl=https%3a%2f%2fwww.hermanmiller.com%2fcontent%2fdam%2fhmicom%2fpage_assets%2fproducts%2faeron_chair%2f202106%2fit_prd_ovw_aeron_chair_03.gif.rendition.1600.1600.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.9abde50a24343df859b3c86a396483a3%3frik%3d09Y52wKbtWgwcQ%26pid%3dImgRaw%26r%3d0&exph=1600&expw=1600&q=Silla+Aeron&simid=608003719004899434&FORM=IRPRST&ck=9A02D90BB606BF3AD43EA6999BB659B5&selectedIndex=0&itb=0', 0, 1, 7),
(19, 'Papas Lays', 'https://www.bing.com/images/search?view=detailV2&ccid=Sdl8yYWh&id=E14A0AD5918A07BB5926430950237422FA1AC216&thid=OIP.Sdl8yYWhoIDfkxEbokSETwHaKY&mediaurl=https%3a%2f%2ff.fcdn.app%2fimgs%2f4ef3de%2fwww.elclon.com.uy%2fclonuy%2fc411%2foriginal%2fcatalogo%2f946485-1%2f1920-1200%2fpapas-lays-clasicas-250-grs-papas-lays-clasicas-250-grs.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.49d97cc985a1a080df93111ba244844f%3frik%3dFsIa%252biJ0I1AJQw%26pid%3dImgRaw%26r%3d0&exph=1200&expw=856&q=Papas+Lays&simid=607989378139555428&FORM=IRPRST&ck=E131101A7EE23B3175FC68507A5A3E06&selectedIndex=0&itb=0', 0, 1, 8),
(20, 'Papas Lays', 'https://www.bing.com/images/search?view=detailV2&ccid=FHDwHX1S&id=8DD1FDD93359F13E692B6DE4257DC69A7B0F0DB5&thid=OIP.FHDwHX1SOPAeAkI8ZDq7PwHaHy&mediaurl=https%3a%2f%2fstatic.condisline.com%2fresize_1280x1347%2fimages%2fcatalog%2flarge%2f114603.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.1470f01d7d5238f01e02423c643abb3f%3frik%3dtQ0Pe5rGfSXkbQ%26pid%3dImgRaw%26r%3d0&exph=1347&expw=1280&q=Papas+Lays&simid=608054395346687349&FORM=IRPRST&ck=08E4AF2856E3BD8C681EC63D152E5CC4&selectedIndex=7&itb=0', 0, 1, 8),
(21, 'Base Maybelline', 'https://www.bing.com/images/search?view=detailV2&ccid=rrVb3rF7&id=4CCC2BF05CD1BBAECA1B551961E80724532C1478&thid=OIP.rrVb3rF7F4kEK4AS5hPanAHaHa&mediaurl=https%3a%2f%2fwww.sanborns.com.mx%2fimagenes-sanborns-ii%2f1200%2f41554541465_5.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.aeb55bdeb17b1789042b8012e613da9c%3frik%3deBQsUyQH6GEZVQ%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1200&q=Base+Maybelline&simid=608050405346128434&FORM=IRPRST&ck=FBA99370B1FF8F9A3D3D57936719D229&selectedIndex=0&itb=0', 0, 1, 9),
(22, 'Base Maybelline', 'https://www.bing.com/images/search?view=detailV2&ccid=xUcLZnH%2f&id=DDC71F501CD770941359D846D800C0534ABC2D78&thid=OIP.xUcLZnH_NwFWv-kBSZI5RQHaHa&mediaurl=https%3a%2f%2fd26lpennugtm8s.cloudfront.net%2fstores%2f938%2f709%2fproducts%2fphoto_15759492410321-9b3d198f3e22f658af15759501938067-1024-1024.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.c5470b6671ff370156bfe90149923945%3frik%3deC28SlPAANhG2A%26pid%3dImgRaw%26r%3d0&exph=1024&expw=1024&q=Base+Maybelline&simid=608017724898227271&FORM=IRPRST&ck=60CE49F837BA1CB4B62D28E9725B4690&selectedIndex=1&itb=0', 0, 1, 9),
(23, 'Neumático Michelin', 'https://www.bing.com/images/search?view=detailV2&ccid=rwQI8kON&id=54673D022FDC3D6C5F5DBD8FFAF5FAB1617D2574&thid=OIP.rwQI8kONn2goQ7XSQmqRUAHaEK&mediaurl=https%3a%2f%2fimg.zsmotor.cl%2fwp-content%2fuploads%2f2022%2f09%2fMICHELIN-Primacy-4_9-edited.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.af0408f2438d9f682843b5d2426a9150%3frik%3ddCV9YbH69fqPvQ%26pid%3dImgRaw%26r%3d0&exph=1124&expw=2000&q=Neum%c3%a1tico+Michelin&simid=608038018638372493&FORM=IRPRST&ck=BFF5DE3CB74BDFC264744750CBC69EC6&selectedIndex=0&itb=0', 0, 1, 10),
(24, 'Neumático Michelin', 'https://www.bing.com/images/search?view=detailV2&ccid=7CpwN9D%2b&id=4046975799A3430050FE58597F0311C40FE5E60F&thid=OIP.7CpwN9D-2E_e1InjY24t9QHaIS&mediaurl=https%3a%2f%2fwww.fullneumaticos.cl%2fimagenes%2fneumaticos%2fM777386.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.ec2a7037d0fed84fded489e3636e2df5%3frik%3dD%252bblD8QRA39ZWA%26pid%3dImgRaw%26r%3d0&exph=3088&expw=2760&q=Neum%c3%a1tico+Michelin&simid=608004814187079245&FORM=IRPRST&ck=8C12A5356942FE1488CB792BB4739B70&selectedIndex=1&itb=0', 0, 1, 10),
(25, 'taladro Black & Decker', 'https://www.bing.com/images/search?view=detailV2&ccid=Qm%2b7O9lT&id=13785C2A8243E7FAA2AE00EAE9AF6C836FAB95C8&thid=OIP.Qm-7O9lTRCV2Ba6B_hFrWQHaHa&mediaurl=https%3a%2f%2fcdn.homedepot.com.mx%2fproductos%2f143766%2f143766-za1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.426fbb3bd95344257605ae81fe116b59%3frik%3dyJWrb4Nsr%252bnqAA%26pid%3dImgRaw%26r%3d0&exph=1000&expw=1000&q=+taladro+Black+%26+Decker&simid=608031468790366239&FORM=IRPRST&ck=6E9662A6660E691ED643EC9456F7B3CD&selectedIndex=0&itb=0', 0, 1, 11),
(26, 'taladro Black & Decker', 'https://www.bing.com/images/search?view=detailV2&ccid=Ew4xni5c&id=A454526477ACA662CED389EF522987B91C81BB23&thid=OIP.Ew4xni5ck_oNTnLrcjf32wHaHa&mediaurl=https%3a%2f%2fhttp2.mlstatic.com%2ftaladro-destornillador-inalambrico-black-decker-20v-litio-D_NQ_NP_615759-MLM25692453829_062017-F.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.130e319e2e5c93fa0d4e72eb7237f7db%3frik%3dI7uBHLmHKVLviQ%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1200&q=+taladro+Black+%26+Decker&simid=607998410425516583&FORM=IRPRST&ck=5EB5FC77DB7632C23BEB513ECE330CA4&selectedIndex=2&itb=0', 0, 1, 11),
(27, 'Tierra para plantas', 'https://www.bing.com/images/search?view=detailV2&ccid=y%2bV1rV%2bT&id=67ED531AEC07A15EA79B3A4082866D799F03B825&thid=OIP.y-V1rV-TdhcXlHJVcIvmAQHaEK&mediaurl=https%3a%2f%2fblog.homedepot.com.mx%2fwp-content%2fuploads%2f2019%2f10%2fimage-2017-12-14-1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.cbe575ad5f93761717947255708be601%3frik%3dJbgDn3lthoJAOg%26pid%3dImgRaw%26r%3d0&exph=720&expw=1280&q=Tierra+para+plantas&simid=608048197713738267&FORM=IRPRST&ck=D4898350266FBC38CF35E0C117D2045C&selectedIndex=0&itb=0', 0, 1, 12),
(28, 'Tierra para plantas', 'https://www.bing.com/images/search?view=detailV2&ccid=A2AcEpWo&id=65568E6A7F9C0BA4839C0218F5A0977CBF040C4E&thid=OIP.A2AcEpWoZZbJGIzdOUZ7QQHaEK&mediaurl=https%3a%2f%2fblog.homedepot.com.mx%2fwp-content%2fuploads%2f2019%2f10%2ftipos_de_tierra_1280x720.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.03601c1295a86596c9188cdd39467b41%3frik%3dTgwEv3yXoPUYAg%26pid%3dImgRaw%26r%3d0&exph=720&expw=1280&q=Tierra+para+plantas&simid=608016552375496258&FORM=IRPRST&ck=57BD99BAD35905364965886DB100F325&selectedIndex=1&itb=0', 0, 1, 12),
(29, 'Comida para perros', 'https://www.bing.com/images/search?view=detailV2&ccid=UEZGrj1o&id=DC834783FE7482F428A7E3EFC188C9DA080BB655&thid=OIP.UEZGrj1o8c79dA4g3FwysAHaHT&mediaurl=https%3a%2f%2fmlstaticquic-a.akamaihd.net%2fcomida-de-perro-dogui-recetas-caseras-24-kg-envio-regalo-D_NQ_NP_749443-MLU31430144446_072019-F.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.504646ae3d68f1cefd740e20dc5c32b0%3frik%3dVbYLCNrJiMHv4w%26pid%3dImgRaw%26r%3d0&exph=1183&expw=1200&q=Comida+para+perros&simid=607999969505538790&FORM=IRPRST&ck=05CC44FF5DBC2A4B1238E5EB41184337&selectedIndex=0&itb=0', 0, 1, 13),
(30, 'Comida para perros', 'https://www.bing.com/images/search?view=detailV2&ccid=S81A2RdH&id=E453AAE79A1A5959911EA6A90B1C0E8528401A50&thid=OIP.S81A2RdHX776a2mUyKC53QHaFj&mediaurl=https%3a%2f%2fwww.somosmamas.com.ar%2fwp-content%2fuploads%2f2020%2f06%2fcomida-industrial-para-perros.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4bcd40d917475fbefa6b6994c8a0b9dd%3frik%3dUBpAKIUOHAuppg%26pid%3dImgRaw%26r%3d0&exph=768&expw=1024&q=Comida+para+perros&simid=608038778824049109&FORM=IRPRST&ck=CA00DFB0C5E28FFC5757F637016A282D&selectedIndex=1&itb=0', 0, 1, 13),
(31, 'Vitaminas Centrum', 'https://www.bing.com/images/search?view=detailV2&ccid=h6ObLgA0&id=386551B7B2BD9843E24E69651737CD858447024B&thid=OIP.h6ObLgA07_WW3PnVYYWRvgHaKQ&mediaurl=https%3a%2f%2fi5.walmartimages.com%2fseo%2fCentrum-Silver-Multivitamins-Women-Over-50-Multivitamin-Multimineral-Supplement-Vitamin-D3-B-Vitamins-Calcium-Antioxidants-275-Count_a3d00464-f812-4ecb-81f0-72447044615f.edef2504c90fa7c2a99c507699c483ba.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.87a39b2e0034eff596dcf9d5618591be%3frik%3dSwJHhIXNNxdlaQ%26pid%3dImgRaw%26r%3d0&exph=2768&expw=2000&q=Vitaminas+Centrum&simid=608021796515294843&FORM=IRPRST&ck=AF093A550B6E6AE29584F2BB44059703&selectedIndex=0&itb=0', 0, 1, 14),
(32, 'Vitaminas Centrum', 'https://www.bing.com/images/search?view=detailV2&ccid=QA35Yp19&id=A7B518E0E5B2044A31BD32CE6F987DFF947CA571&thid=OIP.QA35Yp19LH-ewwuwTAA7gwHaKb&mediaurl=https%3a%2f%2fi5.walmartimages.com%2fasr%2fdc0514bc-c07f-4327-93e1-cf61efa73347.6efe49bf7a7be0f0eddd20f968097b63.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.400df9629d7d2c7f9ec30bb04c003b83%3frik%3dcaV8lP99mG%252fOMg%26pid%3dImgRaw%26r%3d0&exph=1500&expw=1065&q=Vitaminas+Centrum&simid=608043696592012300&FORM=IRPRST&ck=5C4833B3C6922DF8653DD4DE9C3778BE&selectedIndex=1&itb=0', 0, 1, 14),
(33, 'iPhone 15', 'https://www.bing.com/images/search?view=detailV2&ccid=DTS4UDbQ&id=1C2E22389DEEB0DF4D7590D0585B925F728A69DA&thid=OIP.DTS4UDbQCvrv9egPjNSlMgHaKX&mediaurl=https%3a%2f%2fimgs.hipertextual.com%2fwp-content%2fuploads%2f2023%2f09%2fiphone-15-vertical-1500x2099.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.0d34b85036d00afaeff5e80f8cd4a532%3frik%3d2mmKcl%252bSW1jQkA%26pid%3dImgRaw%26r%3d0&exph=2099&expw=1500&q=iPhone+15&simid=608022281850130569&FORM=IRPRST&ck=BC10BAF29E4F7A609D154117CAA86897&selectedIndex=0&itb=0', 0, 1, 15),
(34, 'iPhone 15', 'https://www.bing.com/images/search?view=detailV2&ccid=uFQR4EtC&id=F68B2B3E73B8790BC0E9057A243B568436751DEC&thid=OIP.uFQR4EtCNJrE7TcfA4zluQHaEK&mediaurl=https%3a%2f%2fresizer.iproimg.com%2funsafe%2f1080x608%2ffilters%3aformat(webp)%2fhttps%3a%2f%2fassets.iprofesional.com%2fassets%2fjpeg%2f2023%2f08%2f558026_landscape.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.b85411e04b42349ac4ed371f038ce5b9%3frik%3d7B11NoRWOyR6BQ%26pid%3dImgRaw%26r%3d0&exph=608&expw=1080&q=iPhone+15&simid=608044693038255799&FORM=IRPRST&ck=D956E34683DF1648CFDF283D41A81601&selectedIndex=4&itb=0', 0, 1, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategorias`
--

CREATE TABLE `subcategorias` (
  `idSubCategoria` int(11) NOT NULL,
  `descSubCategoria` varchar(200) NOT NULL,
  `fkCategoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `subcategorias`
--

INSERT INTO `subcategorias` (`idSubCategoria`, `descSubCategoria`, `fkCategoria`) VALUES
(1, 'Televisores', 1),
(2, 'Camisetas', 2),
(3, 'Sofás', 3),
(4, 'Balones', 4),
(5, 'Muñecas', 5),
(6, 'Novelas', 6),
(7, 'Sillas', 7),
(8, 'Snacks', 8),
(9, 'Maquillaje', 9),
(10, 'Neumáticos', 10),
(11, 'Taladros', 11),
(12, 'Plantas', 12),
(13, 'Comida para perros', 13),
(14, 'Vitaminas', 14),
(15, 'Smartphones', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiendas`
--

CREATE TABLE `tiendas` (
  `idTienda` int(11) NOT NULL,
  `descTienda` varchar(100) NOT NULL,
  `direccionTienda` varchar(1000) DEFAULT NULL,
  `tlfTienda` varchar(100) DEFAULT NULL,
  `encargado` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estatus` varchar(10) NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `tiendas`
--

INSERT INTO `tiendas` (`idTienda`, `descTienda`, `direccionTienda`, `tlfTienda`, `encargado`, `email`, `estatus`) VALUES
(1, 'Tienda Central', 'Calle Principal 123', '123456789', 'Juan Pérez', 'juan@tienda.com', 'ACTIVO'),
(2, 'Tienda Norte', 'Avenida Norte 456', '987654321', 'María López', 'maria@tienda.com', 'ACTIVO'),
(3, 'Tienda Sur', 'Calle Sur 789', '555555555', 'Carlos Gómez', 'carlos@tienda.com', 'ACTIVO'),
(4, 'Tienda Este', 'Avenida Este 101', '111111111', 'Ana Martínez', 'ana@tienda.com', 'ACTIVO'),
(5, 'Tienda Oeste', 'Calle Oeste 202', '222222222', 'Luis Rodríguez', 'luis@tienda.com', 'ACTIVO'),
(6, 'Tienda Centro', 'Avenida Centro 303', '333333333', 'Sofía García', 'sofia@tienda.com', 'ACTIVO'),
(7, 'Tienda Plaza', 'Calle Plaza 404', '444444444', 'Pedro Sánchez', 'pedro@tienda.com', 'ACTIVO'),
(8, 'Tienda Mall', 'Avenida Mall 505', '666666666', 'Laura Fernández', 'laura@tienda.com', 'ACTIVO'),
(9, 'Tienda City', 'Calle City 606', '777777777', 'Miguel Torres', 'miguel@tienda.com', 'ACTIVO'),
(10, 'Tienda Market', 'Avenida Market 707', '888888888', 'Elena Ruiz', 'elena@tienda.com', 'ACTIVO'),
(11, 'Tienda Express', 'Calle Express 808', '999999999', 'Jorge Díaz', 'jorge@tienda.com', 'ACTIVO'),
(12, 'Tienda Mega', 'Avenida Mega 909', '000000000', 'Carmen Jiménez', 'carmen@tienda.com', 'ACTIVO'),
(13, 'Tienda Super', 'Calle Super 1010', '121212121', 'David Hernández', 'david@tienda.com', 'ACTIVO'),
(14, 'Tienda Hyper', 'Avenida Hyper 1111', '131313131', 'Isabel Castro', 'isabel@tienda.com', 'ACTIVO'),
(15, 'Tienda Ultra', 'Calle Ultra 1212', '141414141', 'Francisco Morales', 'francisco@tienda.com', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiendasproductos`
--

CREATE TABLE `tiendasproductos` (
  `idTiendaProducto` int(11) NOT NULL,
  `fkTienda` int(11) NOT NULL,
  `fkProducto` int(11) NOT NULL,
  `canttProducto` int(11) DEFAULT 0,
  `precioProducto` varchar(10) DEFAULT '0.0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `tiendasproductos`
--

INSERT INTO `tiendasproductos` (`idTiendaProducto`, `fkTienda`, `fkProducto`, `canttProducto`, `precioProducto`) VALUES
(1, 1, 1, 5, '1200.00'),
(2, 2, 2, 10, '25.00'),
(3, 3, 3, 2, '500.00'),
(4, 4, 4, 5, '30.00'),
(5, 5, 5, 3, '150.00'),
(6, 6, 6, 8, '20.00'),
(7, 7, 7, 1, '800.00'),
(8, 8, 8, 20, '2.00'),
(9, 9, 9, 10, '15.00'),
(10, 10, 10, 4, '200.00'),
(11, 11, 11, 6, '100.00'),
(12, 12, 12, 15, '10.00'),
(13, 13, 13, 12, '25.00'),
(14, 14, 14, 8, '30.00'),
(15, 15, 15, 5, '1000.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int(11) NOT NULL,
  `fechaVenta` datetime NOT NULL DEFAULT current_timestamp(),
  `fkCuentaUser` int(11) NOT NULL,
  `subTotalVenta` varchar(10) DEFAULT '0.0',
  `montoTotalVenta` varchar(10) NOT NULL DEFAULT '0.0',
  `fkFinanciamiento` int(11) DEFAULT NULL,
  `porcImpuesto` varchar(5) DEFAULT '0.0',
  `montoImpuesto` varchar(10) DEFAULT '0.0',
  `estatusVenta` varchar(10) DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `fechaVenta`, `fkCuentaUser`, `subTotalVenta`, `montoTotalVenta`, `fkFinanciamiento`, `porcImpuesto`, `montoImpuesto`, `estatusVenta`) VALUES
(1, '2025-01-01 10:00:00', 1, '1200.00', '1200.00', NULL, '0.0', '0.0', 'ACTIVO'),
(2, '2025-01-02 11:00:00', 2, '50.00', '50.00', NULL, '0.0', '0.0', 'ACTIVO'),
(3, '2025-01-03 12:00:00', 3, '500.00', '500.00', NULL, '0.0', '0.0', 'ACTIVO'),
(4, '2025-01-04 13:00:00', 4, '90.00', '90.00', NULL, '0.0', '0.0', 'ACTIVO'),
(5, '2025-01-05 14:00:00', 5, '150.00', '150.00', NULL, '0.0', '0.0', 'ACTIVO'),
(6, '2025-01-06 15:00:00', 6, '40.00', '40.00', NULL, '0.0', '0.0', 'ACTIVO'),
(7, '2025-01-07 16:00:00', 7, '800.00', '800.00', NULL, '0.0', '0.0', 'ACTIVO'),
(8, '2025-01-08 17:00:00', 8, '10.00', '10.00', NULL, '0.0', '0.0', 'ACTIVO'),
(9, '2025-01-09 18:00:00', 9, '15.00', '15.00', NULL, '0.0', '0.0', 'ACTIVO'),
(10, '2025-01-10 19:00:00', 10, '400.00', '400.00', NULL, '0.0', '0.0', 'ACTIVO'),
(11, '2025-01-11 20:00:00', 11, '100.00', '100.00', NULL, '0.0', '0.0', 'ACTIVO'),
(12, '2025-01-12 21:00:00', 12, '30.00', '30.00', NULL, '0.0', '0.0', 'ACTIVO'),
(13, '2025-01-13 22:00:00', 13, '50.00', '50.00', NULL, '0.0', '0.0', 'ACTIVO'),
(14, '2025-01-14 23:00:00', 14, '30.00', '30.00', NULL, '0.0', '0.0', 'ACTIVO'),
(15, '2025-01-15 00:00:00', 15, '1000.00', '1000.00', NULL, '0.0', '0.0', 'ACTIVO');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`idCarrito`),
  ADD KEY `fkProducto` (`fkProducto`),
  ADD KEY `fkCuentaUser` (`fkCuentaUser`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`idCategoria`);

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`idContacto`);

--
-- Indices de la tabla `cuentasusuarios`
--
ALTER TABLE `cuentasusuarios`
  ADD PRIMARY KEY (`idCuentaUser`),
  ADD UNIQUE KEY `emailUser` (`emailUser`);

--
-- Indices de la tabla `detallesventas`
--
ALTER TABLE `detallesventas`
  ADD PRIMARY KEY (`idDetalle`),
  ADD KEY `fkProducto` (`fkProducto`),
  ADD KEY `fkVenta` (`fkVenta`);

--
-- Indices de la tabla `financiamientos`
--
ALTER TABLE `financiamientos`
  ADD PRIMARY KEY (`idFinanciamiento`);

--
-- Indices de la tabla `listasdedeseos`
--
ALTER TABLE `listasdedeseos`
  ADD PRIMARY KEY (`idLista`),
  ADD KEY `fkCuentaUser` (`fkCuentaUser`),
  ADD KEY `fkProducto` (`fkProducto`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`idMarca`);

--
-- Indices de la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD PRIMARY KEY (`idModelo`),
  ADD KEY `fkMarca` (`fkMarca`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`idOferta`);

--
-- Indices de la tabla `ofertasproductos`
--
ALTER TABLE `ofertasproductos`
  ADD PRIMARY KEY (`idOfertaProducto`),
  ADD KEY `fkOferta` (`fkOferta`),
  ADD KEY `fkProducto` (`fkProducto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idProducto`),
  ADD KEY `fkModelo` (`fkModelo`),
  ADD KEY `fkSubCategoria` (`fkSubCategoria`);

--
-- Indices de la tabla `productosimagenes`
--
ALTER TABLE `productosimagenes`
  ADD PRIMARY KEY (`idImagen`),
  ADD KEY `fkProducto` (`fkProducto`);

--
-- Indices de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD PRIMARY KEY (`idSubCategoria`),
  ADD KEY `fkCategoria` (`fkCategoria`);

--
-- Indices de la tabla `tiendas`
--
ALTER TABLE `tiendas`
  ADD PRIMARY KEY (`idTienda`);

--
-- Indices de la tabla `tiendasproductos`
--
ALTER TABLE `tiendasproductos`
  ADD PRIMARY KEY (`idTiendaProducto`),
  ADD KEY `fkTienda` (`fkTienda`),
  ADD KEY `fkProducto` (`fkProducto`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`),
  ADD KEY `fkCuentaUser` (`fkCuentaUser`),
  ADD KEY `fkFinanciamiento` (`fkFinanciamiento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `idCarrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `idContacto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `cuentasusuarios`
--
ALTER TABLE `cuentasusuarios`
  MODIFY `idCuentaUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `detallesventas`
--
ALTER TABLE `detallesventas`
  MODIFY `idDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `financiamientos`
--
ALTER TABLE `financiamientos`
  MODIFY `idFinanciamiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `listasdedeseos`
--
ALTER TABLE `listasdedeseos`
  MODIFY `idLista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `idMarca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `modelos`
--
ALTER TABLE `modelos`
  MODIFY `idModelo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `idOferta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ofertasproductos`
--
ALTER TABLE `ofertasproductos`
  MODIFY `idOfertaProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `productosimagenes`
--
ALTER TABLE `productosimagenes`
  MODIFY `idImagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  MODIFY `idSubCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tiendas`
--
ALTER TABLE `tiendas`
  MODIFY `idTienda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tiendasproductos`
--
ALTER TABLE `tiendasproductos`
  MODIFY `idTiendaProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `idVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `carritos_ibfk_2` FOREIGN KEY (`fkCuentaUser`) REFERENCES `cuentasusuarios` (`idCuentaUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `detallesventas`
--
ALTER TABLE `detallesventas`
  ADD CONSTRAINT `detallesventas_ibfk_1` FOREIGN KEY (`fkVenta`) REFERENCES `ventas` (`idVenta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detallesventas_ibfk_2` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `listasdedeseos`
--
ALTER TABLE `listasdedeseos`
  ADD CONSTRAINT `listasdedeseos_ibfk_1` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `listasdedeseos_ibfk_2` FOREIGN KEY (`fkCuentaUser`) REFERENCES `cuentasusuarios` (`idCuentaUser`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD CONSTRAINT `modelos_ibfk_1` FOREIGN KEY (`fkMarca`) REFERENCES `marcas` (`idMarca`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ofertasproductos`
--
ALTER TABLE `ofertasproductos`
  ADD CONSTRAINT `ofertasproductos_ibfk_1` FOREIGN KEY (`fkOferta`) REFERENCES `ofertas` (`idOferta`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `ofertasproductos_ibfk_2` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`fkModelo`) REFERENCES `modelos` (`idModelo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`fkSubCategoria`) REFERENCES `subcategorias` (`idSubCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `productosimagenes`
--
ALTER TABLE `productosimagenes`
  ADD CONSTRAINT `productosimagenes_ibfk_1` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD CONSTRAINT `subcategorias_ibfk_1` FOREIGN KEY (`fkCategoria`) REFERENCES `categorias` (`idCategoria`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tiendasproductos`
--
ALTER TABLE `tiendasproductos`
  ADD CONSTRAINT `tiendasproductos_ibfk_1` FOREIGN KEY (`fkProducto`) REFERENCES `productos` (`idProducto`),
  ADD CONSTRAINT `tiendasproductos_ibfk_2` FOREIGN KEY (`fkTienda`) REFERENCES `tiendas` (`idTienda`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`fkCuentaUser`) REFERENCES `cuentasusuarios` (`idCuentaUser`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
