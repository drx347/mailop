from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from html import escape
from pathlib import Path
import argparse
import json


ROOT = Path(__file__).resolve().parent
ASSET_VERSION = "vercel-love-icon-1"
BACKSOUND_FILE = "Taylor Swift - Daylight.mp3"

CONFIG = {
    "toName": "Kamu",
    "fromName": "Seseorang",
    "mainMessages": [
        "Hai, kamu...",
        "Ini pesan kecil, ngirim peluk hangat dari jauh.",
        "Kamu bikin hari-hariku yang biasa jadi terasa lebih lembut, lebih terang, dan lebih punya arah.",
        "Aku bangga sama kamu, selalu ngertiin dan sabar dengan banyak hal.",
        "Semoga halaman kecil ini bisa bikin kamu senyum sebentar.",
    ],
    "aboutHer": {
        "eyebrow": "tentang dia",
        "title": "Seseorang yang Spesial",
        "subtitle": "Orang yang selalu punya tempat sendiri di hati.",
        "facts": [
            ("Nama", "Dirahasiakan"),
            ("Hari Spesial", "Dirahasiakan"),
            ("Hal kecil", "Senyumnya yang sederhana"),
            ("Paling disuka", "Caranya bikin hari terasa lebih hangat"),
        ],
        "storyTitle": "Wish kecil dari aku",
        "story": (
            "Semoga ke depannya kamu selalu dijaga hal-hal baik, makin kuat, makin bahagia, "
            "dan tetap jadi versi diri kamu yang paling tulus."
        ),
    },
    "result": {
        "label": "catatan kecil",
        "title": "Maaf hadiahnya cuma sweater inii ajaaa",
        "lead": "Belum bisa yang mewah-mewah eheheheehe, tapi ini aku pilih sambil mikirin kamu.",
        "note": (
            "Kalau nanti kamu pakai, semoga rasanya hangat. Bukan cuma karena sweater-nya, "
            "tapi karena ada aku yang diam-diam pengin jagain kamu dari jauh."
        ),
        "small": (
            "Maaf ya, aku juga lagi nabung sama ngumpulin buat kebutuhan yang lain, "
            "jadinya ga bisa ngasii banyak:p."
        ),
    },
}

IMAGES = [
    "e61272b0-5501-488f-a6c5-45a1661af006.jpg",
    "d147b431-4260-438e-8da6-63c205da9d07.jpg",
    "cc0970e0-adee-4d34-8645-008a4a9b2f26.jpg",
    "ac94ad07-48e7-4536-a53a-a99070be3c7e.jpg",
    "f616f1c1-ccab-42d2-b441-b0be0c890f78.jpg",
    "34d6e1ed-850f-413a-90ae-08e0846025e3.jpg",
    "ea3f7675-54a5-4e65-8d97-84aa9931cb54.jpg",
    "9458e130-f884-4616-a260-87acc4619717.jpg",
    "34c07170-3c2b-4252-9079-995249a0c520.jpg",
    "a5a25843-fd12-436a-b1c8-a3a06df3a0cf.jpg",
    "63a55104-cad8-47c7-8d44-3f074c3b3e63.jpg",
    "dc0d0faf-cdaf-48d7-a560-45822bd655a5.jpg",
    "a7529031-a8cd-4149-82b8-f55edab39915.jpg",
    "154f16b7-a352-4e50-bfce-626b018af1d9.jpg",
    "sider.jpg",
    "287e2208-972c-4cf7-ac03-436250635f68.jpg",
    "32c88ea5-c832-4c02-952b-7bc07d4c944c.jpg",
    "3e2e99f2-898c-404b-bf01-3f176196e4d7.jpg",
    "6ab801e2-5bac-4629-80c9-b0e54bf6c35a.jpg",
    "8bee9256-d658-4138-a427-2c8084815a36.jpg",
    "a3e465c2-2431-460d-a639-9c69a6a97737.jpg",
    "ac964e60-10c4-4fda-8dfa-db76317322c2.jpg",
    "b496e9d7-8ae1-4e4d-a093-6b2b089a7104.jpg",
    "dfd18fd5-1772-41c1-8cc8-4c754de5b7f8.jpg",
]

ABOUT_PHOTOS = [0, 1, 2]
STORY_PHOTOS = [8, 9, 10, 11, 12, 13]
COVER_IMAGE = "sider.jpg"

