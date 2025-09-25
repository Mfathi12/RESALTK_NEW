/* export const Authorization = (...role) => {
    return (req, res, next) => {
        if (role !== req.user.accountType) {
            return next (new Error({ message: "Access denied, insufficient permissions" },{cause: 403 }));
        }
        next();
    }
} */
export const Authorization = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.accountType)) {
            const error = new Error("Access denied, insufficient permissions");
            error.status = 403;
            return next(error);
        }
        next();
    }
}
