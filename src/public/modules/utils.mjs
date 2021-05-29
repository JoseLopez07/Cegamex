//Show page elements
function showPageElements() {
    let loadingParents = document.getElementsByClassName('loading');
    let loadingChildren = document.getElementsByClassName('loading-child');
    let collapseItems = document.getElementsByClassName('dont-collapse-sm');
 
    loadingParents = Array.from(loadingParents);
    loadingChildren = Array.from(loadingChildren);
    collapseItems = Array.from(collapseItems);
 
    [].forEach.call(loadingParents, function(p) {
       p.classList.remove("loading");
       p.classList.add("shadow")
    });
    [].forEach.call(loadingChildren, function(c) {
       c.classList.remove("loading-child");
    });
    [].forEach.call(collapseItems, function(c) {
       c.classList.add("collapse");
    });
}

export default { showPageElements };