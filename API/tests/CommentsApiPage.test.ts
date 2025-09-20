import { expect } from '@playwright/test';
import test from '@lib/baseTests';

test.describe('JSONPlaceholder API – /comments', () => {
  test('GET /comments – lista + walidacja e-mail', async ({ commentsApiPage }) => {
    const res = await commentsApiPage.getComments();
    const data: any[] = await res.json();

    expect(res.status()).toBe(200);
    expect(data.length).toBeGreaterThan(0);
    expect(data.slice(0, 10).every(commentsApiPage.validateComment)).toBe(true);
  });

  test('GET /comments/1 – szczegół', async ({ commentsApiPage }) => {
    const res = await commentsApiPage.getComments("/1");
    const comment = await res.json();

    expect(res.status()).toBe(200);
    expect(comment).toMatchObject({
      postId: expect.any(Number),
      id: 1,
      name: expect.any(String),
      email: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /comments?postId=1 – filtr po postId', async ({ commentsApiPage }) => {
    const res = await commentsApiPage.getComments("?postId=1");
    const comments: any[] = await res.json();

    expect(res.status()).toBe(200);
    expect(comments.length).toBeGreaterThan(0);
    for (const c of comments) expect(c.postId).toBe(1);
  });

  test('POST /comments – utworzenie komentarza', async ({ commentsApiPage }) => {
    const payload = {
      postId: 1,
      name: 'Tester',
      email: 'tester@example.com',
      body: 'Świetny post!',
    };
    const res = await commentsApiPage.postComments(payload);
    const created = await res.json();

    expect(res.status()).toBe(201);
    expect(created).toMatchObject({
      ...payload,
      id: expect.any(Number),
    });
  });

  test('PATCH /comments/1 – częściowa aktualizacja', async ({ commentsApiPage }) => {
    const res = await commentsApiPage.patchComments("/1", { data: { body: 'Zmieniony komentarz' } });
    const patched = await res.json();

    expect(res.status()).toBe(200);
    expect(patched.id).toBe(1);
    expect(patched.body).toBe('Zmieniony komentarz');
  });

  test('DELETE /comments/1 – usunięcie (mockowane puste body)', async ({ commentsApiPage }) => {
    const res = await commentsApiPage.deleteComments("/1");
    const bodyText = await res.text();

    expect([200, 204]).toContain(res.status());
    expect(['', '{}']).toContain(bodyText.trim());
  });
});
