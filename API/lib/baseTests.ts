import { test as baseTest } from '@playwright/test';
import { CommentsApiPage } from "@pages/commentsApiPage";
import { PostsApiPage } from "@pages/postsApiPage";

const test = baseTest.extend<{
	commentsApiPage: CommentsApiPage;
	postsApiPage: PostsApiPage;
}>({
	commentsApiPage: async ({ page, context }, use) => {
		await use(new CommentsApiPage(page, context));
	},
	postsApiPage: async ({ page, context }, use) => {
		await use(new PostsApiPage(page, context));
	}
})

export default test;