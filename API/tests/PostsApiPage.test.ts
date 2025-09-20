import { expect } from '@playwright/test';
import test from '@lib/baseTests';

test.describe('JSONPlaceholder API – /posts', () => {
  test('GET /posts – lista postów + walidacja struktury', async ({ postsApiPage }) => {
    const res = await postsApiPage.getPosts();
    const data: Array<any> = await res.json();

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);

    for (const item of data.slice(0, 5)) {
      expect(item).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });
    }
  });

  test('GET /posts/1 – szczegół', async ({ postsApiPage }) => {
    const res = await postsApiPage.getPosts("/1");
    const post = await res.json();

    expect(res.status()).toBe(200);
    expect(post).toMatchObject({
      userId: expect.any(Number),
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /posts?userId=1 – filtr po userId', async ({ postsApiPage }) => {
    const res = await postsApiPage.getPosts("?userId=1");
    const posts: any[] = await res.json();

    expect(res.status()).toBe(200);
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) expect(p.userId).toBe(1);
  });

  test('POST /posts – utworzenie zasobu (symulowane, spodziewane id=101)', async ({ postsApiPage }) => {
    const payload = { title: 'Test post', body: 'Playwright API test', userId: 7 };
    const res = await postsApiPage.postPosts(payload);
    const created = await res.json();

    expect(res.status()).toBe(201);
    expect(created).toMatchObject({
      ...payload,
      id: expect.any(Number),
    });
  });

  test('PUT /posts/1 – pełna aktualizacja', async ({ postsApiPage }) => {
    const payload = { id: 1, title: 'Updated', body: 'Updated body', userId: 1 };
    const res = await postsApiPage.putPosts("/1", payload);
    const updated = await res.json();

    expect(res.status()).toBe(200);
    expect(updated).toMatchObject(payload);
  });

  test('PATCH /posts/1 – częściowa aktualizacja', async ({ postsApiPage }) => {
    const res = await postsApiPage.patchPosts("/1", { data: { title: 'Patched title' } });
    const patched = await res.json();

    expect(res.status()).toBe(200);
    expect(patched.id).toBe(1);
    expect(patched.title).toBe('Patched title');
  });

  test('DELETE /posts/1 – usunięcie (mockowane puste body)', async ({ postsApiPage }) => {
    const res = await postsApiPage.deletePosts("/1");
    const bodyText = await res.text();

    expect([200, 204]).toContain(res.status());
    expect(['', '{}']).toContain(bodyText.trim());
  });
});