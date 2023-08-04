export function getEnv(name) {
    if (window && window.injectConfig) { 
        return window.injectConfig[name]
    }

    return process.env[name]
}