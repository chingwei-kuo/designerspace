document.addEventListener('DOMContentLoaded', function() {
    let screenHeight = window.screen.height
    
    // get all anchor links in header
    const header = document.querySelectorAll('.menu ul li a')
    let headerList = elementsInHeader(header, screenHeight)
    
    // find min max top and bottom for div below
    let minTop = headerList.sort((a, b) => a.DivTop - b.DivTop)[0].DivTop
    let maxTop = headerList.sort((a, b) => b.DivBottom - a.DivBottom)[0].DivBottom

    // find min max left and right for navbar
    let minLeft = headerList.sort((a, b) => a.LiLeft - b.LiLeft)[0].LiLeft
    let maxRight = headerList.sort((a, b) => b.LiRight - a.LiRight)[0].LiRight

    const whiteElement = document.createElement('div')
    whiteElement.id = 'whiteElement'
    whiteElement.style.zIndex = 3
    whiteElement.style.backgroundColor = '#fff'
    whiteElement.style.position = 'absolute'
    whiteElement.style.top = 0
    whiteElement.style.left = `${minLeft}px`
    whiteElement.style.width = 0
    whiteElement.style.height = `${headerList[0].LiHeight}`
    
    const whiteElementInsert = document.querySelector('.menu ul').appendChild(whiteElement)
    
    elementsInHeaderActive(headerList, minTop, maxTop, whiteElementInsert)
    
    window.addEventListener('resize', function() {
        headerList = elementsInHeader(header, screenHeight)
        minTop = headerList.sort((a, b) => a.DivTop - b.DivTop)[0].DivTop
        maxTop = headerList.sort((a, b) => b.DivBottom - a.DivBottom)[0].DivBottom
        minLeft = headerList.sort((a, b) => a.LiLeft - b.LiLeft)[0].LiLeft
        maxRight = headerList.sort((a, b) => b.LiRight - a.LiRight)[0].LiRight

        const getWhiteElement = document.querySelector('#whiteElement')
        const getActiveElement = document.querySelector('.menu ul li .active')
        if (getWhiteElement) {
            whiteElement.style.left = `${getActiveElement.offsetLeft}px`
            whiteElement.style.width = `${getActiveElement.offsetWidth}px`
        }
    })

    document.addEventListener('scroll', function() {
        if (header.length) {
            elementsInHeaderActive(headerList, minTop, maxTop, whiteElementInsert)
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

function elementDimension(el) {
    let elTop = el.offsetTop;
    let elLeft = el.offsetLeft;
    let elRight = el.offsetRight;
    let elHeight = el.offsetHeight;
    let elWidth = el.offsetWidth;
    
    while(el.offsetParent) {
        el = el.offsetParent;
        elTop += el.offsetTop;
        elLeft += el.offsetLeft;
        elRight += el.offsetRight;
    }
    
    return [elTop, elLeft, elRight, elHeight, elWidth]
}

function elementsInHeader(elList, screenHeight) {
    const headerList = []
    for (let i=0; i<elList.length; i++) {
        let href = elList[i].href
        if (href && typeof(href) === 'string' && href.includes('#')) {
            href = href.slice(href.indexOf('#'))
            const [top, height] = elementInViewport(document.querySelector(href))
            const [_, elLeft, elRight, elHeight, elWidth] = elementDimension(elList[i])
            headerList.push(
                {
                    node: elList[i],
                    href,
                    DivTop: top - screenHeight / 3,
                    DivBottom: i + 1 === elList.length ? top + height : top + height - screenHeight / 3,
                    LiWidth: elWidth,
                    LiHeight: elHeight,
                    LiLeft: elLeft,
                    LiRight: elRight,
                }
            )
        } 
    }
    return headerList
}

function elementsInHeaderActive(elList, minTop, maxTop, activeNode) {
    window.requestAnimationFrame(function() {
        const lastScrollPosition = window.scrollY
        elList.map(item => {
            if (item.node.classList.contains('active')) {
                if (lastScrollPosition > item.DivBottom || lastScrollPosition < item.DivTop ) {
                    item.node.classList.remove('active')
                    if (lastScrollPosition < minTop || lastScrollPosition > maxTop ) {
                        activeNode.style.width = 0
                    }
                }
            } else {
                if (lastScrollPosition < item.DivBottom && lastScrollPosition > item.DivTop) {
                    item.node.classList.add('active')
                    activeNode.style.height = `${item.LiHeight}px`
                    activeNode.style.width = `${item.LiWidth}px`
                    activeNode.style.left = `${item.LiLeft}px`
                }
            }
        })
    })
}