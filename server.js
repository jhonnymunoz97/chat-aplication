const { Server } = require("net");

const host = "0.0.0.0";
const END = "END";

const connections = new Map();

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const sendMessage = (message, origin) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

const listen = (port) => {
  const server = new Server();

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Nueva conexión desde ${remoteSocket}`);
    socket.setEncoding("utf-8");

    socket.on("data", (message) => {
      connections.values();
      if (!connections.has(socket)) {
        console.log(`Usuario ${message} establecido para la conexión ${remoteSocket}`);
        connections.set(socket, message);
      } else if (message === END) {
        connections.delete(socket);
        socket.end();
      } else {
        const fullMessage = `[${connections.get(socket)}]: ${message}`;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        sendMessage(fullMessage, socket);
      }
    });

    socket.on("error", (err) => console.error(err));

    socket.on("close", () => {
      console.log(`Conexión de ${remoteSocket} finalizada`);
    });
  });

  server.listen({ port, host }, () => {
    console.log("Escuchando en el puerto 8000");
  });

  server.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 3) {
    error(`Modo de uso: node ${__filename} port`);
  }

  let port = process.argv[2];
  if (isNaN(port)) {
    error(`Puerto inválido ${port}`);
  }

  port = Number(port);

  listen(port);
};

if (require.main === module) {
  main();
}