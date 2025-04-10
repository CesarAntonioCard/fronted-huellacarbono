import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faLeaf,
  faCalculator,
  faMobileAlt,
  faPlug,
  faRecycle,
  faShoppingCart,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar/Navbar";

function Inicio() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="container mx-auto text-center text-green-950 ">
          <h1 className="text-5xl font-extrabold mb-6">
            ¿Qué es la Huella de Carbono y cómo impactan los dispositivos
            electrónicos?
          </h1>
          <p className="text-xl mb-12 sm:ml-50 sm:mr-50">
            La huella de carbono es la cantidad total de gases de efecto
            invernadero emitidos a la atmósfera como resultado de nuestras
            actividades diarias. En Cajamarca, el uso de recursos naturales y
            las actividades humanas impactan directamente el medio ambiente. Los
            dispositivos electrónicos, como computadoras, teléfonos móviles y
            electrodomésticos, también contribuyen significativamente a la
            huella de carbono.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105 shadow-xl shadow-green-900 mt-5">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-teal-500 text-5xl mb-4"
              />
              <h2 className="text-3xl font-semibold">
                Impacto Ambiental en Cajamarca
              </h2>
              <p className="mt-4 text-lg">
                En Cajamarca, la deforestación, la minería y la agricultura
                intensiva son responsables de la emisión de grandes cantidades
                de CO2. Sin embargo, cada pequeño esfuerzo puede mitigar el
                impacto ambiental.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105 shadow-xl shadow-green-900 mt-5">
              <FontAwesomeIcon
                icon={faCalculator}
                className="text-teal-500 text-5xl mb-4"
              />
              <h2 className="text-3xl font-semibold">
                Huella de Carbono por Uso de Papel
              </h2>
              <p className="mt-4 text-lg">
                El uso de papel genera emisiones de CO2 debido a la producción,
                transporte y desecho. En Cajamarca, la industria minera también
                consume grandes cantidades de papel. ¡Reciclar puede reducir
                significativamente las emisiones!
              </p>
              <Link to="/simulador">
                <button className="mt-6 px-6 py-3 bg-teal-600 text-green-950 text-lg rounded-full hover:bg-teal-700 transition duration-300">
                  Calcular Huella de Carbono
                </button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105 shadow-xl shadow-green-900 mt-5">
              <FontAwesomeIcon
                icon={faMobileAlt}
                className="text-teal-500 text-5xl mb-4"
              />
              <h2 className="text-3xl font-semibold">
                Dispositivos Electrónicos y su Huella de Carbono
              </h2>
              <p className="mt-4 text-lg">
                Los dispositivos electrónicos, como teléfonos, computadoras y
                electrodomésticos, contribuyen de manera significativa a la
                huella de carbono. La fabricación, uso y desecho de estos
                dispositivos implica una alta emisión de gases de efecto
                invernadero.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105 shadow-xl shadow-green-900 mt-5">
              <FontAwesomeIcon
                icon={faPlug}
                className="text-teal-500 text-5xl mb-4"
              />
              <h2 className="text-3xl font-semibold">
                Energía y Consumo de Dispositivos
              </h2>
              <p className="mt-4 text-lg">
                Cada dispositivo electrónico consume energía, y la forma en que
                esa energía se produce afecta directamente a nuestra huella de
                carbono. Reducir el consumo energético y usar energías
                renovables es esencial para minimizar el impacto ambiental.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-100 max-w-md mx-auto shadow-xl shadow-green-900 ">
            <h3 className="text-3xl font-extrabold text-green-900 mb-9 text-center">
              ¿Cómo Puedes Reducir tu Huella de Carbono?
            </h3>
            <ul className="text-lg text-green-900 list-inside list-disc space-y-4">
              <li className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faRecycle}
                  className="text-green-700 text-2xl"
                />
                <span className="text-left">
                  Recicla y reutiliza productos electrónicos.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faPlug}
                  className="text-green-700 text-2xl"
                />
                <span className="text-left">
                  Usa dispositivos energéticamente eficientes.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-green-700 text-2xl"
                />
                <span className="text-left">
                  Compra productos locales para reducir el transporte de bienes.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faTree}
                  className="text-green-700 text-2xl"
                />
                <span className="text-left">
                  Participa en iniciativas comunitarias de reforestación y
                  energías renovables.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inicio;
