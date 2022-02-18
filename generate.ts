import { serve } from "https://deno.land/std@0.126.0/http/server.ts";

const ip = (i: number) => `0.0.0.${i}`;

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
    numberOfNodes--;
    while (numberOfNodes > 0) {
        const rand = randomIntBetween(1, numberOfNodes/2);
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

        const body = (non > 0) ? randomTree(non) : "add a number n to the end of the URL to get a network n IPs";

        return new Response(body, { status: 200 });
    }, { port: 80 });
}