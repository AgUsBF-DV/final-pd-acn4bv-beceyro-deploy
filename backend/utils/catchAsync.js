/**
 * Wrapper para manejar errores en funciones asíncronas
 * Elimina la necesidad de try-catch en cada controlador
 */

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
