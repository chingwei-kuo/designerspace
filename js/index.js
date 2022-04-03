document.addEventListener('DOMContentLoaded', function() {
    const screenHeight = window.screen.height

    // get all anchor links in header
    const header = document.querySelectorAll('.menu ul li a')
    const headerList = []

    for (let i=0; i<header.length; i++) {
        let href = header[i].href
        if (href && typeof(href) === 'string' && href.includes('#')) {
            href = href.slice(href.indexOf('#'))
            const [top, height] = elementInViewport(document.querySelector(href))
            headerList.push(
                {
                    node: header[i],
                    href,
                    DivTop: top - screenHeight / 3,
                    DivBottom: top + height - screenHeight / 3,
                    LiWidth: header[i].offsetWidth,
                    LiHeight: header[i].offsetHeight,
                    LiLeft: header[i].offsetLeft
                }
            )
        } 
    }

    console.log(headerList)

    const whiteElement = document.createElement('div')
    whiteElement.id = 'whiteElement'
    whiteElement.style.zIndex = 3
    whiteElement.style.backgroundColor = '#fff'
    whiteElement.style.position = 'absolute'
    whiteElement.style.top = 0
    whiteElement.style.left = 0
    whiteElement.style.width = 0
    whiteElement.style.height = 0

    const whiteElementInsert = document.querySelector('.menu ul').appendChild(whiteElement)
    
    // get position 
    const minTop = headerList.sort((a, b) => a.DivTop - b.DivTop)[0].DivTop
    const maxTop = headerList.sort((a, b) => b.DivBottom - a.DivBottom)[0].DivBottom
    console.log(minTop, maxTop)
    let lastScrollPosition = 0

    document.addEventListener('scroll', function() {
        
        if (header.length) {
            window.requestAnimationFrame(function() {
                lastScrollPosition = window.scrollY
                headerList.map(item => {
                    if (item.node.classList.contains('active')) {
                        if (lastScrollPosition > item.DivBottom || lastScrollPosition < item.DivTop ) {
                            item.node.classList.remove('active')
                            if (lastScrollPosition < minTop || lastScrollPosition > maxTop ) {
                                whiteElementInsert.style.width = 0
                            }
                        }
                    } else {
                        if (lastScrollPosition < item.DivBottom && lastScrollPosition > item.DivTop) {
                            item.node.classList.add('active')
                            whiteElementInsert.style.height = `${item.LiHeight}px`
                            whiteElementInsert.style.width = `${item.LiWidth}px`
                            whiteElementInsert.style.left = `${item.LiLeft}px`
                        }
                    }
                })
            })
        }
    });

}, false);

function elementInViewport(el) {
    let top = el.offsetTop;
    let height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
    }

    return [top, height]
}