# Ganti nama file ini nanti dengan foto sweater yang kamu mau.
SWEATER_IMAGE = "ac94ad07-48e7-4536-a53a-a99070be3c7e.jpg"


def asset(path):
    return "/" + path.lstrip("/")


def image_asset(file_name):
    return asset(f"assets/images/{file_name}")


def photo(index, caption="", class_name=""):
    file_name = IMAGES[index % len(IMAGES)]
    classes = "photo"
    if class_name:
        classes += f" {escape(class_name)}"
    caption_html = f"<figcaption>{escape(caption)}</figcaption>" if caption else ""
    return (
        f'<figure class="{classes}">'
        f'<img src="{asset(f"assets/images/{file_name}")}" alt="" loading="lazy" />'
        f"{caption_html}</figure>"
    )


def config_json():
    return json.dumps(CONFIG, ensure_ascii=False).replace("</", "<\\/")


def render_page(title, description, page_name, body, script_name=None):
    page_script = (
        f'    <script type="module" src="{asset(f"ts/{script_name}.ts")}?v={ASSET_VERSION}"></script>\n'
        if script_name
        else ""
    )
    return f"""<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{escape(title)}</title>
    <meta name="description" content="{escape(description)}" />
    <link rel="icon" href="{asset("icons/favicon.svg")}" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="{asset("icons/favicon.svg")}" />
    <link rel="stylesheet" href="{asset("css/scrapbook.css")}?v={ASSET_VERSION}" />
    <link rel="stylesheet" href="{asset("css/mobile.css")}?v={ASSET_VERSION}" />
  </head>
  <body class="{escape(page_name)}" data-page="{escape(page_name)}">
    <div class="desk-texture" aria-hidden="true"></div>
    <audio id="bgm" src="{asset(f"backsounds/{BACKSOUND_FILE}")}" preload="metadata"></audio>
    {body}
    <script id="birthday-config" type="application/json">{config_json()}</script>
    <script type="module" src="{asset("ts/app.ts")}?v={ASSET_VERSION}"></script>
{page_script.rstrip()}
  </body>
</html>
"""


def cover_page():
    body = f"""
    <main class="scrap-page cover-page">
      <section class="scrapbook spread cover-spread" aria-label="Scrapbook pembuka">
        <div class="cover-copy">
          <p class="label-strip">Untuk {escape(CONFIG["toName"])}</p>
          <h1>Scrapbook kecil tentang kamu.</h1>
          <p class="lead">Aku susun beberapa potongan rasa, foto, dan kata-kata kecil supaya malam ini terasa dekat.</p>
        </div>

        <div class="cover-board">
          <div class="clip" aria-hidden="true"></div>
          <div class="motion-ring" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="board-stickers" aria-hidden="true">
            <span class="sticker sticker-date">special day</span>
            <span class="sticker sticker-note">for you</span>
            <span class="sticker sticker-star">wish</span>
          </div>

          <button class="scrap-book" id="openBook" type="button" aria-label="Buka buku scrapbook">
            <span class="book-shadow"></span>
            <span class="book-back"></span>
            <span class="book-page book-left">
              <span class="letter-pin" aria-hidden="true"></span>
              <span id="letterTitle"></span>
              <span id="letterBody"></span>
              <span id="letterSign"></span>
            </span>
            <span class="book-page-stack" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="book-blank-page" aria-hidden="true">
              <span class="blank-page-corner"></span>
              <span class="blank-page-ribbon"></span>
            </span>
            <span class="book-cover">
              <span class="book-spine"></span>
              <span class="book-label">scrapbook</span>
              <span class="book-title">Pieces Of You</span>
              <span class="book-photo">
                <img src="{image_asset(COVER_IMAGE)}" alt="" loading="lazy" />
              </span>
              <span class="book-tape tape-top" aria-hidden="true"></span>
              <span class="book-tape tape-bottom" aria-hidden="true"></span>
            </span>
            <span class="book-ribbon" aria-hidden="true"></span>
            <span class="book-glint glint-one" aria-hidden="true"></span>
            <span class="book-glint glint-two" aria-hidden="true"></span>
          </button>
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu",
        "Scrapbook romantis yang dibuat khusus untuk seseorang.",
        "page-cover",
        body,
        "book",
    )


def about_page():
    about = CONFIG["aboutHer"]
    facts = "\n".join(
        f"""
              <div class="about-fact">
                <span>{escape(label)}</span>
                <strong>{escape(value)}</strong>
              </div>
        """
        for label, value in about["facts"]
    )
    body = f"""
    <main class="scrap-page about-page">
      <section class="scrapbook spread about-spread" aria-label="Tentang dia">
        <div class="about-portrait">
          <span class="about-paper-shape shape-a" aria-hidden="true"></span>
          <span class="about-paper-shape shape-b" aria-hidden="true"></span>
          <span class="about-paper-shape shape-c" aria-hidden="true"></span>
          <figure class="about-main-photo">
            <img src="{image_asset(IMAGES[ABOUT_PHOTOS[0]])}" alt="" loading="lazy" />
            <figcaption>favorite smile</figcaption>
          </figure>
          <figure class="about-mini-photo mini-a" aria-hidden="true">
            <img src="{image_asset(IMAGES[ABOUT_PHOTOS[1]])}" alt="" loading="lazy" />
          </figure>
          <figure class="about-mini-photo mini-b" aria-hidden="true">
            <img src="{image_asset(IMAGES[ABOUT_PHOTOS[2]])}" alt="" loading="lazy" />
          </figure>
          <span class="about-tape tape-a" aria-hidden="true"></span>
          <span class="about-tape tape-b" aria-hidden="true"></span>
          <span class="about-stamp">secret date</span>
          <span class="about-ribbon">made with love</span>
        </div>

        <div class="about-note">
          <span class="about-note-pin" aria-hidden="true"></span>
          <p class="label-strip">{escape(about["eyebrow"])}</p>
          <h1>{escape(about["title"])}</h1>
          <p class="about-subtitle">{escape(about["subtitle"])}</p>
          <div class="about-facts" aria-label="Data diri">{facts}</div>
          <div class="about-story">
            <h2>{escape(about["storyTitle"])}</h2>
            <p>{escape(about["story"])}</p>
          </div>
          <div class="actions">
            <button class="btn primary" id="aboutNextBtn" type="button">Lanjut</button>
          </div>
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu - Tentang Dia",
        "Halaman kecil tentang orang tersayang.",
        "page-about",
        body,
        "about",
    )


