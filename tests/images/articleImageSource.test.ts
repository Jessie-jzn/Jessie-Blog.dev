import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import {
  ARTICLE_IMAGE_FALLBACK,
  articleImageSource,
  isPrivateNetworkAddress,
  validateRemoteImageUrl,
} from "../../lib/images/articleImageSource.ts";

test("uses the existing local fallback for empty and malformed sources", () => {
  assert.equal(ARTICLE_IMAGE_FALLBACK, "/images/default.jpg");
  assert.equal(existsSync("public/images/default.jpg"), true);
  assert.equal(articleImageSource(), ARTICLE_IMAGE_FALLBACK);
  assert.equal(articleImageSource("  "), ARTICLE_IMAGE_FALLBACK);
  assert.equal(articleImageSource("not a url"), ARTICLE_IMAGE_FALLBACK);
  assert.equal(articleImageSource("javascript:alert(1)"), ARTICLE_IMAGE_FALLBACK);
});

test("preserves local and already proxied image paths", () => {
  assert.equal(articleImageSource("/images/default.jpg"), "/images/default.jpg");
  assert.equal(
    articleImageSource("/api/image-proxy?url=https%3A%2F%2Fexample.com%2Fa.jpg"),
    "/api/image-proxy?url=https%3A%2F%2Fexample.com%2Fa.jpg"
  );
});

test("wraps public HTTP images in the local proxy exactly once", () => {
  const remote = "https://images.example.com/cover.jpg?size=large";
  assert.equal(
    articleImageSource(remote),
    `/api/image-proxy?url=${encodeURIComponent(remote)}`
  );
});

test("rejects localhost and private network image targets", () => {
  const blocked = [
    "http://localhost/image.jpg",
    "http://127.0.0.1/image.jpg",
    "http://10.0.0.8/image.jpg",
    "http://172.16.4.2/image.jpg",
    "http://192.168.1.2/image.jpg",
    "http://169.254.1.2/image.jpg",
    "http://[::1]/image.jpg",
  ];

  for (const value of blocked) {
    assert.equal(validateRemoteImageUrl(value), null, value);
    assert.equal(articleImageSource(value), ARTICLE_IMAGE_FALLBACK, value);
  }
});

test("accepts public HTTP and HTTPS targets", () => {
  assert.equal(
    validateRemoteImageUrl("https://images.example.com/a.jpg")?.hostname,
    "images.example.com"
  );
  assert.equal(
    validateRemoteImageUrl("http://203.0.113.10/a.jpg")?.hostname,
    "203.0.113.10"
  );
});

test("recognizes private DNS results, including IPv4-mapped IPv6", () => {
  for (const address of [
    "127.0.0.1",
    "10.20.30.40",
    "172.20.0.1",
    "192.168.1.2",
    "169.254.1.2",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ]) {
    assert.equal(isPrivateNetworkAddress(address), true, address);
  }
  assert.equal(isPrivateNetworkAddress("1.1.1.1"), false);
  assert.equal(isPrivateNetworkAddress("2606:4700:4700::1111"), false);
});
