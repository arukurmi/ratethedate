
// ASYCNHANDLER USING TRY CATCH

// const asyncHandler = (fn) => async(req, res, next) => {
//     // How this above higher order function happens?
//     // const asyncHandler = () => {}                this is a normal function
//     // const asyncHandler = (func) => {}            here we are accepting a function as a parameter
//     // const asyncHandler = (func) => {() => {}}    here we are passing that same function paramter to another function inside
//     // and just remove the last curly braces

//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }


// ASYNCHANDLER USING PROMISES
const asyncHandler = (reqHandler) => {
    (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}