def story_page():
    photos = "\n".join(
        [
            photo(STORY_PHOTOS[0], "01", "polaroid a"),
            photo(STORY_PHOTOS[1], "02", "polaroid b"),
            photo(STORY_PHOTOS[2], "03", "polaroid c"),
            photo(STORY_PHOTOS[3], "04", "polaroid d"),
            photo(STORY_PHOTOS[4], "05", "polaroid e"),
            photo(STORY_PHOTOS[5], "06", "polaroid f"),
        ]
    )
    body = f"""
    <main class="scrap-page story-page">
      <section class="scrapbook spread story-spread" aria-label="Halaman cerita">
        <div class="left-page collage-page">
          <p class="label-strip">Inii Favv Akuuu</p>
          <div class="collage-grid">{photos}</div>
        </div>

        <div class="right-page note-page">
          <div class="note-card">
            <span class="paperclip" aria-hidden="true"></span>
            <p class="note-kicker">catatan dari jauh</p>
            <div id="message" class="message" aria-live="polite"></div>
            <div class="progress-dots" id="storyProgress" aria-hidden="true"></div>
            <div class="actions">
              <button class="btn primary" id="nextBtn" type="button">Lanjut</button>
            </div>
          </div>
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu - Cerita",
        "Cerita kecil dalam bentuk scrapbook untuk seseorang.",
        "page-story",
        body,
        "story",
    )


def gift_page():
    body = f"""
    <main class="scrap-page gift-page">
      <section class="scrapbook single-page gift-spread" aria-label="Halaman hadiah">
        <div class="gift-heading">
          <p class="label-strip">emmm...</p>
          <h1>Aku bungkus satu hal kecil ini buat kamu</h1>
          <p id="giftPrompt">Bukan pilihan yang banyak-banyak. Cuman satu kotak kecil yang aku harap kamu sukaa.</p>
        </div>

        <div class="gift-box-wrap">
          <button class="present-box" id="giftBox" type="button" aria-expanded="false" aria-label="Buka kotak hadiah">
            <span class="present-lid" aria-hidden="true">
              <span class="present-bow"></span>
            </span>
            <span class="present-body" aria-hidden="true">
              <span class="present-ribbon vertical"></span>
              <span class="present-ribbon horizontal"></span>
            </span>
            <span class="sweater-photo">
              <img src="{image_asset(SWEATER_IMAGE)}" alt="Foto sweater hadiah" loading="lazy" />
            </span>
          </button>
          <p class="gift-box-note" id="giftBoxNote">Tap kotak kadonya pelan-pelan ya.</p>
        </div>

        <div class="gift-actions">
          <button class="btn primary" id="continueBtn" type="button" hidden disabled>Lanjut</button>
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu - Hadiah",
        "Pilihan hadiah kecil yang romantis dan personal.",
        "page-gift",
        body,
        "gift",
    )


