const fs = require("fs");
const path = require("path")

const logRequest = (method, url, status) => {
    const now = new Date();
    const [date, time] = now.toISOString().split("T");
    const logDir = path.join(__dirname, "../logs");
    const logFile = path.join(logDir, `${date}.log`);
    const logLine= `[${date}${time.split(".")[0]}] METHOD: ${method} ${url} - STATUS: ${status} \n`;
    fs.appendFile(logFile, logLine, (error) => {
        if (error) {
            console.error("Error al escribir el log: ", error);
        }
    })
}

module.exports = {
    logRequest
}