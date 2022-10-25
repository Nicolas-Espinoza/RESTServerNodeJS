

const validateAdminRole = (req, res, next) => {

    if (!req.user) {
        return res.status(500).json({
            success: false,
            response: 'No se pudo verificar el Rol ya que no se verifico el token!'
        })
    }

    const { name, role } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            success: false,
            response: `${name} usted no es administrador!`
        })
    }

    next();
}

const haveRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(500).json({
                success: false,
                response: 'No se pudo verificar el Rol ya que no se verifico el token!'
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                response: `El servicio requiere alguno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    validateAdminRole,
    haveRole
}