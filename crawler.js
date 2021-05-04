const writer = require('fs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

var args = process.argv

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://legendas.tv/login');
    await page.click('#UserUsername');
    await page.keyboard.type(args[2]);
    await page.click('#UserPassword')
    await page.keyboard.type(args[3]);
    await page.click('#UserLoginForm > button')

    writer.writeFile(`${data['search']}.json`, '', function (err) {
        if (err) return console.log(err);
    });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    var legends = [];

    var BaseURL = 'http://legendas.tv'

    let firstURLToSearch = 'http://legendas.tv/legenda/busca/#/1/-/0/-'
    let textSearch = replaceAll(data['search'], ' ', '%20')

    let searchURL = firstURLToSearch.replace('#', textSearch)

    await page.goto(searchURL)

    var baseSelector = "body > div.container > div:nth-child(3) > div > article:nth-child"

    var firstElementSelector1 = baseSelector + '(1) > div:nth-child(1) > div > p:nth-child(1) > a';
    var firstElementSelector2 = baseSelector + '(2) > div:nth-child(1) > div > p:nth-child(1) > a';

    var ArticleElement1 = baseSelector + '(1) > div';
    var ArticleElement2 = baseSelector + '(2) > div';

    let QuantityElements1 = await page.evaluate((sel) => {
        let el = document.querySelectorAll(sel)
        return el ? el.length : false;
    }, ArticleElement1)

    let QuantityElements2 = await page.evaluate((sel) => {
        let el = document.querySelectorAll(sel)
        return el ? el.length : false;
    }, ArticleElement2)


    let textSelector1 = baseSelector + '(1) > div:nth-child(1) > div > p.data';
    let textSelector2 = baseSelector + '(2) > div:nth-child(1) > div > p.data';

    let querySelectorLink1 = baseSelector + '(1) > div:nth-child(1) > div > p:nth-child(1) > a'
    let querySelectorLink2 = baseSelector + '(2) > div:nth-child(1) > div > p:nth-child(1) > a'

    let idiomaSelector1 = baseSelector + '(1) > div:nth-child(1) > img'
    let idiomaSelector2 = baseSelector + '(2) > div:nth-child(1) > img'


    var page_number = 1;
    while (QuantityElements1 > 0 || QuantityElements2 > 0) {

        var actual_url = await page.url()

        for (let i = 1; i <= QuantityElements1; i++) {

            let Name = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.innerText : false;
            }, firstElementSelector1.replace('div:nth-child(1)', `div:nth-child(${i})`))

                array1 = data['search'].toUpperCase().split(' ')

            if (!Name.toUpperCase().includes(array1[1])) {
                continue;
            }

            let Text = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.textContent : false;
            }, textSelector1.replace('div:nth-child(1)', `div:nth-child(${i})`))


            let Link = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.getAttribute('href') : false;
            }, querySelectorLink1.replace('div:nth-child(1)', `div:nth-child(${i})`))


            let idioma = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.getAttribute('alt') : false;
            }, idiomaSelector1.replace('div:nth-child(1)', `div:nth-child(${i})`))

            let linkGoTo = BaseURL + Link

            async function createJson(url) {
                var response = await fetch(url);
                var template = await response.text();
                var ratings = template.match(/(?<=\<\/span><\/a>)(.*)(?=\<\/p>)/g);
                let positive = ratings[0];
                let negative = ratings[1];
                negative = negative > 0 ? negative : 1
                let rating = positive / negative

                legends.push(
                    {
                        "Name": Name,
                        "QuantityDownloads": Text.split(' ')[0],
                        "CaptionNote": Text.split(' ')[3].replace(',', ''),
                        "LikeRatio": parseFloat(rating.toFixed(2)),
                        "WhoSend": Text.split(' ')[6],
                        "DateSend": Text.split(' ')[8],
                        "Idioma": idioma,
                        "LinkDownload": 'http://legendas.tv/downloadarquivo/' + Link.split("/")[2],
                    }
                )

            };
            await createJson(linkGoTo)
        }

        for (let i = 1; i <= QuantityElements2; i++) {

            let Name = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.innerText : false;
            }, firstElementSelector2.replace('div:nth-child(1)', `div:nth-child(${i})`))

                array1 = data['search'].toUpperCase().split(' ')

                if (!Name.toUpperCase().includes(array1[1])) {
                    continue;
                }

            let Text = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.textContent : false;
            }, textSelector2.replace('div:nth-child(1)', `div:nth-child(${i})`))


            let Link = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.getAttribute('href') : false;
            }, querySelectorLink2.replace('div:nth-child(1)', `div:nth-child(${i})`))


            let idioma = await page.evaluate((sel) => {
                let el = document.querySelector(sel)
                return el ? el.getAttribute('alt') : false;
            }, idiomaSelector2.replace('div:nth-child(1)', `div:nth-child(${i})`))

            let linkGoTo = BaseURL + Link

            async function createJson(url) {
                var response = await fetch(url);
                var template = await response.text();
                var ratings = template.match(/(?<=\<\/span><\/a>)(.*)(?=\<\/p>)/g);
                let positive = ratings[0];
                let negative = ratings[1];
                negative = negative > 0 ? negative : 1
                let rating = positive / negative

                legends.push(
                    {
                        "Name": Name,
                        "QuantityDownloads": Text.split(' ')[0],
                        "CaptionNote": Text.split(' ')[3].replace(',', ''),
                        "LikeRatio": parseFloat(rating.toFixed(2)),
                        "WhoSend": Text.split(' ')[6],
                        "DateSend": Text.split(' ')[8],
                        "Idioma": idioma,
                        "LinkDownload": 'http://legendas.tv/downloadarquivo/' + Link.split("/")[2],
                    }
                )
            };
            await createJson(linkGoTo)
        }

        var newpage = actual_url.replace(`-/${page_number - 1}/-`, `-/${page_number}/-`)
        await page.goto(newpage)

        QuantityElements1 = await page.evaluate((sel) => {
            let el = document.querySelectorAll(sel)
            return el ? el.length : false;
        }, ArticleElement1)

        QuantityElements2 = await page.evaluate((sel) => {
            let el = document.querySelectorAll(sel)
            return el ? el.length : false;
        }, ArticleElement2)

        page_number++;
    }

    writer.appendFile(`${data['search']}.json`, `${JSON.stringify(legends)}`, function (err) {
        if (err) throw err;
    });

    console.log(`Foram encontradas ${legends.length} legendas!`)
    await browser.close();
}

run();

const data = {
    search: 'Os Simpsons'
}
