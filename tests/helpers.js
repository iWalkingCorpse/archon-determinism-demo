import { createApp } from "../src/app.js";

/**
 * Boot the app on an ephemeral port and return { baseUrl, close }.
 */
export function startServer() {
  return new Promise((resolve) => {
    const server = createApp().listen(0, () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(done))
      });
    });
  });
}
