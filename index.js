const Router = require('./router')


addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})


let linklst = [{"name": "CloudFlare", "url": "https://www.cloudflare.com/"}, 
                {"name": "Zhou's resume", "url": "https://drive.google.com/file/d/1YEanO6Fgvc1ZCbxdT7Nm3khAjGDhETSh/view?usp=sharing"},
                   {"name": "Zhou's Portfolio", "url": "https://zhouxing19.github.io/"},
                   {"name": "Zhou's Linkedin", "url": "https://www.linkedin.com/in/zhouxing98/"},
                {"name": "UChicago - ChiData", "url": "https://data.cs.uchicago.edu/"}]


class LinksTransformer {
constructor(links) {
    this.links = linklst
}

async element(element) {
        for (var i = 0; i < linklst.length;i++){
        element.append('<a href="' + linklst[i].url + '">' + linklst[i].name + '</a>', {"html": true})
        }
}
} 


async function fetchRequest() {
    const myurl = "https://static-links-page.signalnerve.workers.dev"

    const res = await fetch(myurl)

    const rewriter = new HTMLRewriter()
        .on('div#links', new LinksTransformer()).transform(res)

    return rewriter    
   
  }
  


function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(linklst)
    return new Response(body, init)
}


async function handleRequest(request) {
    const r = new Router()

    r.get('/lists', request => handler(request))
    r.get('.*', () => fetchRequest())

    const resp = await r.route(request)
    return resp
}
