// based on the jQuery source for the grep method
verify = function( elems, callback) {
    var ret = [];

    // Go through the array, only saving the items
    // that pass the validator function
    for ( var i = 0, length = elems.length; i < length; i++ ) {
        if ( callback( elems[ i ], i ) ) {
            ret.push( elems[ i ] );
        }
    }

    return ret;
};

// based on the jQuery source for the unique (Sizzle.uniqueSort) method
unique = function ( results ){
    var elem,
        duplicates = [],
        j = 0,
        i = 0;

    // Unless we *know* we can detect duplicates, assume their presence
    while ( (elem = results[i++]) ) {
        if ( elem === results[ i ] ) {
            j = duplicates.push( i );
        }
    }
    while ( j-- ) {
        results.splice( duplicates[ j ], 1 );
    }

    return results;
};

// jQuery source for the inArray method
inArray = function(elem, arr) {
    var len;

    if (arr) {
        len = arr.length;
        for (var i=0; i < len; i++ ) {
            if(arr[i] === elem){
                return i;
            }
        }
    }

    return -1;
};


