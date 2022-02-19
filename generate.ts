import { serve } from "https://deno.land/std@0.126.0/http/server.ts";

function randomIntBetween(a: number, b: number) {
    return Math.floor((Math.random() * (b-a+1)) + a);
}

const gone = new Set<string>();
const nextIP = () => {
    let ip;
    do {
        ip = `${randomIntBetween(0, 255)}.${randomIntBetween(0, 255)}.${randomIntBetween(0, 255)}.${randomIntBetween(0, 255)}`;
    } while (gone.has(ip));
    return ip;
};

function randomTree(numberOfNodes: number) {
    if (numberOfNodes === 1) return nextIP();

    const subtrees = [nextIP()];
    let rest = numberOfNodes - 1;
    while (numberOfNodes > 0) {
        const rand = randomIntBetween(1, Math.min(rest, numberOfNodes));
        subtrees.push(randomTree(rand));
        numberOfNodes -= rand;
    }

    return `(${subtrees.join(" ")})`;
}

if (import.meta.main && Deno.args[0] !== undefined) {
    console.log(randomTree(parseInt(Deno.args[0])));
} else {
    await serve((request: Request): Response => {
        const parts = request.url.split("/");
        const non = parseInt(parts[parts.length - 1]);

        const body = (non > 0)
                   ? non <= 1e6 ? randomTree(non) : "nope"
                   : "add a number n after the / at the end of the URL to get a network n IPs";

        return new Response(body, { status: 200 });
    }, { port: 80 });
}