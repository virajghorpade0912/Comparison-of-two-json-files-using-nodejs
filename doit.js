let srcdata = require('./New.json');
let destdata = require('./CLIENT-data.json');
let getValues = data => Object.values(data);
let groupBy = property => data => getValues(data.reduce((agr, item) => {
    let col = agr[item[property]] = agr[item[property]] || {
        key: item[property],
        items: []
    };
    col.items.push(item);
    return agr;
}, {}))

let srcData = groupBy("TABLE_SCHEMA")(srcdata).map(item => {
    item.items = groupBy("TABLE_NAME")(item.items);
    return item;
});
let destData = groupBy("TABLE_SCHEMA")(destdata).map(item => {
    item.items = groupBy("TABLE_NAME")(item.items);
    return item;
});

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}
let commondata = (srcData, destData) => {

    let commontables =[];
    let commoncolumns = [];
    let commondatatype = [];

    srcData.forEach((i) => {
        i.items.forEach((x) => {
            x.items.forEach((l) => {
                destData.forEach((z) => {
                    z.items.forEach((y) => {
                        y.items.forEach((o) => {
                            if (l.TABLE_NAME === o.TABLE_NAME) {
                                commontables.push(l.TABLE_NAME);

                                if (l.COLUMN_NAME === o.COLUMN_NAME) {
                                    // console.log(l.COLUMN_NAME+"  "+o.COLUMN_NAME);
                                    commoncolumns.push(l.COLUMN_NAME);
                                    if (l.DATA_TYPE === o.DATA_TYPE) {
                                        // console.log(l.DATA_TYPE+"  "+o.DATA_TYPE);
                                        commondatatype.push(l.DATA_TYPE);
                                    }
                                }
                            }
                        })
                    })
                })
            })
        })

    })
    return {
        cc: commoncolumns,
        bb: commondatatype,
        kk: commontables
    }

}

let cot = commondata(srcData, destData).kk;

let col = commondata(srcData, destData).cc;
let cod = commondata(srcData, destData).bb;

let cotab = cot.filter(distinct);
let comcol = col.filter(distinct);
let comdtype = cod.filter(distinct);


console.log("CommonTables********************************************************************");
console.table(cotab);


console.log("CommonColumns*******************************************************************");
console.table(comcol); 

console.log("CommonDatatypes******************************************************************");
console.table(comdtype);


