import { BrowserContext, Page } from "@playwright/test";
import testConfig from "@config/*";
import { ApiClient } from "@lib/apiClient";

export class CommentsApiPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly url = testConfig.use!.testConfig!.api.baseURL;
	apiClient = new ApiClient;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
	}

	public getComments(path?: string) {
		path = path || ""
		return this.apiClient.get("/comments" + path)
	}

	public postComments(data: any) {
		return this.apiClient.post("/comments", data)

	}

	public deleteComments(path: string) {
		path = path || ""
		return this.apiClient.delete("/comments" + path)

	}

	public patchComments(path: string, data: any) {
		path = path || ""
		return this.apiClient.patch("/comments" + path, data)

	}

	public validateComment(comment: any): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const hasValidShape =
			typeof comment.postId === 'number' &&
			typeof comment.id === 'number' &&
			typeof comment.name === 'string' &&
			typeof comment.email === 'string' &&
			typeof comment.body === 'string';

		const hasValidEmail = emailRegex.test(comment.email);

		return hasValidShape && hasValidEmail;
	}



	async createToken(): Promise<string> {
		const response = await this.page.request.post(`${this.url}/auth`, {
			data: { username: 'admin', password: 'password123' },
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		return data.token;
	}
}