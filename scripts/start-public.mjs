import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const mode = process.argv[2] === "start" ? "start" : "dev";
const port = Number(process.env.PORT ?? 3000);
const host = "0.0.0.0";
const localUrl = `http://127.0.0.1:${port}`;
let nextProcess;
let tunnelProcess;
let stopping = false;

function cloudflaredPath() {
  const executable = process.platform === "win32" ? "cloudflared.exe" : "cloudflared";
  const candidates = [process.env.CLOUDFLARED_PATH, resolve(root, "tools", executable), resolve(root, "..", "Manutencao-API", "scripts", executable)].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? executable;
}

function ensurePortIsAvailable() {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = createServer();
    server.once("error", rejectPromise);
    server.listen(port, host, () => server.close(resolvePromise));
  });
}

async function waitForFrontend() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(localUrl)).ok) return;
    } catch {
      // The Next server is still starting.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
  throw new Error(`O frontend não respondeu em ${localUrl} dentro de 120 segundos.`);
}

function stopChildren(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  tunnelProcess?.kill();
  nextProcess?.kill();
  process.exit(exitCode);
}

function startTunnel() {
  let announcedUrl = false;
  tunnelProcess = spawn(cloudflaredPath(), ["tunnel", "--url", localUrl, "--no-autoupdate", "--protocol", "http2"], { stdio: ["ignore", "pipe", "pipe"] });
  const forwardOutput = (chunk) => {
    const output = chunk.toString();
    process.stdout.write(output);
    const match = output.match(/https:\/\/[-a-z0-9]+\.trycloudflare\.com/i);
    if (match && !announcedUrl) {
      announcedUrl = true;
      console.log(`\nLink público: ${match[0]}\n`);
    }
  };
  tunnelProcess.stdout.on("data", forwardOutput);
  tunnelProcess.stderr.on("data", forwardOutput);
  tunnelProcess.on("error", (error) => {
    console.error(`Não foi possível iniciar o Cloudflare Tunnel: ${error.message}`);
    stopChildren(1);
  });
  tunnelProcess.on("exit", (code) => {
    if (!stopping) {
      console.error(`O túnel público foi encerrado (código ${code ?? "desconhecido"}).`);
      stopChildren(code ?? 1);
    }
  });
}

async function main() {
  try {
    await ensurePortIsAvailable();
  } catch {
    throw new Error(`A porta ${port} já está em uso. Encerre a instância atual antes de executar npm run ${mode}.`);
  }
  const nextCli = resolve(root, "node_modules", "next", "dist", "bin", "next");
  nextProcess = spawn(process.execPath, [nextCli, mode, "--hostname", host, "--port", String(port)], { stdio: "inherit" });
  nextProcess.on("error", (error) => {
    console.error(`Não foi possível iniciar o Next.js: ${error.message}`);
    stopChildren(1);
  });
  nextProcess.on("exit", (code) => {
    if (!stopping) stopChildren(code ?? 1);
  });
  await waitForFrontend();
  startTunnel();
}

process.on("SIGINT", () => stopChildren());
process.on("SIGTERM", () => stopChildren());
main().catch((error) => {
  console.error(error.message);
  stopChildren(1);
});