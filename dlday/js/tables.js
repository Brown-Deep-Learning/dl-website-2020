function makeTableList(id, options) {      
    var tableList = new List(id, options);

    tableList.on('updated', function(list) {
        if (list.matchingItems.length > 0) {
            $(`#${id} .noresult`).hide()
        } else {
            $(`#${id} .noresult`).show()
        }
    });
    
    if (options.pagination) {
        $(`#${id} .jPaginateNext`).on('click', function(){
            var list = $(`#${id} .pagination`).find('li');
            $.each(list, function(position, element){
                if($(element).is('.active')){
                    $(list[position+1]).trigger('click');
                }
            })
        });
        
        $(`#${id} .jPaginateBack`).on('click', function(){
            var list = $(`#${id} .pagination`).find('li');
            $.each(list, function(position, element){
                if($(element).is('.active')){
                    $(list[position-1]).trigger('click');
                }
            })
        });
    }

    if (options.filters) {
        var activeFilters = {};

        function doFilter() {
            // First, if there are no active filters, we should return everything
            var numActive = 0;
            for (filterProp in activeFilters) {
                numActive += Object.keys(activeFilters[filterProp]).length;
            }
            if (numActive == 0) {
                tableList.filter();
            } else {
                // Otherwise, we have to actually filter based on which filters are selected.
                tableList.filter(function(item) {
                    var vals = item.values();
                    for (filterProp in activeFilters) {
                        // If there are no active filters for this particular property, skip it
                        if (Object.keys(activeFilters[filterProp]).length == 0) {
                            continue;
                        }
                        var itemValsForProp = [vals[filterProp].replace('&amp;', '&')];
                        // All of the active filter values must be in this list
                        for (activeVal of Object.keys(activeFilters[filterProp])) {
                            if (itemValsForProp.indexOf(activeVal) == -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
        }

        $(`#${id} .table-filter`).each(function(_) {
            var filterElem = this;
            var filterDataName = $(filterElem).attr('filterdata');
            $(filterElem).on('change', function(event) {
                activeFilters[filterDataName] = {}
                var val = event.target.value;
                if (val != "")
                    activeFilters[filterDataName][event.target.value] = true
                doFilter();
            });
        });
    }

    return tableList;
}

// -------------------------------------------------------------------

var options = {
    // valueNames: ['pubyear', {data: ['title']}, {data: ['author']}, 'pubvenue',
    //     {data: ['profs']}, {data: ['areas']}],
    valueNames: ['projarea', {data: ['title']}, 'projmembers', 'projtype', 'projmentor'],
    filters: true
};
var pubsTableList = makeTableList('pubstable', options);
pubsTableList.sort('title', {order: 'asc'});