def result_page():
    result = CONFIG["result"]
    body = f"""
    <main class="scrap-page result-page">
      <section class="scrapbook single-page sorry-spread" aria-label="Ucapan maaf hadiah">
        <div class="sorry-card">
          <p class="label-strip">{escape(result["label"])}</p>
          <h1 id="resultTitle">{escape(result["title"])}</h1>
          <p class="sorry-lead">{escape(result["lead"])}</p>
          <figure class="sorry-sweater">
            <img src="{image_asset(SWEATER_IMAGE)}" alt="Foto sweater hadiah" loading="lazy" />
          </figure>
          <p class="final-message" id="finalMessage">{escape(result["note"])}</p>
          <p class="sorry-small">{escape(result["small"])}</p>
          <div class="actions result-actions">
            <button class="btn primary" id="resultNextBtn" type="button">Lanjut</button>
          </div>
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu - Kejutan",
        "Kejutan kecil yang sedang menuju orang tersayang.",
        "page-result",
        body,
        "result",
    )


def love_page():
    love_photos = [0, 1, 2, 3, 8, 9, 10, 11, 12, 13, 14, 15]
    photo_tiles = "\n".join(
        f"""
          <figure class="love-photo love-photo-{i + 1}">
            <img src="{image_asset(IMAGES[index % len(IMAGES)])}" alt="" loading="lazy" />
          </figure>
        """
        for i, index in enumerate(love_photos)
    )
    sparkle_dust = "\n".join(
        f'<span class="love-spark spark-{i + 1}" aria-hidden="true"></span>'
        for i in range(18)
    )
    body = f"""
    <main class="scrap-page love-page">
      <section class="scrapbook single-page love-spread" aria-label="Halaman love terakhir">
        <div class="love-stage">
          <span class="love-paper love-paper-a" aria-hidden="true"></span>
          <span class="love-paper love-paper-b" aria-hidden="true"></span>
          <span class="love-paper love-paper-c" aria-hidden="true"></span>
          <div class="love-photo-heart" aria-hidden="true">
            {photo_tiles}
          </div>
          <div class="love-heart-card">
            <span class="love-heart" aria-hidden="true"></span>
            <p class="label-strip">last page</p>
            <h1>Love you so much.</h1>
            <p>Terima kasih sudah jadi rumah paling hangat buat cerita kecil ini. Kamu berarti, selalu.</p>
          </div>
          <span class="love-ribbon">from me, for you</span>
          {sparkle_dust}
        </div>
      </section>
    </main>
"""
    return render_page(
        "Buat Kamu - Love",
        "Halaman terakhir berisi love kecil untuk seseorang.",
        "page-love",
        body,
        None,
    )


PAGES = {
    "/": cover_page,
    "/about": about_page,
    "/story": story_page,
    "/gift": gift_page,
    "/result": result_page,
    "/love": love_page,
}

REDIRECTS = {
    "/index.html": "/",
    "/about.html": "/about",
    "/main.html": "/story",
    "/gift.html": "/gift",
    "/result.html": "/result",
    "/love.html": "/love",
}


class ScrapbookHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".ts": "text/javascript; charset=utf-8",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        route = self.path.split("?", 1)[0].rstrip("/") or "/"

        if route in PAGES:
            payload = PAGES[route]().encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if route in REDIRECTS:
            self.send_response(HTTPStatus.FOUND)
            self.send_header("Location", REDIRECTS[route])
            self.end_headers()
            return

        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description="Run the scrapbook birthday site.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), ScrapbookHandler)
    print(f"Scrapbook site: http://{args.host}:{args.port}/")
    print(f"Story: http://{args.host}:{args.port}/story")
    print(f"Gift: http://{args.host}:{args.port}/gift")
    server.serve_forever()


if __name__ == "__main__":
    main()
