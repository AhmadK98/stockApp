const validateUser = (user) => {
    const validUser = typeof user.trim() == 'string'
        && !user.match(/[!@|[€£:;><§}{~ `'"#\$%\?\^\&*\)\(+=._-]/g)
    return validUser
}

console.log(validateUser('gasfcsdvAx'))