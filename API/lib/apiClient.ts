import { request, APIRequestContext, APIResponse } from "@playwright/test";
import testConfig from "@config/*";

export type Headers = Record<string, string>;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
let config = testConfig.use!.testConfig!;

interface SendOptions {
    headers?: Headers;
    data?: unknown;
    bearerToken?: string;
}

export class ApiClient {
    private ctx?: APIRequestContext;
    private defaultHeaders: Headers;
    private bearerToken?: string;

    /**
     * Built-in default headers applied to every request unless overridden.
     */
    private static readonly DEFAULT_HEADERS: Headers = {
        Accept: "application/json",
    };

    /**
     * Create a new `ApiClient`.
     *
     * @param defaultHeaders Headers to merge on top of the client's defaults.
     * @param bearerToken Optional bearer token attached to every request.
     */
    constructor(defaultHeaders: Headers = {}, bearerToken?: string) {
        this.defaultHeaders = { ...ApiClient.DEFAULT_HEADERS, ...defaultHeaders };
        this.bearerToken = bearerToken;
    }

    /**
     * Set or clear the client's bearer token.
     * Pass `undefined` or an empty string to clear.
     *
     * @param token The bearer token to use for subsequent requests.
     */
    public async setBearerToken(token?: string) {
        this.bearerToken = token;
    }

    /**
     * Lazily create or return the underlying Playwright request context.
     * The context is configured with baseURL and default headers.
     *
     * @returns The shared `APIRequestContext` instance.
     * @internal
     */
    private async context(): Promise<APIRequestContext> {
        if (!this.ctx) {
            this.ctx = await request.newContext({
                baseURL: config.api.baseURL,
                extraHTTPHeaders: this.defaultHeaders,
            });
        }
        return this.ctx;
    }

    /**
     * Dispose the underlying request context (if any).
     * Call this to free resources after you're done with the client.
     */
    public async close(): Promise<void> {
        if (this.ctx) {
            await this.ctx.dispose();
            this.ctx = undefined;
        }
    }

    /**
     * Ensure the path starts with a leading slash.
     *
     * @param path Relative or absolute request path.
     * @returns Normalized path with a leading slash.
     * @internal
     */
    private buildUrl(path: string): string {
        return path.startsWith("/") ? path : `/${path}`;
    }

    /**
     * Merge default headers, per-call headers and bearer token (client or per-call).
     * Any user-provided `Authorization` header is stripped and replaced by the token.
     *
     * @param newHeaders Additional headers for this request.
     * @param perRequestToken Optional token that overrides the client's token.
     * @returns Final headers for the request.
     * @internal
     */
    private mergeHeaders(newHeaders?: Headers, perRequestToken?: string): Headers {
        const headers: Headers = { ...this.defaultHeaders, ...(newHeaders ?? {}) };

        // Remove any user-supplied Authorization to avoid conflicts.
        for (const k of Object.keys(headers)) {
            if (k.toLowerCase() === "authorization") delete headers[k];
        }

        const token = perRequestToken ?? this.bearerToken;
        if (token) headers.Authorization = `Bearer ${token}`;

        return headers;
    }

    /**
     * Core request executor. Adds JSON Content-Type automatically when a body is present
     * and no explicit Content-Type is provided.
     *
     * @param method HTTP method.
     * @param path Request path (with or without leading slash).
     * @param opts Per-request options (headers, data, bearerToken).
     * @returns Playwright `APIResponse`.
     * @internal
     */
    private async send(method: HttpMethod, path: string, opts: SendOptions = {}): Promise<APIResponse> {
        const ctx = await this.context();
        const headers = this.mergeHeaders(opts.headers, opts.bearerToken);

        const hasBody = opts.data !== undefined;
        if (hasBody && !Object.keys(headers)
            .some(k => k.toLowerCase() === "content-type")) {
            headers["Content-Type"] = "application/json";
        }

        const url = this.buildUrl(path);
        return await ctx.fetch(url, {
            method,
            headers,
            data: opts.data,
        });
    }

    // ---------- public HTTP helpers ----------

    /**
     * Send a GET request.
     *
     * @param path Request path.
     * @param opts Optional headers and per-request token.
     */
    public get(path: string, opts: Omit<SendOptions, "data"> = {}): Promise<APIResponse> {
        return this.send("GET", path, opts);
    }

    /**
     * Send a DELETE request.
     *
     * @param path Request path.
     * @param opts Optional headers and per-request token.
     */
    public delete(path: string, opts: Omit<SendOptions, "data"> = {}): Promise<APIResponse> {
        return this.send("DELETE", path, opts);
    }

    /**
     * Send a POST request.
     *
     * @param path Request path.
     * @param data Request body (JSON by default).
     * @param opts Optional headers and per-request token.
     */
    public post(path: string, data?: unknown, opts: Omit<SendOptions, "data"> = {}): Promise<APIResponse> {
        return this.send("POST", path, { ...opts, data });
    }

    /**
     * Send a PUT request.
     *
     * @param path Request path.
     * @param data Request body (JSON by default).
     * @param opts Optional headers and per-request token.
     */
    public put(path: string, data?: unknown, opts: Omit<SendOptions, "data"> = {}): Promise<APIResponse> {
        return this.send("PUT", path, { ...opts, data });
    }

    /**
     * Send a PATCH request.
     *
     * @param path Request path.
     * @param data Request body (JSON by default).
     * @param opts Optional headers and per-request token.
     */
    public patch(path: string, data?: unknown, opts: Omit<SendOptions, "data"> = {}): Promise<APIResponse> {
        return this.send("PATCH", path, { ...opts, data });
    }
}