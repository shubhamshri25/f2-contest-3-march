const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://github.com/trending");

  await page.waitForSelector(".Box-row");

  // extracting repos
  var trendingRepos = await page.evaluate(function () {
    var repoElems = Array.from(document.querySelectorAll(".Box-row"));

    var reposArr = [];

    for (const el of repoElems) {
      const repo = {};
      repo.title = el.querySelector(".h3")?.textContent.trim() || "";
      repo.description = el.querySelector("p.my-1")?.textContent?.trim() || "";
      repo.url =
        `https://github.com${el.querySelector("a")?.getAttribute("href")}` ||
        "";
      repo.stars = parseInt(
        el
          .querySelector(".Link--muted.mr-3")
          ?.textContent?.trim()
          ?.replace(",", "") || "0"
      );
      repo.forks = parseInt(
        el
          .querySelector(".Link--muted.mr-3+ a")
          ?.textContent?.trim()
          ?.replace(",", "") || "0"
      );
      repo.language =
        el
          .querySelector('[itemprop="programmingLanguage"]')
          ?.textContent?.trim() || "";
      reposArr.push(repo);
    }

    return reposArr;
  });

  console.log(" Trending repos are: ", trendingRepos);

  await page.click('[href="/trending/developers"]');

  await browser.close();
})();
