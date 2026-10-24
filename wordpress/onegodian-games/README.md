# OneGodian Games — WordPress Plugin (candidate v0.1.0)

**Source:** `ohi-stack/onegodia-rise-of-the-digital-world/wordpress/onegodian-games`

This is a **new, self-contained WordPress plugin module**, not an assertion that an existing OneGodian Games installation has been upgraded. It does not replace the canonical Onegodia 3D browser-game runtime.

## Included game

**OneGodian: Rise of Civilization** is a three-district, 2D canvas platformer with:

- Arrow keys / WASD, Space/Up/W to jump, and mobile touch buttons.
- Double-jump, horizontal moving platforms, and gold collectible coins.
- Red spike hazards, three lives, death and restart handling.
- A checkpoint that changes the respawn position within the district.
- A goal flag that completes a district and advances to the next.
- Level selector, coin counter, restart button, keyboard focus and reduced-motion-aware UI.

All coins are **non-transferable, game-only score items**. No OneGodian Digital Coin (ODC), wallet, token, NFT, gambling, payment, purchase, account, or financial functionality is active. No player state is persisted or sent to a server.

## Install / stage

1. Package the `wordpress/onegodian-games` folder as `onegodian-games.zip`, with `onegodian-games.php` at the plugin root.
2. Install the ZIP in a **WordPress staging site** under Plugins → Add New → Upload Plugin, and activate it. PHP 8.2+ and WordPress 6.3+ are required.
3. Add the shortcode `[onegodian_games]` to a page, or use `[onegodian_game game="rise-of-civilization"]`.
4. Test desktop keyboard, iPhone/Android touch, iframe isolation, keyboard focus, gameplay through all three levels, and page/theme compatibility.
5. Verify the production plugin version, page URL, cache, and rollback ZIP before any production rollout.

The shortcode embeds a locally bundled HTML game inside a sandboxed iframe (`allow-scripts` only). This isolates game JavaScript from WordPress cookies, sessions, and global page scripts. A restrictive Content Security Policy may require a separately reviewed policy exception for the bundled inline script. Do not enable `allow-same-origin` without a security review.

## Development checks

```bash
php -l wordpress/onegodian-games/onegodian-games.php
php wordpress/onegodian-games/tests/verify-plugin.php
node wordpress/onegodian-games/tests/verify-platformer.mjs
```

The CI workflow also packages a plugin ZIP as a review artifact. Source checks are not equivalent to WordPress staging acceptance or public deployment.

## Rollback

Disable the plugin, remove its shortcode(s) from pages, and restore the previous plugin ZIP if an existing installation is being replaced. This candidate stores no player records and makes no database migrations. Record the deployed plugin version and site/page evidence before marking it operational.

**Owner:** ONEGODIAN, LLC. **Maturity:** review candidate; staging and production unverified.
