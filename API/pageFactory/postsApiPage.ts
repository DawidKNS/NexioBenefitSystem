import { BrowserContext, Page } from "@playwright/test";
import testConfig from "@config/*";
import { ApiClient } from "@lib/apiClient";

export class PostsApiPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly url = testConfig.use!.testConfig!.api.baseURL;
	apiClient = new ApiClient;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
	}

	public getPosts(path?: string) {
		path = path || ""
		return this.apiClient.get("/posts" + path)
	}

	public postPosts(data: any) {
		return this.apiClient.post("/posts", data)

	}

	public deletePosts(path: string) {
		path = path || ""
		return this.apiClient.delete("/posts" + path)

	}

	public patchPosts(path: string, data: any) {
		path = path || ""
		return this.apiClient.patch("/posts" + path, data)

	}

	public putPosts(path: string, data: any) {
		path = path || ""
		return this.apiClient.put("/posts" + path, data)

	}
}